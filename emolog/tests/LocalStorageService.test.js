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
});