import { emotions } from '../models/emotions.js';
import { Entry } from '../models/Entry.js';
import { LocalStorageService } from '../storage/localStorage.js';

export class EntryScreen {
  render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <h1>Log Your Emotion</h1>
      <p>Current time: <span id="current-time"></span></p>
      <label for="emotion-select">Emotion:</label>
      <select id="emotion-select">
        <option value="">Select emotion</option>
        ${emotions.map(emo => `<option value="${emo.id}">${emo.icon} ${emo.name}</option>`).join('')}
      </select>
      <br>
      <label for="note">Note (optional):</label>
      <textarea id="note"></textarea>
      <br>
      <button id="save-btn">Save Entry</button>
    `;

    // Update time
    const timeSpan = container.querySelector('#current-time');
    const updateTime = () => {
      timeSpan.textContent = new Date().toLocaleString();
    };
    updateTime();
    setInterval(updateTime, 1000); // update every second

    // Save handler
    const saveBtn = container.querySelector('#save-btn');
    saveBtn.addEventListener('click', () => {
      const emotionId = container.querySelector('#emotion-select').value;
      const note = container.querySelector('#note').value;
      if (!emotionId) {
        alert('Please select an emotion');
        return;
      }
      const entry = new Entry(emotionId, note);
      LocalStorageService.saveEntry(entry);
      alert('Entry saved!');
      // Reset form
      container.querySelector('#emotion-select').value = '';
      container.querySelector('#note').value = '';
    });

    return container;
  }
}