import { emotions } from '../models/emotions.js';
import { Entry } from '../models/Entry.js';
import { LocalStorageService } from '../storage/localStorage.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // milliseconds in one day

export class HistoryScreen {
  constructor() {
    this.entries = [];
    this.emotionsMap = new Map(emotions.map(e => [e.id, e]));
  }

  render() {
    this.loadEntries();
    const container = document.createElement('div');
    container.className = 'history-screen';

    const header = document.createElement('h1');
    header.textContent = 'Emotion History';
    container.appendChild(header);

    if (this.entries.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <p>No emotion entries yet. Start tracking by logging your first emotion!</p>
        <button id="go-to-log">Log Emotion</button>
      `;
      container.appendChild(emptyState);
    } else {
      const grouped = this.groupByDate(this.entries);
      for (const [dateKey, groupEntries] of Object.entries(grouped)) {
        const dateGroup = document.createElement('div');
        dateGroup.className = 'date-group';
        const dateHeader = document.createElement('h2');
        dateHeader.textContent = this.formatDateGroup(dateKey);
        dateGroup.appendChild(dateHeader);

        groupEntries.forEach(({ entry, index }) => {
          const card = this.renderEntryCard(entry, index);
          dateGroup.appendChild(card);
        });
        container.appendChild(dateGroup);
      }
    }

    // Edit modal
    const editModal = this.createEditModal();
    container.appendChild(editModal);

    const style = document.createElement('style');
    style.textContent = `
      .history-screen {
        max-width: 480px;
        margin: 0 auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .date-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .date-group h2 {
        margin: 0;
        font-size: 1.1rem;
        color: #666;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 8px;
      }

      .entry-card {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px;
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .entry-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.2rem;
        font-weight: 600;
      }

      .entry-body {
        color: #374151;
      }

      .entry-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: #6b7280;
      }

      .entry-actions {
        display: flex;
        gap: 8px;
      }

      .entry-actions button {
        padding: 6px 12px;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        cursor: pointer;
      }

      .edit-btn {
        background: #2563eb;
        color: #fff;
      }

      .edit-btn:hover {
        background: #1d4ed8;
      }

      .delete-btn {
        background: #dc2626;
        color: #fff;
      }

      .delete-btn:hover {
        background: #b91c1c;
      }

      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #6b7280;
      }

      .empty-state button {
        margin-top: 16px;
        padding: 12px 20px;
        border: none;
        border-radius: 12px;
        background: #2563eb;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
      }

      .empty-state button:hover {
        background: #1d4ed8;
      }

      .edit-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .edit-modal.show {
        display: flex;
      }

      .edit-modal-content {
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .edit-modal-content h2 {
        margin: 0;
      }

      .edit-modal-content .field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .edit-modal-content label {
        font-weight: 600;
      }

      .edit-modal-content select,
      .edit-modal-content textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        font-size: 1rem;
        background: #fff;
        box-sizing: border-box;
      }

      .edit-modal-content textarea {
        min-height: 80px;
        resize: vertical;
      }

      .edit-modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .edit-modal-actions button {
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
      }

      .save-btn {
        background: #2563eb;
        color: #fff;
      }

      .cancel-btn {
        background: #6b7280;
        color: #fff;
      }
    `;
    container.prepend(style);

    // Attach event listeners
    this.attachEventListeners(container);

    return container;
  }

  loadEntries() {
    this.entries = LocalStorageService.loadEntries().sort((a, b) => b.timestamp - a.timestamp);
  }

  groupByDate(entries) {
    const groups = {};
    entries.forEach((entry, index) => {
      const dateKey = entry.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push({ entry, index });
    });
    return groups;
  }

  formatDateGroup(dateKey) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - ONE_DAY_MS).toISOString().split('T')[0];
    if (dateKey === today) return 'Today';
    if (dateKey === yesterday) return 'Yesterday';
    const date = new Date(dateKey);
    return date.toLocaleDateString();
  }

  renderEntryCard(entry, globalIndex) {
    const emotion = this.emotionsMap.get(entry.emotionId) || { icon: '❓', name: 'Unknown' };
    const card = document.createElement('article');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="entry-header">
        <span class="emotion-icon">${emotion.icon}</span>
        <span class="emotion-name">${emotion.name}</span>
      </div>
      ${entry.note ? `<div class="entry-body"><p class="entry-note">${entry.note}</p></div>` : ''}
      <div class="entry-footer">
        <span class="entry-time">${this.formatTime(entry.timestamp)}</span>
        <div class="entry-actions">
          <button class="edit-btn" data-index="${globalIndex}">Edit</button>
          <button class="delete-btn" data-index="${globalIndex}">Delete</button>
        </div>
      </div>
    `;
    return card;
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  createEditModal() {
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
      <div class="edit-modal-content">
        <h2>Edit Entry</h2>
        <div class="field">
          <label for="edit-emotion-select">Emotion</label>
          <select id="edit-emotion-select">
            ${emotions.map(emo => `<option value="${emo.id}">${emo.icon} ${emo.name}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="edit-note">Note (optional)</label>
          <textarea id="edit-note"></textarea>
        </div>
        <div class="edit-modal-actions">
          <button class="cancel-btn">Cancel</button>
          <button class="save-btn">Save</button>
        </div>
      </div>
    `;
    return modal;
  }

  attachEventListeners(container) {
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const index = parseInt(e.target.dataset.index);
        this.openEditModal(index);
      } else if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        this.handleDelete(index, container);
      } else if (e.target.classList.contains('cancel-btn')) {
        this.closeEditModal();
      } else if (e.target.classList.contains('save-btn')) {
        this.saveEdit(container);
      } else if (e.target.id === 'go-to-log') {
        // For now, just alert; later implement navigation
        alert('Navigation to log screen not implemented yet.');
      }
    });
  }

  openEditModal(index) {
    this.editingIndex = index;
    const entry = this.entries[index];
    const modal = document.querySelector('.edit-modal');
    const emotionSelect = modal.querySelector('#edit-emotion-select');
    const noteTextarea = modal.querySelector('#edit-note');
    emotionSelect.value = entry.emotionId;
    noteTextarea.value = entry.note;
    modal.classList.add('show');
  }

  closeEditModal() {
    const modal = document.querySelector('.edit-modal');
    modal.classList.remove('show');
  }

  saveEdit(container) {
    const modal = document.querySelector('.edit-modal');
    const emotionSelect = modal.querySelector('#edit-emotion-select');
    const noteTextarea = modal.querySelector('#edit-note');
    const newEmotionId = emotionSelect.value;
    const newNote = noteTextarea.value;
    const updatedEntry = new Entry(newEmotionId, newNote, this.entries[this.editingIndex].timestamp);
    LocalStorageService.updateEntry(this.editingIndex, updatedEntry);
    this.closeEditModal();
    // Re-render the screen
    const newScreen = new HistoryScreen().render();
    container.parentNode.replaceChild(newScreen, container);
  }

  handleDelete(index, container) {
    if (confirm('Are you sure you want to delete this entry?')) {
      LocalStorageService.deleteEntry(index);
      // Re-render the screen
      const newScreen = new HistoryScreen().render();
      container.parentNode.replaceChild(newScreen, container);
    }
  }
}