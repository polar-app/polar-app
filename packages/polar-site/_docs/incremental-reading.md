---
title: Incremental Reading 
layout: doc
permalink: /docs/incremental-reading.html
description: Incremental reading is a strategy around suspending and resuming reading of a document over time to track progress using a a 'pagemark.' 
---

# Incremental Reading 

Incremental reading is a strategy around suspending and resuming reading of a document over time.  Reading the documents
in chunks and coming back to the document at any future point in time.

Wikipedia has a good overview of
<a href="https://en.wikipedia.org/wiki/Incremental_reading">incremental reading</a>

> Incremental reading is a software-assisted method for learning and retaining information from reading, helping with the creation of flashcards out of electronic articles read in portions inside a prioritized reading list.

> It is particularly targeted to people who are trying to learn for life a large amount of information, particularly if that information comes from various sources.

> "Incremental reading" means "reading in portions". Instead of a linear reading of articles one at a time, the method works by keeping a large reading list of electronic articles or books (often dozens or hundreds of them) and reading parts of several articles in each session. Articles in the reading list are prioritized by the user.

> In the course of reading, key points of articles are broken up into flashcards, which are then learned and reviewed over an extended period of time with the help of a spaced repetition algorithm.

Incremental reading in Polar is implemented with the use of ["pagemarks"](/docs/pagemarks.html) which allow the user to
mark regions of the document as read.

We also support reviewing your annotations using a [spaced repetition](/docs/spaced-repetition.html) schedule 
