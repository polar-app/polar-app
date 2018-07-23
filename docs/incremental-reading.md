# Incremental Reading

Incremental reading is a software-assisted mechanism for processing (and
retaining) large amounts of information over time from a myriad of disparate
sources.

Wikipedia has a good overview of
<a href="https://en.wikipedia.org/wiki/Incremental_reading">incremental reading</a>

> Incremental reading is a software-assisted method for learning and retaining information from reading, helping with the creation of flashcards out of electronic articles read in portions inside a prioritized reading list.

> It is particularly targeted to people who are trying to learn for life a large amount of information, particularly if that information comes from various sources.

> "Incremental reading" means "reading in portions". Instead of a linear reading of articles one at a time, the method works by keeping a large reading list of electronic articles or books (often dozens or hundreds of them) and reading parts of several articles in each session. Articles in the reading list are prioritized by the user.

> In the course of reading, key points of articles are broken up into flashcards, which are then learned and reviewed over an extended period of time with the help of a spaced repetition algorithm.

Polar's implementation of incremental reading is based on the concept of pagemarks.

# Pagemarks

Pagemarks are similar to bookmarks in that they allow you to mark what you've read
within a document but support additional functionality.

## Pagemarks

Pagemarks are essentially boxes that you add to a page and cover portions of the
document you've read. As you're reading you either drag pagemarks with your mouse
or you can create them with your keyboard.

Pagemarks are local to each page in a PDF. For captured web content we only (currently)
support one large virtual page.

You can create as many pagemarks as you like.

Normally for single column content you would just create one pagemark taking
up the width of the entire page.

However, many PDFs are designed for print media and have two or more columns.

In this scenario you would just create two pagemarks - one per column.

## Progress

Each pagemark allows you to 'cover' a book and note what you've read.  A book is
considered unread until you start creating pagemarks.

Once a pagemarks has been created we adjust progress in real time and create
visual marks over the page to note that you've read this portion of the
document.

<img src="../screenshot.png"></a>
