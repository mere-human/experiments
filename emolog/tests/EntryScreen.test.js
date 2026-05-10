import { jest } from '@jest/globals';

async function loadEntryScreen() {
  return await import('../src/screens/EntryScreen.js');
}

describe('EntryScreen', () => {
  let getItemSpy;
  let setItemSpy;

  beforeEach(async () => {
    document.body.innerHTML = '<div id="app"></div>';
    jest.resetModules();
    jest.restoreAllMocks();
    jest.spyOn(window, 'setInterval').mockImplementation(() => 0);

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
      },
    });

    getItemSpy = window.localStorage.getItem;
    setItemSpy = window.localStorage.setItem;
  });

  it('renders the entry form with all required controls', async () => {
    const module = await loadEntryScreen();
    const screen = new module.EntryScreen();
    const element = screen.render();

    expect(element.querySelector('h1').textContent).toBe('Log Your Emotion');
    expect(element.querySelector('#emotion-select')).toBeTruthy();
    expect(element.querySelector('#note')).toBeTruthy();
    expect(element.querySelector('#save-btn')).toBeTruthy();
    expect(element.querySelector('#status-text')).toBeTruthy();
    expect(element.querySelector('#current-time').textContent).not.toBe('');
  });

  it('shows validation error when save is clicked without selecting an emotion', async () => {
    const module = await loadEntryScreen();
    const screen = new module.EntryScreen();
    const element = screen.render();
    document.body.appendChild(element);

    const saveButton = element.querySelector('#save-btn');
    saveButton.click();

    const statusText = element.querySelector('#status-text');
    expect(statusText.textContent).toBe('Please select an emotion.');
    expect(statusText.style.color).toBe('rgb(185, 28, 28)');
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it('saves a new entry and resets the form when valid data is submitted', async () => {
    const module = await loadEntryScreen();
    const screen = new module.EntryScreen();
    const element = screen.render();
    document.body.appendChild(element);

    const emotionSelect = element.querySelector('#emotion-select');
    const noteInput = element.querySelector('#note');
    const saveButton = element.querySelector('#save-btn');
    const statusText = element.querySelector('#status-text');

    const happyOption = element.querySelector('option[value="happy"]');
    expect(happyOption).toBeTruthy();
    emotionSelect.value = happyOption.value;
    noteInput.value = 'Feeling good today.';

    saveButton.click();

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    const savedJson = setItemSpy.mock.calls[0][1];
    const savedEntries = JSON.parse(savedJson);
    expect(savedEntries).toHaveLength(1);
    expect(savedEntries[0]).toMatchObject({
      emotionId: 'happy',
      note: 'Feeling good today.',
    });
    expect(new Date(savedEntries[0].timestamp).toString()).not.toBe('Invalid Date');
    expect(statusText.textContent).toBe('Saved.');
    expect(statusText.style.color).toBe('rgb(15, 118, 110)');
    expect(emotionSelect.value).toBe('');
    expect(noteInput.value).toBe('');
  });
});
