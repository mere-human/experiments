# History/Timeline View Design

## Overview
The History/Timeline view displays a chronological list of emotion entries, allowing users to review past emotional tracking, edit recent entries, and delete entries if needed. This view is essential for the MVP as it allows users to "view a timeline or list of recent entries" (from requirements).

## User Goals
- View all emotion entries in chronological order
- Quickly see emotional patterns and trends over time
- Edit or delete entries made in error
- See detailed information about each entry (emotion, timestamp, optional note)
- Easily navigate between entry logging and history viewing

## Visual Design

### Layout
```
┌─────────────────────────────┐
│  History View (or similar)  │
├─────────────────────────────┤
│  [Filter/Sort Controls]     │ (optional for MVP)
├─────────────────────────────┤
│  Today                      │ (optional date grouping)
├─────────────────────────────┤
│  🤩 Excited                 │ (entry card)
│  15:42                      │
│  Great day at work!         │
│  [Edit] [Delete]            │
│                             │
│  😊 Happy                   │ (entry card)
│  14:30                      │
│                             │
│  [Edit] [Delete]            │
├─────────────────────────────┤
│  Yesterday                  │ (optional date grouping)
├─────────────────────────────┤
│  😔 Sad                     │
│  22:15                      │
│  [Edit] [Delete]            │
│                             │
│  🥰 Tender                  │
│  10:05                      │
│  [Edit] [Delete]            │
└─────────────────────────────┘
```

### Entry Card Structure
Each entry is displayed as a compact card containing:
1. **Emotion icon + name** (large, prominent)
2. **Timestamp** (formatted, human-readable)
3. **Note** (if present, secondary text)
4. **Action buttons** (Edit, Delete) or action menu

### Visual Hierarchy
- Emotion icon should be large and easily recognizable
- Emotion name in clear, readable font
- Timestamp in secondary color/size
- Note text in smaller, muted color
- Date headers (if grouping by date) in subtle color/background

## Data Model

### Entry Object (already exists)
```javascript
{
  emotionId: string,      // 'excited', 'tender', etc.
  note: string,           // optional, may be empty
  timestamp: Date         // ISO string in storage, Date object in memory
}
```

### Display Representation
```javascript
{
  emotionId: string,
  emotionName: string,    // looked up from emotions array
  emotionIcon: string,    // looked up from emotions array
  note: string,
  timestamp: Date,
  // computed for display:
  timeString: string,     // "15:42" or "2:30 PM"
  dateString: string,     // "Today", "Yesterday", "March 5"
  dateGroupKey: string    // "2025-03-15" for grouping
}
```

## Interaction Patterns

### Primary Actions
1. **View Entry Details** - Tap entry card to see full details
2. **Edit Entry** - Click Edit button to modify emotion/note/timestamp
3. **Delete Entry** - Click Delete button with confirmation dialog

### Secondary Actions
- **Filter by emotion** (future: filter by date range, search by note text)
- **Sort** (future: by date, by emotion, by frequency)
- **Export** (future: export as JSON/CSV)

### State Management
- Load entries on screen render
- Sort entries by timestamp (newest first)
- Group entries by date (optional for MVP)
- Handle empty state (no entries yet)
- Show loading state while fetching from storage
- Show success/error messages for edit/delete actions

## Component Structure

### HistoryScreen Class
```javascript
export class HistoryScreen {
  constructor() {
    this.entries = [];
    this.emotions = emotions;
  }

  render() {
    // Creates main container
    // Loads entries from storage
    // Groups entries by date (if enabled)
    // Renders entry cards
    // Attaches event listeners
    // Returns DOM element
  }

  loadEntries() {
    // Load from LocalStorageService
    // Sort by timestamp descending (newest first)
  }

  groupByDate(entries) {
    // Group entries by calendar day
    // Return map of date -> entries
  }

  formatTimestamp(date) {
    // Return human-readable time (e.g., "15:42", "3:42 PM")
  }

  formatDate(date) {
    // Return "Today", "Yesterday", or date string
  }

  renderEntryCard(entry) {
    // Create card DOM element
    // Attach edit/delete listeners
  }

  handleEdit(entryIndex) {
    // Open edit modal or screen
    // Allow modification of emotion, note
    // Save changes back to storage
    // Refresh view
  }

  handleDelete(entryIndex) {
    // Show confirmation dialog
    // Remove entry from storage
    // Refresh view
  }

  onEmotionEdit(updatedEntry, index) {
    // Called from edit modal with updated data
    // Save to storage
    // Reload entries and re-render
  }
}
```

