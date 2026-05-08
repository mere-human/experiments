import { EntryScreen } from './screens/EntryScreen.js';
import { HistoryScreen } from './screens/HistoryScreen.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app');
    this.currentScreen = 'entry'; // 'entry' or 'history'
    this.entryScreen = new EntryScreen();
    this.historyScreen = new HistoryScreen();
  }

  navigate(screen) {
    this.currentScreen = screen;
    this.render();
  }

  render() {
    // Clear app
    this.appElement.innerHTML = '';

    // Render current screen
    let screenElement;
    if (this.currentScreen === 'entry') {
      screenElement = this.entryScreen.render();
    } else if (this.currentScreen === 'history') {
      screenElement = this.historyScreen.render();
    }

    // Create navigation bar
    const navBar = this.createNavBar();

    // Append screen and nav
    this.appElement.appendChild(screenElement);
    this.appElement.appendChild(navBar);
  }

  createNavBar() {
    const nav = document.createElement('nav');
    nav.className = 'nav-bar';
    nav.innerHTML = `
      <button id="nav-entry" class="nav-btn ${this.currentScreen === 'entry' ? 'active' : ''}">
        Log Emotion
      </button>
      <button id="nav-history" class="nav-btn ${this.currentScreen === 'history' ? 'active' : ''}">
        History
      </button>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .nav-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        background: #fff;
        border-top: 1px solid #e5e7eb;
        padding: 12px;
        gap: 8px;
        justify-content: space-around;
      }

      .nav-btn {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        background: #f3f4f6;
        color: #374151;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s;
      }

      .nav-btn:hover {
        background: #e5e7eb;
      }

      .nav-btn.active {
        background: #2563eb;
        color: #fff;
      }

      .nav-btn.active:hover {
        background: #1d4ed8;
      }
    `;
    nav.appendChild(style);

    // Add event listeners
    nav.addEventListener('click', (e) => {
      if (e.target.id === 'nav-entry') {
        this.navigate('entry');
      } else if (e.target.id === 'nav-history') {
        this.navigate('history');
      }
    });

    return nav;
  }
}

// Initialize app
const app = new App();
app.render();
