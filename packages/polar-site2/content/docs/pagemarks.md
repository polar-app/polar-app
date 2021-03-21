---
title: Pagemarks
layout: doc
permalink: /docs/pagemarks.html
description: You can think of a pagemark as a kind of 'sectioned bookmark'.  A pagemark has a start and an end so that you know which part of the book has been read. 
---

# Pagemarks

Polar's pagemark is as a kind of 'sectioned bookmark'.  A pagemark has a start and an end so that you know which
part of the book has been read.

Pagemarks allow suspend and resume of reading for weeks and months in the future until you're ready to resume, without
losing your place.

Pagemarks are contrasted with bookmarks in that a bookmark is only a simple pointer.

Pagemarks allow you to specify a range, or multiple ranges.  Additionally, pagemarks are used to keep track of the total
progress of the document and to sort documents in the document repository by their reading progress..

<img class="img-fluid" src="https://i.imgur.com/7opRKhS.png">

<div class="text-center">Screenshot showing a document with 4 pagemarks</div>

## Create Pagemark to Point

When you right click and select "Pagemark to Current Location" Polar creates pagemarks over all previous pages up until the
previous pagemark (or the beginning) of the document.

This enables you to import a book which you've been reading and mark multiple pages as read so that you can now just use
Polar to track your pgoress.

You can still pagemark the current page by selecting "Create Pagemark Box" to or run "Control Alt N" to mark just the
current page.

## Reading Progress

We have statistics for tracking the number of pages you read per day and an integrated calendar chart showing this
visually in the stats page.

<img class="img-fluid" src="https://i.imgur.com/7OjCYxH.png">

## Pagemark labels

We support pagemark labels depending on the section of the book (e.g., previously read, read, Appendix, Table of Contents,...). This directly
integrates with the reading progress calculation.  

Only when labeling a pagemark as 'Read' will it count against your reading progresss for the day. This is the default pagemark. All other pagemark labels (previously, read, ignored, Table of Contents, Appendix, References) will not count against your reading progress for that day. 

This allows you to import books you've read in the past, "grandfather" in the pages you've already read in the past, and actively manage your reading progress.

## Pagemark from Page to Current Location

This pagemark works exactly as the regular pagemark with the difference that you can select on which page the pagemark starts. For example, if you are reading only a specific chapter in a book, you can use this pagemark to mark the chapter's first page as the starting point and your current location as its ending point

### Linux / Windows key bindings

 - Control Alt click - create a pagemark on the page up until the current mouse click

### MacOS Key bindings

 - Meta-Command click - create a pagemark on the page up until the current mouse click
 
# Automatic Pagemarks

Auto pagemarks provide the beginning of our new pagemark design.  The idea is that pagemarks are created automatically
as you scroll the document.  

You can kind of think of them as 'breadcrumbs' in that, as you read naturally, a pagemark is left on the previous page.

When making large jumps within a PDF (say from chapter 2 to chapter 10), pagemarks will not be created and will only
resume when you start naturally reading at chapter 10.

This feature is currently in beta and available for PDFs after in > 1.90.15
