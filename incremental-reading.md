---

title: Incremental Reading
layout: doc
---

# Incremental Reading

Incremental reading is a strategy around suspending and resuming reading of a
document over time.  Reading the documents in chunks and coming back to the 
document at any future point in time.

Incremental reading in Polar is implemented with the use of "pagemarks" which
allow the user to mark regions of the document as read.

Pagemarks allow suspend and resume of reading for weeks and months in
the future until you're ready to resume, without losing your place.

Pagemarks are contrasted with bookmarks in that a bookmark is only a simple
pointer.

Pagemarks allow you to specify a range, or multiple ranges.  Additionally,
pagemarks are used to keep track of the total progress of the document and to
sort documents in the document repository by their reading progress..

<img class="img-fluid" src="./assets/screenshots/annotations-shadow.png">

<div class="text-center">Screenshot showing a document with 4 pagemarks</div>

# Usage

Pagemarks can be created with either the keyboard of the mouse.

When working with a document you can simply right click and 
"Create Pagemark at Point" which will create a pagemark on the current page
to the current mouse position. 

## Linux / Windows key bindings

 - Control Alt N - create a new pagemark on the current page
 - Control Alt click - create a pagemark on the page up until the current mouse click
 - Control Alt E - erase the current pagemark

## MacOS Key bindings

 - Meta-Command N - create a new pagemark on the current page
 - Meta-Command click - create a pagemark on the page up until the current mouse click
 - Meta-Command E - erase the current pagemark
