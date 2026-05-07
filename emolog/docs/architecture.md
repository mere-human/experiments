# Architecture

## Tech stack

For MVP, a single cross-platform codebase is best. The strongest fit is a web-based Progressive Web App (PWA) that can run in a browser and be installed on Android as an app.

This avoids maintaining separate native and web apps, keeps the implementation simple, and stays compatible with your JavaScript/TypeScript skill set.

## Architecture alternatives

### Option 1: Vanilla PWA / minimal web app

- Pros:
  - Very simple and easy to understand.
  - Uses standard browser APIs and one codebase for Android and web.
  - Best choice for low-entry developers.
  - Offline support via service worker and local storage.
- Cons:
  - Limited access to some native device APIs without wrappers.
  - Install experience is browser-dependent.
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

A plain PWA with minimal framework or vanilla JavaScript is the best fit.

Reasons:
- One codebase, no separate native and web apps.
- Maximum simplicity and readability.
- Fast development for a lightweight emotion tracker.
- Offline-first support is easy to implement with service worker and local persistence.
- It aligns with your existing JavaScript/TypeScript knowledge.

If you want a slightly more structured approach, use a very small UI library such as Preact or Lit to keep components manageable without adding heavy abstractions.

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

- Use browser local storage, IndexedDB, or a local JSON file.
- Persist entries and emotion metadata together.
- Use a human-readable JSON structure for export/import.

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

## Purpose of this document

Defines:
- tech stack
- system design
- folder structure
- patterns
- database strategy
- API style
