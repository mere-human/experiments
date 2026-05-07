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
}