### Entry Edit Modal/Screen (new component)
A lightweight modal or overlay for editing entries:
- Show current emotion, note, timestamp
- Allow changing emotion and note
- Allow adjusting timestamp (optional for MVP)
- Save/Cancel buttons

## Styling Approach

### Mobile-First Responsive Design
- Full-width cards on mobile (with padding)
- Optimized for portrait orientation
- Touch-friendly button sizes (min 44x44px)
- Clear spacing between entries

### Color Scheme
- Use emotion icon colors as visual anchors
- Secondary text (timestamps) in muted gray
- Action buttons in primary blue (consistent with EntryScreen)
- Delete action in red/warning color (future)

### CSS Structure
- Consistent with EntryScreen pattern
- Embedded `<style>` tag in component
- CSS Grid or Flexbox for layout
- Smooth transitions for interactions

### Key CSS Classes
- `.history-screen` - main container
- `.date-group` - date header section
- `.entry-card` - individual entry container
- `.entry-header` - emotion icon + name
- `.entry-body` - note content
- `.entry-footer` - timestamp + actions
- `.entry-actions` - edit/delete buttons
- `.empty-state` - when no entries exist

## Technical Implementation

### Storage Integration
- Use `LocalStorageService.loadEntries()` to fetch all entries
- Use `LocalStorageService.saveEntry()` for new entries
- Add `LocalStorageService.updateEntry(index, entry)` for edits
- Add `LocalStorageService.deleteEntry(index)` for deletions

### Date/Time Formatting
- Use `Date.toLocaleTimeString()` for time display
- Use `Date.toLocaleDateString()` for date display
- Handle timezone display appropriately
- Consider date grouping logic (Today, Yesterday, older dates)

### Event Handling
- Use event delegation for entry card interactions
- Provide clear feedback for successful actions
- Show confirmation dialogs for destructive actions
- Handle edge cases (empty list, single entry, many entries)

### Empty State
When no entries exist:
- Show message: "No emotion entries yet. Start tracking by logging your first emotion!"
- Show button to navigate to entry creation screen

## MVP Scope vs. Future Enhancements

### MVP (Included)
- Display all entries in reverse chronological order
- Show emotion icon, emotion name, timestamp, and note
- Edit entry (emotion and note)
- Delete entry with confirmation
- Simple date grouping (Today, Yesterday, etc.)
- Empty state message
- Mobile-responsive layout

### Future Enhancements
- Filter by specific emotion
- Search entries by note text
- Date range filtering
- Sort options (by emotion, by frequency)
- Entry detail view (full-screen modal)
- Edit timestamp (currently set at entry creation)
- Export entries as JSON/CSV
- Statistics and charts
- Bulk operations (delete multiple)

## Accessibility Considerations

- Semantic HTML (use `<button>`, `<article>`, etc.)
- ARIA labels for icon-only buttons
- Keyboard navigation support
- Sufficient color contrast
- Touch target size (44x44px minimum)
- Clear focus states for interactive elements

## Performance Considerations

- Render only visible entries (future: implement virtualization for large lists)
- Debounce rapid edit/delete actions
- Cache emotion lookup table
- Efficient date grouping and sorting
- Minimal DOM manipulation during updates

## Integration Points

### With EntryScreen
- Both screens should have navigation between them
- Share styling patterns and component structure
- Use same emotions and storage service

### With Main App (app.js)
- HistoryScreen should be instantiated and rendered like EntryScreen
- Consider route/screen switching logic for future navigation

## Example Entry Card HTML
```html
<article class="entry-card">
  <div class="entry-header">
    <span class="emotion-icon">🤩</span>
    <span class="emotion-name">Excited</span>
  </div>
  <div class="entry-body">
    <p class="entry-note">Great day at work!</p>
  </div>
  <div class="entry-footer">
    <span class="entry-time">15:42</span>
    <div class="entry-actions">
      <button class="edit-btn" aria-label="Edit entry">Edit</button>
      <button class="delete-btn" aria-label="Delete entry">Delete</button>
    </div>
  </div>
</article>
```

## Success Criteria
- Users can view all past emotion entries
- Entries display in clear chronological order
- Edit and delete functions work reliably
- Layout is responsive on mobile devices
- No performance issues with 100+ entries
- All changes persist to localStorage
- User receives clear feedback for all actions
