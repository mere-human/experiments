import { jest } from '@jest/globals';

async function loadAppModule() {
  return await import('../src/app.js');
}

describe('App navigation logic', () => {
  let App;
  let entryRenderSpy;
  let historyRenderSpy;

  beforeEach(async () => {
    document.body.innerHTML = '<div id="app"></div>';
    jest.resetModules();
    jest.restoreAllMocks();
    jest.spyOn(window, 'setInterval').mockImplementation(() => 0);

    const EntryScreenModule = await import('../src/screens/EntryScreen.js');
    const HistoryScreenModule = await import('../src/screens/HistoryScreen.js');

    entryRenderSpy = jest.spyOn(EntryScreenModule.EntryScreen.prototype, 'render');
    historyRenderSpy = jest.spyOn(HistoryScreenModule.HistoryScreen.prototype, 'render');

    const appModule = await loadAppModule();
    App = appModule.App;

    entryRenderSpy.mockClear();
    historyRenderSpy.mockClear();
  });

  it('renders entry screen by default and highlights the entry nav button', () => {
    const app = new App();
    app.render();

    expect(app.currentScreen).toBe('entry');
    expect(entryRenderSpy).toHaveBeenCalledTimes(1);
    expect(historyRenderSpy).not.toHaveBeenCalled();

    const entryButton = document.querySelector('#nav-entry');
    const historyButton = document.querySelector('#nav-history');
    expect(entryButton.classList.contains('active')).toBe(true);
    expect(historyButton.classList.contains('active')).toBe(false);
    expect(document.querySelector('.entry-screen')).toBeTruthy();
  });

  it('navigates to history screen and updates active nav state', () => {
    const app = new App();
    app.navigate('history');

    expect(app.currentScreen).toBe('history');
    expect(historyRenderSpy).toHaveBeenCalledTimes(1);

    const entryButton = document.querySelector('#nav-entry');
    const historyButton = document.querySelector('#nav-history');
    expect(historyButton.classList.contains('active')).toBe(true);
    expect(entryButton.classList.contains('active')).toBe(false);
    expect(document.querySelector('.history-screen')).toBeTruthy();
  });

  it('responds to nav button clicks and toggles screens', () => {
    const app = new App();
    app.render();

    document.querySelector('#nav-history').click();
    expect(app.currentScreen).toBe('history');
    expect(document.querySelector('.history-screen')).toBeTruthy();

    document.querySelector('#nav-entry').click();
    expect(app.currentScreen).toBe('entry');
    expect(document.querySelector('.entry-screen')).toBeTruthy();
  });
});
