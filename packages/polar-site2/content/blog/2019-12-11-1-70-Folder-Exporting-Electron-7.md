---
title: Polar 1.70 - New Folders Sidebar, Improved Saving of Annotations, and Electron 7.0. 
date: 2019-12-11T08:00:00.000-08:00
layout: post
description: Polar 1.70 - New Folders Sidebar, Improved Saving of Annotations, and Electron 7.0.
release: 1.70.4
pinned: 8
---

Polar 1.70 is out! Lots of big changes in this release!

I know I promised you guys that we would create a video for each release but I can't create
one for 1.70 just now as I'm trying to rush it out to fix an issue with Google authentication
(more below).

Normally emergency releases I will do a small point release but this release changed a great 
deal and I think it's a reasonable trade-off to get it out the door.

## New Sidebar

### Folder / Tag Creation

The sidebar code has been significantly refactored to be far far more usable.  You can read
more in-depth about [how folders work in our documentation](https://getpolarized.io/docs/folders.html).

In a nutshell, we now have more explicit folders which can be created ahead of time by the user.

This ended up confusing new users as they were confused how to work with tags.  They didn't 
realize you first had to create tags/folders on documents.

Now you can just right click the sidebar and click "Create Folder" or "Create Tag" and you'll 
be prompted for the value of the new tag, and it will be created.

Additionally there's a "+" dropdown in the sidebar so it's more discoverable for new users.

### Filtering

Now the sidebar code has a filter box at the top where you can type in text to filter 
the tags shown.  This works really well for selecting a tag that you know by name.

You can just select the filter, type the tag, then click the tag.

This became more important as we added improved support for tags and people are creating
more and more tags.  We don't want to have tag overload!

## Saving Annotations

Many of our users want to take their annotations and save them to external files.  They're 
doing this to make it easy to share annotations with others but also for scripts or 
migrating into a document that they might be editing.

One glaring omission was that the annotation view didn't allow you to save annotations to 
a file.

Now there's a "..." to the right where you can click "Download annotation as" to save the 
files locally.

I'm trying to migrate away from calling this process "exporting" as we don't have a 
corresponding "import."  The Polar desktop app itself is basically it's own export.

If you want a raw backup of your data on the desktop app it's already done for you - it's
just your .polar directory.

That said, some users have noted some reasonable concern to feel more in charge of their
backups.

I'm going to add an option to perform backups directly in Polar in the future just so 
users can have more piece of mind that their data is safe.

## Electron 7.0

This release also migrates us to Electron 7.0.  I've been wanting to do this for a while
but the Electron releases are usually a big migration.  This was forced on us by a change
Google made with their authentication which blocked Electron releases.

Electron 7.0 adds a ton of new features for better integration into the OS so this should
be an improvement across the board in terms of usability, reliability, etc.

## What's Next

Next we're going to focus on a 1.80 release. 2.0 is going to come out soon but I need to 
switch back to working on mobile support as this is very important for mobile flashcard 
review. 

## Full Changelog

Here's the full changelog for this release:

## Features

- Migration to Electron 7.1.4

- Flagged items are now bold.

- odd/even coloring in the document list / table.

- usability: the sidebar has been significantly redesigned
    - "+" button for adding tags and folders
    - context menu for adding tags and folders
    - remove tag from docs

- usability: expand/collapse of folders now works now. 

- UI: better UI filter control.

- usability: you can now see the folders a file is within in the document repository

- usability: you can now export annotations from the annotations view.

- usability: double click of comments or flashcards edits them.

## Fixes

- Fix for Google authentication issues due to exposing Electron in User Agent and confused
  Google.

- Reading and review for older items would fail due to schema changes.

- ChromeOS is now a desktop platform

- Upgrade account button now works.  

- Improved text in suggestions dialog.

- The user suggestions dialog is centered.

- usability: Fixed an issue where if the user accidentally hit 'r' the document would rotate and people
  couldn't figure out how to revert.
