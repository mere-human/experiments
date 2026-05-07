# Requirements

## User requirements

- Create a new emotion entry quickly.
- Select an emotion from a pre-defined list.
- Add an optional text note to an entry.
- Each emotion includes a name and a colored icon.
- View a timeline or list of recent entries.
- Edit or delete entries after they are created.
- Installable as a PWA on Android mobile.
- The app must work offline and persist data locally.

## Functional requirements

- Emotion selection screen with the MVP emotion set: excited, tender, scared, angry, sad, happy.
- Each emotion includes a name and a unicode symbol icon.
- Entry creation flow that records a timestamp automatically.
- Entry detail view that shows emotion, note, and time.
- Local persistence using browser storage.
- Ability to define or update the emotion list in settings.
- Simple startup view with emotion selection, today’s entries and/or a recent history.

## MVP emotion icons

- excited: 🤩
- tender: 🥰
- scared: 😨
- angry: 😠
- sad: 😔
- happy: 😊

## MVP data model

- Entry fields: timestamp, emotion id, optional text note.
- Emotion fields: id, name, color, unicode icon.
- Required entry fields: timestamp and emotion id. Note is optional.
- MVP emotion set: excited, tender, scared, angry, sad, happy.

## Non-functional requirements

- Fast launch time and low resource usage.
- Works without network connectivity.
- Saves data reliably to the filesystem.
- Minimal user interface with clear touch targets.
- Offline-first behavior by default.
- Data privacy: there is no cloud backend in MVP.
- Responsive on portrait mobile screens.

## Running the app

To run the app locally from the repository root:

1. Open a terminal in the project root directory.
2. Start a local web server: `python -m http.server 8000`
3. Open `http://localhost:8000` in your browser

The app entry point is `index.html`. The main application logic lives in `src/app.js`, and the entry creation screen is implemented in `src/screens/EntryScreen.js`.

## Data model

- Entry: timestamp, emotion id, optional note.
- Emotion: id, name, color, icon or symbol.
- App state: list of emotions, list of entries, last open view.

## Optional / later

- Use the app on the web occasionally.
- Save/load sync file from Google Drive when online.
- Localization for multiple languages.
- Statistics and charts for emotional trends.
- Daily summaries and weekly reports.

## Purpose of this document

Defines:
- what users need
- behavior expectations
- workflows