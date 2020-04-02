---
title: Polar 1.90 - Improved Tablet/Phone Support and Stability
date: 2020-01-10T08:00:00.000-08:00
layout: post
description: Polar 1.90 is now available for all desktop users and will be rolling out over the next week.  
release: 1.90.0
---

Polar 1.90 is now available for all desktop users and will be rolling out over the next week.  

The major changes in this release involve improved mobile support but a ton of stability and bug fixes have gone 
into the desktop app.

## Improved Tablet and Phone Support

We're steadily improving our tablet and phone support and are hoping that full-document reading will be finished 
in mid february.

For now, the major functionality includes flashcard and annotation review while on a handheld device.

We're working on full document management just like the desktop but need a bit more time.  Specifically, features
like pagemarks and annotation creation do not work properly on handheld devices.

Tablet including iPad support has been a big feature request from our users so we really want to nail that
feature set.

## Stability

This release includes more stability and reliability issues which are now available in the desktop app as well.

We fixed a major issue with some users logging into Google that prevented them from being unable to authenticate 
in the desktop app.  

This particularly impacted students at universities which used 3rd party integration with Google auth.

## Improved Release Cadence

Now that the holidays are over we're planning on improving our release cadence and trying to push builds at 
least once every two weeks.

## Roadmap 

We're also working on releasing a rough roadmap on features for Q1 2020 and that should be out this week.

Additionally, I have a bit of a surprise for you guys so stay tuned.  

## Full Changelog

### 1.90.0

- Suggestions and net promoter score disabled for now as users were complaining
  that it was asking too often. We're going to disable this until we can make
  sure that users are only asked once per month at most. 
- significant improvements with mobile apps and spaced repetition
- Fixed bug with safari not rendering the top left folder filters...

### 1.80.29

- "Copy clipboard" from logs now pretty prints the JSON args
- Reworked flashcard app so the flashcards now look like real flashcards.
- Animations now work with the sidebar properly
- Navigations now work on tablet and phone with routes
- Reworked routes so that they're cached + faster plus work with nav
- Fixed bad bug with authentication and Google auth bringing up external URL window/prompts
