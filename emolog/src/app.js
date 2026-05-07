import { EntryScreen } from './screens/EntryScreen.js';

const app = document.getElementById('app');
const entryScreen = new EntryScreen();
app.appendChild(entryScreen.render());