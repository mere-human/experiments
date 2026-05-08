import { emotions } from '../models/emotions.js';
import { Entry } from '../models/Entry.js';
import { LocalStorageService } from '../storage/localStorage.js';

export class EntryScreen {
  render() {
    const container = document.createElement('div');
    container.className = 'entry-screen';
    container.innerHTML = `
      <h1>Log Your Emotion</h1>
      <p class="current-time-label">Current time: <span id="current-time"></span></p>
      <div class="field">
        <label for="emotion-select">Emotion</label>
        <select id="emotion-select">
          <option value="">Select emotion</option>
          ${emotions.map(emo => `<option value="${emo.id}">${emo.icon} ${emo.name}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label for="note">Note (optional)</label>
        <textarea id="note"></textarea>
      </div>
      <button id="save-btn">Save</button>
      <p id="status-text" class="status-text"></p>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .entry-screen {
        max-width: 480px;
        margin: 0 auto;
        padding: 20px;
        padding-bottom: 100px; /* Space for nav bar */
        display: flex;
        flex-direction: column;
        gap: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .current-time-label {
        margin: 0;
        color: #666;
        font-size: 0.95rem;
      }

      .field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      label {
        font-weight: 600;
      }

      select,
      textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        font-size: 1rem;
        background: #fff;
        box-sizing: border-box;
      }

      textarea {
        min-height: 120px;
        resize: vertical;
      }

      #save-btn {
        width: fit-content;
        padding: 12px 20px;
        border: none;
        border-radius: 12px;
        background: #2563eb;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
      }

      #save-btn:hover {
        background: #1d4ed8;
      }

      .status-text {
        margin: 0;
        min-height: 1.2rem;
        color: #0f766e;
        font-size: 0.95rem;
      }
    `;
    container.prepend(style);

    // Update time
    const timeSpan = container.querySelector('#current-time');
    const updateTime = () => {
      timeSpan.textContent = new Date().toLocaleString();
    };
    updateTime();
    setInterval(updateTime, 1000); // update every second

    const statusText = container.querySelector('#status-text');
    const emotionSelect = container.querySelector('#emotion-select');
    const noteInput = container.querySelector('#note');

    const clearStatus = () => {
      statusText.textContent = '';
    };

    emotionSelect.addEventListener('input', clearStatus);
    noteInput.addEventListener('input', clearStatus);

    // Save handler
    const saveBtn = container.querySelector('#save-btn');
    saveBtn.addEventListener('click', () => {
      const emotionId = emotionSelect.value;
      const note = noteInput.value;
      if (!emotionId) {
        statusText.textContent = 'Please select an emotion.';
        statusText.style.color = '#b91c1c';
        return;
      }
      const entry = new Entry(emotionId, note);
      LocalStorageService.saveEntry(entry);
      statusText.textContent = 'Saved.';
      statusText.style.color = '#0f766e';
      // Reset form
      emotionSelect.value = '';
      noteInput.value = '';
    });

    return container;
  }
}