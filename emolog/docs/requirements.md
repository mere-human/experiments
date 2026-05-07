# Requirements

## User requirements

- Create a new emotion entry quickly.
- Select an emotion from a pre-defined list.
- Add an optional text note to an entry.
- Each emotion includes a name and a colored icon.
- View a timeline or list of recent entries.
- Edit or delete entries after they are created.
- Use the app on Android mobile.
- The app must work offline and persist data locally.

## Functional requirements

- Emotion selection screen with at least 6 default emotions.
- Entry creation flow that records a timestamp automatically.
- Entry detail view that shows emotion, note, and time.
- Local persistence to a file or local storage.
- Export/import data via a sync file for backup.
- Ability to define or update the emotion list in settings.
- Simple startup view with emotion selection, today’s entries and/or a recent history.

## Non-functional requirements

- Fast launch time and low resource usage.
- Works without network connectivity.
- Saves data reliably to the filesystem.
- Minimal user interface with clear touch targets.
- Offline-first behavior by default.
- Data privacy: there is no cloud backend in MVP.
- Responsive on portrait mobile screens.

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