---
title: Pagemarks
layout: doc
permalink: /docs/pagemarks.html
description: You can think of a pagemark as a kind of 'sectioned bookmark'.  A pagemark has a start and an end so that you know which part of the book has been read. 
---

# Pagemarks

You can think of a pagemark as a kind of 'sectioned bookmark'.  A pagemark has a start and an end so that you know which
part of the book has been read.

Pagemarks allow suspend and resume of reading for weeks and months in the future until you're ready to resume, without
losing your place.

Pagemarks are contrasted with bookmarks in that a bookmark is only a simple pointer.

Pagemarks allow you to specify a range, or multiple ranges.  Additionally, pagemarks are used to keep track of the total
progress of the document and to sort documents in the document repository by their reading progress..

<img class="img-fluid" src="../assets/screenshots/annotations-shadow.png">

<div class="text-center">Screenshot showing a document with 4 pagemarks</div>

## Create Pagemark to Point

When you right click and select "Create Pagemark to Point" Polar creates pagemarks over all previous pages up until the
previous pagemark (or the beginning) of the document.

This enables you to import a book which you've been reading and mark multiple pages as read so that you can now just use
Polar to track your pgoress.

For example, if you have a 300 page book, and you've read pages 1-200 you can just jump to page 200 and "Create Pagemark
to Point" and pagemarks will be created across all previous pages.

You can still pagemark the current page by selecting "Create Pagemark Box" to or run "Control Alt N" to mark just the
current page.

## Reading Progress

We have statistics for tracking the number of pages you read per day and an integrated calendar chart showing this
visually in the stats page.

<img class="img-fluid" src="https://getpolarized.io/assets/screenshots/reading-progress.webp">

## Modes

We support pagemark modes and can change the colors of the pagemark based on the mode. Additionally, this directly
integrates with the reading progress calculation.  

When you set the mode of a pagemark as 'table of contents' or 'ignored' or 'pre read' it will not factor this into
your reading progress for that day.

This allows you to import books you've read in the past and "grandfather" in the pages you've already read in the past.

## Create Pagemark Box.

When you right click and select "Create Pagemark Box" Polar creates a single
pagemark box which you can resize and drag to cover parts of the page you've
read.

This is useful when the document has multiple columns and you want to mark a 
single column. 

## Usage

Pagemarks can be created with either the keyboard of the mouse.

When working with a document you can simply right click and "Create Pagemark at
Point" which will create a pagemark on the current page to the current mouse
position.

### Linux / Windows key bindings

 - Control Alt N - create a new pagemark on the current page
 - Control Alt click - create a pagemark on the page up until the current mouse click
 - Control Alt E - erase the current pagemark

### MacOS Key bindings

 - Meta-Command N - create a new pagemark on the current page
 - Meta-Command click - create a pagemark on the page up until the current mouse click
 - Meta-Command E - erase the current pagemark
