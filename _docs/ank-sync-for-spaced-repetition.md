---
title: Anki Sync for Spaced Repetition
layout: doc
date: 2018-12-19 07:22:47 -0800
permalink: /docs/anki-sync-for-spaced-repetition.html
---

# Anki and Spaced Repetition

Polar supports native integration with Anki via the Anki Connect plugin.

This allows for annotations on document and connecting flashcards to these
annotations and then synchronizing them directly to Anki.

Polar supports a robust annotation system internally with features like text
and highlights, and allowing comments and flashcards to be attached directly 
to the text highlights.

This allows you to create flashcards but keep *context* associated with the 
flashcards.   

# Setup

- Install Anki Connect and restart Anki.

# Usage 

Once Anki Connect is running, go to ```Tools | Sync Flashcards to Anki``` from 
within the Document Repository. 

# Limitations

- No support for cloze deletions.  It's on the roadmap.

- Only front/back cards for now.  We will implement more card types in the future.

- No current ability to update flashcards.  Polar currently lacks a flashcard 
  update UI so this needs to be added to Polar before we can implement this in 
  Anki sync.

- Anki must have Anki Connect. This will always be a hard requirement but we
  might create a Polar Sync plugin for Anki.

- No support for nested decks.  Each deck is created at the root.  If you move it
  the new deck will be created. We will have a fix for this in the future.

- All flashcards are always sync'd each time. This is probably going to be slower
  for larger decks but we plan to implement differential sync in the future.

# Roadmap

We plan on eventually supporting the following features when creating flashcards:

- Preserving the original context URL so that you can link into polar and
  have it open the document direction 
  
- Storing additional fields in Anki including the name of the document, 
  original text content of the highlight, possibly images of the highlight
  that the flashcard is bound to. 
