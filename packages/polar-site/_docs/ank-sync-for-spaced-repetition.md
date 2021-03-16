---
title: Anki Sync for Spaced Repetition
layout: doc
date: 2018-12-19 07:22:47 -0800
permalink: /docs/anki-sync-for-spaced-repetition.html
description: Polar supports native integration with Anki via the Polar Connect add-on. 
---

# Anki and Spaced Repetition

Polar supports native integration with Anki via the [Polar Connect](https://ankiweb.net/shared/info/734898866) add-on.

This allows for annotations on document and connecting flashcards to these
annotations and then synchronizing them directly to Anki.

Polar supports a robust annotation system internally with features like text and
area highlights, and allowing comments and flashcards to be attached directly to
the highlights.

This allows you to create flashcards but keep *context* associated with the 
flashcards.

The context is important.  When using spaced repetition you don't want to forget 
the context in the future.  You might forget about a topic or want to review
and knowing the context is extremely important.   

# Deck mapping

By default Polar stores all Anki cards in the 'Default' deck.

You can change the deck per document by setting a tag with a *deck:* prefix.

For example, if you want to store things in the 'Technology' deck you just 
tag the document you're reading as 'deck:Technology'.

NOTE: In Polar versions prior to 1.8.0 we used a 'deck per doc' strategy where
a new deck was created per document.  Not many users liked this and we removed
it in 1.8.0. Technically it's still supported but needs to be re-enabled. 

## Sub-decks

We now support sub-decks and these can be done with ```deck:compsci/linux``` for 
example with a forward slash building the sub-deck hierarchy.

We replace it with the internal Anki ```::``` but in Polar we want to keep
hierarchies represented by a forward slash.

# Card Types

Both cloze deletion and front/back card types are supported.

Cards also support rich text formatting (bold, italic, etc) as well as images.

# Setup

Install the [Polar Connect](https://ankiweb.net/shared/info/734898866) add-on 
and restart Anki.  At this point Polar can sync to Anki properly.

Note that we used to recommend Anki Connect but we suggest you install Polar
Connect now which will have more functionality.

# Usage 

Once Polar Connect is running, go to ```Tools | Sync Flashcards to Anki``` from 
within the Document Repository. 

# Issues

## Firewall

If you have any issues connecting Anki make sure you don't have a firewall in 
place.  Polar Connect runs Anki on a specific port and Polar needs to connect
via TCP to sync your flashcards.

## International Users!

***IMPORTANT** If you're using an non-English version of Anki you have to
create note types for "Basic" and "Cloze" otherwise sync will fail.  Changing
the language doesn't re-create the note types unfortunately.  We're working 
on a fix for this issue. 

# Limitations

- No current ability to update flashcards.  Polar currently lacks a flashcard 
  update UI so this needs to be added to Polar before we can implement this in 
  Anki sync.

- Anki must have Polar Connect. This will always be a hard requirement but we
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
