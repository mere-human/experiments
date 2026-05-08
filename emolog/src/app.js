import { EntryScreen } from './screens/EntryScreen.js';
import { HistoryScreen } from './screens/HistoryScreen.js';

const app = document.getElementById('app');
const entryScreen = new EntryScreen();
const historyScreen = new HistoryScreen();

const TEST_HISTORY_SCREEN = true;

if (TEST_HISTORY_SCREEN) {
  app.appendChild(historyScreen.render());
} else {
  app.appendChild(entryScreen.render());
}
