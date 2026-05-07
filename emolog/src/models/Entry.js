export class Entry {
  constructor(emotionId, note = '', timestamp = new Date()) {
    this.emotionId = emotionId;
    this.note = note;
    this.timestamp = timestamp;
  }
}