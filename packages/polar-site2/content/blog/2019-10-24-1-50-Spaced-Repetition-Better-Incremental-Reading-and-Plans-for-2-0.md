---
title: Polar 1.50 - Spaced Repetition, Better Incremental Reading and Plans for 2.0
date: 2019-11-11T08:00:00.000-08:00
layout: post
large_image: https://getpolarized.io//assets/screenshots/2019-11-document-view.png
description: Polar 1.50 - Spaced Repetition, Better Incremental Reading and Plans for 2.0
release: 1.50.0
---

Polar 1.50 was just released and will be rolling out to everyone in a staged over the next week.

This is one of the biggest releases we've had in a long time and will be the foundation for 2.0. 

# What's In This Release

Now let's get into what we've changed in this release.

## Improved Incremental Reading and Spaced Repetition

As part of this release we conducted about 30 user interviews and one clear trend was that users needed and wanted a
better mobile experience. 

The previous version of our mobile app was alpha at best and was just meant to be a standby until we had it fully ported
over to mobile and tablet.

This is going to take longer than I had hoped but dove tails into the long term of Polar being a spaced repetition platform.

We've rebuild the mobile app and integrated native flashcard review into Polar directly.

Anki functionality and sync will keep improving of course and will not be deprecated.  In fact, we have a few more 
features we're working on for Anki and will be enabling them in the coming weeks via feature flags at first.

There's now a 'start review' button in the annotations view that allows you to review your flashcards directly in Polar.

### Incremental Reading

As part of this we now have incremental reading and review of your annotations on mobile via spaced repetition schedules.

The intervals for incremental reading are longer for flashcards (1d, 4d, and 8d) and the system was designed to work
well with review on the mobile app.

## New Mobile App Redesign

As part of the full mobile app redesign the new experience should be completely smooth and ready for production use.

I want to improve it a bit more to work completely offline.  Firebase has some amazing cache/offline-first features 
where queries and data can be written and re-sync'd when you come back online.

This has interesting opportunities for reviewing your reading and flashcards when not connected to the Internet. 

### Stats for Flashcards 

<img class="img-fluid border border-dark rounded" src="https://i.imgur.com/rjhlQLY.png">

This version now adds stats for flashcards including total completed, queue size, etc.

### Paid on Mobile

Mobile flashcard review will be a paid feature in 2.0 when on mobile.  It will work for free on the desktop app
but if you want to review on mobile you will need a premium account.

## Annotation Bar color updates

The annotation bar now has 5 main colors (up from 3) when selecting text for a highlight.

## Only Stable Features

We're going to take the position of only enabling stable features from now on. For new users to Polar this was confusing
when they would see something like groups (even if it had a 'beta' flag on it) and I want them to have a good initial  
experience.

From now on we will be enabling new (and not yet ready) features via feature flags that developers or beta testers 
can turn on manually.

## Documentation and Website Updates

Our documentation is being reworked now to update the changes needed for 2.0.  I'm going to try to get more press for 
2.0 so this will mean a lot of new user seeing Polar for the first time.

## Full List of Changes in 1.50.10

- Statistics now shown for flashcards when the user is using spaced repetition 

- No more hamburger menu in the sidebar.  All options are now flat in the desktop UI and more discoverable.

- Using proper MacOS system font along with Robot everywhere else including android devices.  

- New documentation rework and will be improving this long term.

- Added two more colors to the annotation bar. Was frequently requested by our users so just added it.

- Flashcards now inherit the text of the annotation when being created to avoid double copy / pasting of text.

- Mobile now a supported platform and designed for spaced repetition.  This will get us moving on mobile until
  we can build out a real/full reading platform there.

- The header and footer in the doc repo is fixed now and don't move as you scroll. 

- Fixed bug with drag and drop and working with items from the second page of results.

- Flashcard reviewer now integrated along with our normal spaced repetition.
 
- Annotation reviewer spaced repetition system finally integrated into Polar

- More work on mobile including disabling some features when using the app.

- Active filters are now light blue so that users know they have filters enabled.

- Color and annotation type filters now work.

- Fixed bug with the root folders having the wrong counts

# What's Next and Plans for 2.0  

This release is basically the foundation for 2.0.  There are a few more features / changes to make before 2.0 is ready. 

We have to improve our documentation a bit more and we have a few more fixes and changes that are still pending.

## Updated Annotation Sidebar

I'm looking at improving the annotation sidebar to add features like filtering by text (search basically), tagging documents
directly (vs having to jump back to the document repository), and other options like archiving, etc.  

## Better Pricing Models

I'm working on better pricing models for students and those outside the United States in developing countries.  Charging
$4.99 per month to someone in India/Laos doesn't seem fair considering the differing values of currencies.

I'm also investigating yearly accounts as I think there's a psychological advantage for students to buy in 1-2 year 
increments as it seems many people really dislike monthly payments. 

## Better Keyboard Bindings

We're investigating bringing on board better keyboard bindings.  It didn't make it to this release because we have to
do a big dependency management update (React) and I wanted to get a stable release out the door.
