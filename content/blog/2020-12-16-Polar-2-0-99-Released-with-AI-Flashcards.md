---
title: Polar 2.0.99 released with AI flashcards
date: 2020-12-16T08:00:00.000-08:00
layout: post
description: Polar 2.0.96 with AI-generated flashcards is now live 
large_image: https://i.imgur.com/Mld7JSU.png
---

The simplest way to create flashcards from text highlights is finally here!

We are happy to announce that we have launched AI-generated flashcards using GPT-3. 

Simply highlight some text and click the button. It will take the text you selected and automatically convert it into a question and answer flashcard that you can sync to Anki or review directly in Polar.

Check it out in action here:

<img class="img-fluid" src="https://i.imgur.com/wZxpMyg.gif">

AI-generated flashcards will allow you to speed up and simplify creating flashcards directly from text highlights.

We are using OpenAI's <a href="https://en.wikipedia.org/wiki/GPT-3">GPT-3</a> for this on the backend. Since GPT-3 is content-agnostic, you can use this on any text highlight. Create the flashcards the fastest way and sync them directly to <a href="https://ankiweb.net/about">Anki</a>.

The feature is available to all Plus and Pro users.

A few tips on how to best use the feature:
- Use relatively short annotations - right now only one flashcard is generated from annotations. We will increase this in the near future so you get several flashcards from annotations. An additional advantage is that the latency is shorter with shorter annotations
- Use the feature for annotations where the question and answer is in the annotation. The algorithm should only use information that is provided in the annotation

As you might have seen, GPT-3 has huge upside potential but also huge potential for misuse. To avoid any misuse and ensure we stay compliant with OpenAI’s terms, we have set a few limitations on this feature:
- Maximum length of an annotation to run through this feature is 750 characters
- Only one flashcard is generated per annotation - this will be increased over time
- Content has to pass an internal content filter
- Plus users get 100 flashcard generations per month, Pro get 250 / month

We plan to also add cloze deletions with this feature in the foreseeable future.

Furthermore, here are some additional updates in this release:
- FIXME: add add'l changes

Finally, since we are approaching the holidays very quickly, we are also doing a special holiday sales for new upgrades. Use the code 2020Out to get 20% off on a new year-long Plus or Pro plan (redeemable until Jan 2).
