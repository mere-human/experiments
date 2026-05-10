# Tasks

## Discovery

- ✓ confirm target platform: PWA
- ✓ define MVP emotion set and required entry fields.
- ✓ decide whether export/import is part of MVP (not included)

## Design

- design the emotion selection screen.
- design the history/timeline view.
- define the local storage format.
- design PWA installation flow, manifest, and service worker.

## Implementation

- ✓ implement navigation logic to switch between EntryScreen and HistoryScreen
- move styling to a separate CSS file?
- ✓ implement entry creation flow.
- implement emotion palette and selection.
- ✓ implement local persistence.
- ✓ implement history view with edit/delete.
- implement web manifest and service worker for installable PWA behavior.

## Testing

- ✓ Set up Jest as the testing framework.
- ✓ Write unit tests for storage service (LocalStorageService), with localStorage mocking.
- ✓ Setup jsdom for DOM tests.
- ✓ Write unit tests for app navigation logic (App class).
- Write unit/component tests for UI screens (EntryScreen, HistoryScreen) using Testing Library.
- Add integration tests for end-to-end flows (create/save/load/display entries).
- Verify offline startup and save behavior.
- Test Android mobile layout and usability.
- Add test coverage reporting and CI integration.

## Bugs

- delete doesn't work

## Future

- nav bar is too loud
- TypeScript
- add charts and statistics.
- add localization support.
- add optional sync integration.
