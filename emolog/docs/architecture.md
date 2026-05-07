# Architecture

## Tech stack

For MVP, choose a lightweight mobile-friendly stack that supports offline storage and Android deployment.

Possible options:
- Web-based PWA with filesystem storage and Android installation
- Cross-platform framework such as Flutter or React Native with local JSON storage

## System design

- UI layer: emotion picker, entry form, history list, settings.
- Data layer: local persistence module for entries and emotion definitions.
- Sync layer: file import/export for backup and restore.
- Domain model: emotion sets, emotion entries, app state.

## Offline strategy

- Data is saved locally first.
- No initial network dependency.
- App starts and functions without connectivity.
- Sync is optional and manually triggered.

## Storage strategy

- Use a simple local JSON file or local storage mechanism.
- Persist entries and emotion metadata together.
- Keep the storage format easy to inspect and export.

## Folder structure

TODO

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
