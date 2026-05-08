# EmoLog Agent Instructions

## Project Overview

**EmoLog** is a lightweight, privacy-focused emotion tracking PWA. See [vision.md](docs/vision.md) for philosophy and long-term goals.

### Tech Stack
- **Framework**: None — vanilla JavaScript PWA (no React, Vue, or build tool)
- **Persistence**: Browser localStorage via custom LocalStorageService
- **UI**: Plain HTML with inline CSS-in-JS
- **Language**: Plain JavaScript (ES6 modules)

### Core Mission
Fast emotion logging with minimal friction, offline-first, local storage, Android-installable PWA.

## Architecture

The app follows a simple layered design. See [architecture.md](docs/architecture.md) for design alternatives.

### Folder Structure
```
src/
  models/        # Data models: Entry, emotions
  screens/       # Top-level UI components that render full screens
  services/      # Business logic layer (future)
  storage/       # Persistence layer: LocalStorageService
  components/    # Reusable UI components (currently empty)
  utils/         # Helper utilities (future)
```

### Data Model

**Entry** (`src/models/Entry.js`):
- `emotionId` (string): ID of the selected emotion
- `note` (string): Optional user note
- `timestamp` (Date): When the entry was created

**Emotion** (`src/models/emotions.js`):
- `id` (string): Unique identifier
- `name` (string): Display name
- `icon` (string): Unicode emoji

**MVP emotions**: excited, tender, scared, angry, sad, happy

See [requirements.md](docs/requirements.md) for complete data model and MVP scope.

## Coding Conventions

### Class-Based Components
- Screen/component classes have a `render()` method that returns a DOM element
- Example: `EntryScreen.render()` returns a `div` with event listeners attached
- All styling is inline (CSS-in-JS within the render method)

### Imports & Modules
- Use relative paths with `.js` extensions: `import { Entry } from '../models/Entry.js'`
- Each file exports one main class or constant
- No default exports unless appropriate

### CSS & Styling
- Inline `<style>` elements created in `render()` methods
- Use system fonts, Tailwind-like utility colors (e.g., `#2563eb`, `#cbd5e1`)
- Mobile-friendly: max-width 480px, touch-friendly padding/font sizes
- No external CSS files or build process

### Entry Point
- `src/app.js` imports the root screen and mounts it to `#app` in `index.html`
- Simple one-liner initialization pattern

## Development Guidelines

### Adding Features
1. **New screens**: Create a class in `src/screens/ScreenName.js` with a `render()` method
2. **Data models**: Add to `src/models/` folder; export plain classes or constants
3. **Persistence**: Use `LocalStorageService` from `src/storage/localStorage.js`
4. **UI components**: If a component is reusable across screens, move it to `src/components/`
5. **Styles**: Keep CSS inline in the render method; use consistent spacing and colors

### Documentation Conventions
- From [vision.md](docs/vision.md): **Do not use absolute paths** — keep paths relative
- Update relevant docs in `docs/` when adding features
- Link to documentation instead of duplicating information

### Testing Strategy
- No formal test framework yet; add tests in `tests/` when needed
- All data persists to localStorage by default

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| `src/app.js` | App entry point; mounts root screen |
| `src/models/Entry.js` | Entry data model |
| `src/models/emotions.js` | Emotion palette for MVP |
| `src/screens/EntryScreen.js` | Main UI for logging emotions |
| `src/storage/localStorage.js` | Persistence layer |
| `src/components/` | Reusable UI widgets (currently unused) |

## Next Steps & Roadmap

See [features.md](docs/features.md) for MVP completion checklist and roadmap.

### Priority Areas
1. Complete EntryScreen and history/list view
2. Implement LocalStorageService fully
3. Add settings screen for emotion customization
4. PWA manifest and service worker for offline support

### Future Considerations
- Export/import JSON sync files
- Statistics and charts
- Cloud backup (optional, not MVP)
- Localization

## Notes for AI Agents

- This is an MVP; prioritize shipping core features over perfection
- The vanilla JS approach means straightforward DOM manipulation — no framework magic
- All state is currently co-located with components; a state management layer is not needed yet
- Relative paths with `.js` extensions are intentional for browser compatibility without build tooling
- Storage is always localStorage in MVP; plan for IndexedDB migration later if needed
- The offline-first philosophy means all features should work without network connectivity
