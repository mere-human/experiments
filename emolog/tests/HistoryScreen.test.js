import { jest } from '@jest/globals';

async function loadHistoryScreen() {
  return await import('../src/screens/HistoryScreen.js');
}

describe('HistoryScreen', () => {
  let setItemSpy;
  let getItemSpy;

  beforeEach(async () => {
    document.body.innerHTML = '<div id="app"></div>';
    jest.resetModules();
    jest.restoreAllMocks();

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
      },
    });

    getItemSpy = window.localStorage.getItem;
    setItemSpy = window.localStorage.setItem;

    global.confirm = jest.fn(() => true);
  });

  it('renders empty state when no entries exist', async () => {
    const module = await loadHistoryScreen();
    const screen = new module.HistoryScreen();
    const element = screen.render();

    expect(element.querySelector('h1').textContent).toBe('Emotion History');
    expect(element.querySelector('.empty-state')).toBeTruthy();
    expect(element.querySelector('.empty-state p').textContent).toContain('No emotion entries yet');
  });

  it('loads and sorts entries by timestamp descending', async () => {
    const module = await loadHistoryScreen();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const entries = [
      { emotionId: 'happy', note: 'First entry', timestamp: yesterday.toISOString() },
      { emotionId: 'sad', note: 'Second entry', timestamp: now.toISOString() },
    ];
    getItemSpy.mockReturnValue(JSON.stringify(entries));

    const screen = new module.HistoryScreen();
    screen.loadEntries();

    expect(screen.entries).toHaveLength(2);
    expect(screen.entries[0].timestamp > screen.entries[1].timestamp).toBe(true);
  });

  it('groups entries by date correctly', async () => {
    const module = await loadHistoryScreen();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const entries = [
      { emotionId: 'happy', note: '', timestamp: now },
      { emotionId: 'sad', note: '', timestamp: now },
      { emotionId: 'angry', note: '', timestamp: yesterday },
    ];

    const screen = new module.HistoryScreen();
    const grouped = screen.groupByDate(entries);

    const todayKey = now.toISOString().split('T')[0];
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped[todayKey]).toHaveLength(2);
    expect(grouped[yesterdayKey]).toHaveLength(1);
  });

  it('formats date labels correctly', async () => {
    const module = await loadHistoryScreen();
    const screen = new module.HistoryScreen();

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    expect(screen.formatDateGroup(today)).toBe('Today');
    expect(screen.formatDateGroup(yesterday)).toBe('Yesterday');
    expect(screen.formatDateGroup(lastWeek)).toBeTruthy();
    expect(screen.formatDateGroup(lastWeek)).not.toBe('Today');
    expect(screen.formatDateGroup(lastWeek)).not.toBe('Yesterday');
  });

  it('renders entry cards with emotion, note, and timestamp', async () => {
    const module = await loadHistoryScreen();
    const now = new Date();
    const entry = { emotionId: 'happy', note: 'Feeling great!', timestamp: now };

    const screen = new module.HistoryScreen();
    const card = screen.renderEntryCard(entry, 0);

    expect(card.querySelector('.emotion-icon')).toBeTruthy();
    expect(card.querySelector('.emotion-name').textContent).toBe('Happy');
    expect(card.querySelector('.entry-note')).toBeTruthy();
    expect(card.querySelector('.entry-note').textContent).toBe('Feeling great!');
    expect(card.querySelector('.entry-time')).toBeTruthy();
    expect(card.querySelector('.edit-btn[data-index="0"]')).toBeTruthy();
    expect(card.querySelector('.delete-btn[data-index="0"]')).toBeTruthy();
  });

  it('renders entry cards without note if note is empty', async () => {
    const module = await loadHistoryScreen();
    const entry = { emotionId: 'sad', note: '', timestamp: new Date() };

    const screen = new module.HistoryScreen();
    const card = screen.renderEntryCard(entry, 0);

    expect(card.querySelector('.entry-note')).toBeFalsy();
  });

  it('opens edit modal with current entry data', async () => {
    const module = await loadHistoryScreen();
    const now = new Date();
    const entries = [{ emotionId: 'happy', note: 'Test note', timestamp: now }];

    getItemSpy.mockReturnValue(JSON.stringify(entries));

    const screen = new module.HistoryScreen();
    const element = screen.render();
    document.body.appendChild(element);

    screen.openEditModal(0);

    const modal = element.querySelector('.edit-modal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(element.querySelector('#edit-emotion-select').value).toBe('happy');
    expect(element.querySelector('#edit-note').value).toBe('Test note');
  });

  it('closes edit modal', async () => {
    const module = await loadHistoryScreen();
    const screen = new module.HistoryScreen();
    const element = screen.render();
    document.body.appendChild(element);

    const modal = element.querySelector('.edit-modal');
    modal.classList.add('show');
    expect(modal.classList.contains('show')).toBe(true);

    screen.closeEditModal();

    expect(modal.classList.contains('show')).toBe(false);
  });

  it('deletes an entry after confirmation', async () => {
    const module = await loadHistoryScreen();
    const entries = [
      { emotionId: 'happy', note: '', timestamp: new Date().toISOString() },
      { emotionId: 'sad', note: '', timestamp: new Date().toISOString() },
    ];
    getItemSpy.mockReturnValue(JSON.stringify(entries));

    const screen = new module.HistoryScreen();
    const element = screen.render();
    document.body.appendChild(element);

    global.confirm.mockReturnValue(true);
    screen.handleDelete(0, element);

    expect(setItemSpy).toHaveBeenCalled();
    const savedJson = setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1][1];
    const saved = JSON.parse(savedJson);
    expect(saved).toHaveLength(1);
    expect(saved[0].emotionId).toBe('sad');
  });

  it('does not delete entry if confirmation is cancelled', async () => {
    const module = await loadHistoryScreen();
    const entries = [{ emotionId: 'happy', note: '', timestamp: new Date().toISOString() }];
    getItemSpy.mockReturnValue(JSON.stringify(entries));

    const screen = new module.HistoryScreen();
    const element = screen.render();
    document.body.appendChild(element);

    global.confirm.mockReturnValue(false);
    setItemSpy.mockClear();
    screen.handleDelete(0, element);

    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it('renders entries grouped by date when data is available', async () => {
    const module = await loadHistoryScreen();
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const entries = [
      { emotionId: 'happy', note: '', timestamp: now.toISOString() },
      { emotionId: 'sad', note: '', timestamp: yesterday.toISOString() },
    ];
    getItemSpy.mockReturnValue(JSON.stringify(entries));

    const screen = new module.HistoryScreen();
    const element = screen.render();

    expect(element.querySelector('.empty-state')).toBeFalsy();
    expect(element.querySelectorAll('.date-group')).toHaveLength(2);
    const dateHeaders = element.querySelectorAll('.date-group h2');
    expect(dateHeaders[0].textContent).toBe('Today');
    expect(dateHeaders[1].textContent).toBe('Yesterday');
  });

  it('displays unknown emotion with fallback icon', async () => {
    const module = await loadHistoryScreen();
    const entry = { emotionId: 'unknown-emotion', note: '', timestamp: new Date() };

    const screen = new module.HistoryScreen();
    const card = screen.renderEntryCard(entry, 0);

    expect(card.querySelector('.emotion-name').textContent).toBe('Unknown');
    expect(card.querySelector('.emotion-icon').textContent).toBe('❓');
  });
});
