---
title: Anki Sync for Spaced Repetition
layout: doc
date: 2018-12-19 07:22:47 -0800
permalink: /docs/anki-sync-for-spaced-repetition.html
description: Polar supports native integration with Anki via the Anki Connect add-on. 
---

# Background


This allows you to sync flashcards created from annotations directly to Anki.

Polar supports a robust annotation system internally with features like text and
area highlights, and allowing comments and flashcards to be attached directly to
the highlights.

The key advantage is that this systems not only creates flashcards but keeps *context* associated with the 
flashcards.

The context is important.  When using spaced repetition you don't want to forget 
the context in the future.  You might forget about a topic or want to review
and knowing the context is extremely important.   

# Setup

To get started, you need to add <a href="https://ankiweb.net/shared/info/2055492159">Anki Connect</a> as an add-on in Anki. See deatils in the link but in essence, all you need to do is add Anki Connect's code to your add-ons within Anki.

Once that's done, you can sync all your flashcards to Anki by clicking the 'Start Anki Sync' in the top right corner of the app. Syncing only works from the desktop app, not from the webapp

<img class="img-fluid" src="https://i.imgur.com/T7e8Q1j.png">

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

Install the <a href="https://ankiweb.net/shared/info/2055492159">Anki Connect</a> add-on 
and restart Anki. At this point Polar can sync to Anki properly.

# Usage 

Once Anki Connect is running, go to the overflow menu to the right in the navbar
and select ```Start Anki Sync``` from within the Document Repository.

# Issues

## Firewall

If you have any issues connecting Anki make sure you don't have a firewall in 
place.  Anki Connect runs Anki on a specific port and Polar needs to connect
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

- Anki must have Anki Connect. This will always be a hard requirement, but we
  might create a Polar Sync plugin for Anki.

- No support for nested decks.  Each deck is created at the root.  If you move it
  the new deck will be created. We will have a fix for this in the future.

- All flashcards are always sync'd each time. This is probably going to be slower
  for larger decks but we plan to implement differential sync in the future.
