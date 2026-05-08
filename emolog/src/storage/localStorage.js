import { Entry } from '../models/Entry.js';

export class LocalStorageService {
  static saveEntry(entry) {
    const entries = this.loadEntries();
    entries.push(entry);
    localStorage.setItem('emolog_entries', JSON.stringify(entries));
  }

  static loadEntries() {
    const data = localStorage.getItem('emolog_entries');
    if (!data) return [];
    return JSON.parse(data).map(e => new Entry(e.emotionId, e.note, new Date(e.timestamp)));
  }

  static updateEntry(index, entry) {
    const entries = this.loadEntries();
    if (index >= 0 && index < entries.length) {
      entries[index] = entry;
      localStorage.setItem('emolog_entries', JSON.stringify(entries));
    }
  }

  static deleteEntry(index) {
    const entries = this.loadEntries();
    if (index >= 0 && index < entries.length) {
      entries.splice(index, 1);
      localStorage.setItem('emolog_entries', JSON.stringify(entries));
    }
  }
}