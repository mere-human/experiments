# Architecture

## Tech stack

Selected stack: plain Progressive Web App (PWA) using vanilla JavaScript and standard web APIs.

This approach uses a single codebase for browser and Android installable usage, keeps the implementation readable, and avoids a separate native app. It satisfies the core requirements:
- offline-first behavior
- local persistence
- installable Android experience
- lightweight and easy to understand

## Architecture alternatives

### Option 1: Vanilla PWA / minimal web app

- Pros:
  - Very simple and easy to understand.
  - Uses standard browser APIs and one codebase for Android and web.
  - Best choice for low-entry developers.
  - Offline support via service worker and local storage.
  - Smooth install flow via a web app manifest and add-to-home-screen.
- Cons:
  - Limited access to some native device APIs without wrappers.
  - Install experience is browser-dependent, but modern Android browsers handle PWAs well.
- Complexity: low
- Scalability: medium for this use case; enough for mood tracking and light features.
- Development speed: high for MVP.
- AI-assisted development friendliness: excellent; simple APIs and standard JS/TS are easy for AI to reason about.

### Option 2: Capacitor + basic web UI

- Pros:
  - One codebase for web and Android, with native plugin access when needed.
  - Better access to filesystem APIs and native dialogs than a plain PWA.
  - Still mostly web technology.
- Cons:
  - Additional build and packaging complexity.
  - Slightly more moving parts than a plain PWA.
- Complexity: medium
- Scalability: medium-high; good for adding platform-specific features later.
- Development speed: good, but slower than plain PWA because of native wrappers.
- AI-assisted development friendliness: good, though native plugin configuration adds some complexity.

### Option 3: React Native / Expo with web support

- Pros:
  - Strong cross-platform mobile support.
  - Familiar React ecosystem if you already know React.
  - Can support Android and web through React Native Web / Expo.
- Cons:
  - React Native has a steeper learning curve than vanilla JS.
  - More abstractions and build setup.
  - Web support is possible but adds extra complexity.
- Complexity: medium-high
- Scalability: high for mobile-first apps, but overkill for a small tracker.
- Development speed: moderate.
- AI-assisted development friendliness: good, but AI may need more context for React Native-specific APIs.

## Recommended architecture for MVP

A plain PWA with vanilla JavaScript is the selected approach.

Reasons:
- One codebase, no separate native and web apps.
- Maximum simplicity and readability.
- Fast development for a lightweight emotion tracker.
- Offline-first support is easy to implement with service worker and local persistence.
- Smooth Android installation using a web app manifest and service worker.
- It aligns with your existing JavaScript/TypeScript knowledge.

If the app needs a bit more structure later, a tiny UI library such as Preact or Lit can be added without changing the core architecture.

## System design

- UI layer: emotion picker, entry form, history list, settings.
- Data layer: local persistence service for entries and emotion definitions.
- Sync layer: export/import JSON backup for backup and restore.
- Domain model: emotion sets, emotion entries, app state.

## Offline strategy

- Data is saved locally first.
- No initial network dependency.
- App starts and functions without connectivity.
- Sync is optional and manually triggered.

## Storage strategy

- Use browser local storage or IndexedDB for persistent data.
- Persist entries and emotion metadata together in a single local state store.
- MVP storage is local only; export/import backup is a future enhancement.
- On an installed PWA, storage persists across app launches and works offline.

## Folder structure

Suggested structure:
- src/
  - components/
  - screens/
  - models/
  - services/
  - storage/
  - utils/
- tests/
- docs/

## Patterns

- Keep UI state simple and predictable.
- Use a single source of truth for entries and emotion definitions.
- Separate persistence logic from presentation.
- Prefer small reusable components and services.

## Testing

- Unit tests for the data model and storage logic.
- Tests for entry creation, editing, deletion, and persistence.
- If using a web stack, add test coverage for storage and core business rules.

## API style

- Internal app APIs should be simple and synchronous where possible.
- Expose storage functions such as `saveEntry`, `loadEntries`, `exportBackup`, `importBackup`.
- Keep the UI layer decoupled from the persistence implementation.

## Running the app

To run the app locally from the repository root:

1. Open a terminal in the project root directory.
2. Start a local web server: `python -m http.server 8000`
3. Open `http://localhost:8000` in your browser

The app entry point is `index.html`. The main application logic lives in `src/app.js`, and the entry creation screen is implemented in `src/screens/EntryScreen.js`.

## Purpose of this document

Defines:
- tech stack
- system design
- folder structure
- patterns
- database strategy
- API style
