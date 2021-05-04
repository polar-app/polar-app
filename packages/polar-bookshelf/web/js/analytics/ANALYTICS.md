# Analytics

![](https://media.giphy.com/media/FkUyGd7FDh1gk/giphy.gif)

# Table of Contents
- [Analytics](#analytics)
- [Table of Contents](#table-of-contents)
- [Events](#events)
  - [Global](#global)
    - [`global-fullscreenModeEnabled` Global Fullscreen Mode Enabled](#global-fullscreenmodeenabled-global-fullscreen-mode-enabled)
    - [`global-zenModeEnabled` Global Zen Mode Enabled](#global-zenmodeenabled-global-zen-mode-enabled)
  - [Anki](#anki)
    - [`anki-syncStarted` Anki Sync Started](#anki-syncstarted-anki-sync-started)
    - [`anki-syncFailed` Anki Sync Started](#anki-syncfailed-anki-sync-started)
    - [`anki-syncCompleted` Anki Sync Completed](#anki-synccompleted-anki-sync-completed)
  - [Document](#document)
    - [`doc-flagged` Document Flagged](#doc-flagged-document-flagged)
    - [`doc-tagged` Document Tags Changed](#doc-tagged-document-tags-changed)
    - [`doc-archived` Document Archived](#doc-archived-document-archived)
    - [`doc-highlightCreated` Document Highlight Created](#doc-highlightcreated-document-highlight-created)
    - [`doc-annotationsExported` Document Annotations Exported](#doc-annotationsexported-document-annotations-exported)
    - [`doc-columnLayoutChanged` Document Column Layout Changed](#doc-columnlayoutchanged-document-column-layout-changed)
    - [`doc-markAsRead` Document Mark As Read](#doc-markasread-document-mark-as-read)
    - [`doc-metadataModalOpened` Document Update Metdata Modal Opened](#doc-metadatamodalopened-document-update-metdata-modal-opened)
    - [`doc-metadataUpdated` Document Metadata Updated](#doc-metadataupdated-document-metadata-updated)
    - [`doc-pagemarkCreated` Document Pagemark Created](#doc-pagemarkcreated-document-pagemark-created)
  - [Annotation](#annotation)
    - [`annotation-commentCreated` Annotation Comment Created](#annotation-commentcreated-annotation-comment-created)
    - [`annotation-colorChanged` Annotation Color Changed](#annotation-colorchanged-annotation-color-changed)
    - [`annotation-manualFlashcardCreated` Annotation Manual Flashcard Created](#annotation-manualflashcardcreated-annotation-manual-flashcard-created)


<br />

# Events

## Global

### `global-fullscreenModeEnabled` Global Fullscreen Mode Enabled

*No extra data*

### `global-zenModeEnabled` Global Zen Mode Enabled

*No extra data*

## Anki

### `anki-syncStarted` Anki Sync Started

*No extra data*
### `anki-syncFailed` Anki Sync Started

*No extra data*

### `anki-syncCompleted` Anki Sync Completed

```ts
{
    noSucceeded: number, // The number of flashcards that synced successfully
    noFailed: number, // The number of flashcards that failed to sync
}
```

## Document

### `doc-flagged` Document Flagged

```ts
{
    count: number,      // The number of documents that got flagged
    flagged: boolean,   // Whether the document got flagged/unflagged
}
```

### `doc-tagged` Document Tags Changed

```ts
{
    count: number,      // The number of documents that got flagged
}
```

### `doc-archived` Document Archived

```ts
{
    count: number,      // The number of documents that got flagged
    archived: boolean,  // Whether the document got archived/unarchived
}
```

### `doc-highlightCreated` Document Highlight Created

```ts
{
    type: "text" | "area", // The type of the highlight text/area
}
```

### `doc-annotationsExported` Document Annotations Exported

```ts
{
    format: "markdown" | "json", // The requested format of the exported data
}
```

### `doc-columnLayoutChanged` Document Column Layout Changed
```ts
{
    columns: number, // The number of columns that a document uses.
}
```

### `doc-markAsRead` Document Mark As Read

*No extra data*

### `doc-metadataModalOpened` Document Update Metdata Modal Opened

*No extra data*

### `doc-metadataUpdated` Document Metadata Updated

*No extra data*

### `doc-pagemarkCreated` Document Pagemark Created

*No extra data*

<br />
<br />
<br />

## Annotation

### `annotation-commentCreated` Annotation Comment Created

*No extra data*


### `annotation-colorChanged` Annotation Color Changed

*No extra data*


### `annotation-manualFlashcardCreated` Annotation Manual Flashcard Created

```ts
{
    // The type of the created flashcard manual/AI
    type: "CLOZE" |
          "BASIC_FRONT_BACK" |
          "BASIC_FRONT_BACK_AND_REVERSE" |
          "BASIC_FRONT_BACK_OR_REVERSE",
}
```
