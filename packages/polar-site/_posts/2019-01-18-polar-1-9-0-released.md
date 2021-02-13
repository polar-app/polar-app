---
title: Polar 1.9.0 Released
date: 2019-01-18 09:00:00 -0800
layout: post
image: https://getpolarized.io/assets/logo/icon.png
description: Polar 1.9.0 was just released. This release is mostly focused around stability and fixes a number of important bugs.
---

# Polar 1.9.0 Released

Polar 1.9.0 was just released. This release is mostly focused around stability
and fixes a number of important bugs.

One big new feature went into this release though - you're now able create
pagemarks across multiple pages.

## Documentation

Here's the excerpt from the documentation:

When you right click and select "Create Pagemark to Point" Polar creates 
pagemarks over all previous pages up until the previous pagemark (or the 
beginning) of the document.

This enables you to import a book which you've been reading and mark multiple
pages as read so that you can now just use Polar to track your pgoress.

For example, if you have a 300 page book, and you've read pages 1-200 you can 
just jump to page 200 and "Create Pagemark to Point" and pagemarks will be
created across all previous pages.

You can still pagemark the current page by selecting "Create Pagemark Box" to 
or run "Control Alt N" to mark just the current page.  

## Full Changelog

- Create pagemark to point now works across multiple pages and ranges.

- Fixed bad bug where the UI wouldn't update when a newly imported PDF wasn't
immediately visible in the UI. This was a bad initial user experience as they
would have to reload for the PDFs to be visible.

- Fixed major Twitter content capture bug where we weren't saving the CSS styles
of HTML content.

- Fixed bug where VH rules that were less than 100 weren't being set properly
and some pages rendered ugly.

- Fixed bug with the 'deck:' tag not properly working with Anki sync.

- Importing large numbers of PDFs (and large PDFs) is now a lot faster and more
responsive when using cloud storage.  In the past we used to wait until the
cloud layer was finished but this takes a long time to complete.

- Now using 'localhost' instead of 'localapp.getpolarized.io' for the hostname.
Some users weren't able to resolve this (not sure why) and additionally
working offline didn't function either.
