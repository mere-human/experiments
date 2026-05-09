import { LocalStorageService } from '../src/storage/localStorage.js';
import { Entry } from '../src/models/Entry.js';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('LocalStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null); // Simulate empty storage initially
  });

  it('saves an entry', () => {
    const entry = new Entry('happy', 'Test note');

    LocalStorageService.saveEntry(entry);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'emolog_entries',
      JSON.stringify([entry])
    );
  });

  it('loads entries and restores Entry instances', () => {
    const storedEntry = {
      emotionId: 'sad',
      note: 'Hard day',
      timestamp: '2024-01-01T12:00:00.000Z'
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([storedEntry]));

    const entries = LocalStorageService.loadEntries();

    expect(entries).toHaveLength(1);
    expect(entries[0]).toBeInstanceOf(Entry);
    expect(entries[0].emotionId).toBe('sad');
    expect(entries[0].note).toBe('Hard day');
    expect(entries[0].timestamp).toBeInstanceOf(Date);
    expect(entries[0].timestamp.toISOString()).toBe(storedEntry.timestamp);
  });

  it('updates an existing entry by index', () => {
    const original = { emotionId: 'angry', note: 'yelled', timestamp: '2024-01-01T00:00:00.000Z' };
    const updatedEntry = new Entry('happy', 'Fixed it', new Date('2024-01-02T00:00:00.000Z'));
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([original]));

    LocalStorageService.updateEntry(0, updatedEntry);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'emolog_entries',
      JSON.stringify([updatedEntry])
    );
  });

  it('deletes an entry by index', () => {
    const first = { emotionId: 'sad', note: '', timestamp: '2024-01-01T00:00:00.000Z' };
    const second = { emotionId: 'happy', note: '', timestamp: '2024-01-02T00:00:00.000Z' };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([first, second]));

    LocalStorageService.deleteEntry(0);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'emolog_entries',
      JSON.stringify([second])
    );
  });

  it('does not update when index is out of bounds', () => {
    const entry = new Entry('happy', 'Test');
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));

    LocalStorageService.updateEntry(5, entry);

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  it('does not delete when index is out of bounds', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([]));

    LocalStorageService.deleteEntry(2);

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });
});