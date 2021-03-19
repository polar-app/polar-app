---
title: New Pagemark Design
layout: doc
permalink: /docs/new-pagemark-design.html
description: 
---

# New Pagemark Design

We're working on a new design of pagemarks meant to resolve some of the issues with our initial implementation. 

Specifically we're working on addressing the following issues:

- blue boxes obscure the underlying text of the document
- blue boxes don't work well at night.  Specifically, blue is the color that reduces melatonin production and interrupts
  the normal sleap process.
- blue boxes also don't work with those that are color blind.
- the existing system for drawing boxes is overly complicated and prone to bugs /errors when drawing new pagemarks.
- explicitly creating pagemarks was confusing for new users.
- support for dark mode by not requiring the entire page to be a pagemark and blue  

# Automatic Pagemarks

Auto pagemarks provide the beginning of our new pagemark design.  The idea is that pagemarks are created automatically
as you scroll the document.  

You can kind of think of them as 'breadcrumbs' in that, as you read naturally, a pagemark is left on the previous page.

When making large jumps within a PDF (say from chapter 2 to chapter 10), pagemarks will not be created and will only
resume when you start naturally reading at chapter 10.

## Pros

- Easily allows people to 'discover' pagemarks and for new users they will 'just work'
- MUCH more stable than the previous system. The box layout code that was buggy will no longer be used.

## Cons

- Requires existing users to understand the new system and migrate
- No pagemark on the current page but we're going to keep 'pagemark to point' for this behavior and extend it to support
  two and three column PDFs.

## Status

A preview implementation exists for PDF documents in > 1.90.15 and we're working on making this standard.
