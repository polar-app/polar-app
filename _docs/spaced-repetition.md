---
title: Spaced Repetition and Reading Review
layout: doc
permalink: /docs/spaced-repetition.html
description: Polar implements spaced repetition and review of annotations on mobile and desktop devices. 
---

# Spaced Repetition and Reading Review

Polar implements spaced repetition and review of annotations on mobile and desktop devices.

For spaced repetition you must be logged in via cloud sync.  Part of the advantage of spaced repetition is reviewing
on mobile devices, tablets, and your web browser and this requires the cloud.

# Background

If you're not familiar with spaced repetition you can get up to speed by [reading this infographic by ncase](https://ncase.me/remember/) or
["How can we develop transformative tools for thought?"](https://numinous.productions/ttft/) by [Andy Matuschak](https://andymatuschak.org) and [Michael Nielsen](http://michaelnielsen.org/).

At a high level spaced repetition allows you to review your notes by efficiently scheduling them into tasks that can be
performed 15-60 minutes per day spread out while you're idle.

[Wikipedia has a good overview of SR](https://en.wikipedia.org/wiki/Spaced_repetition):

> Spaced repetition is an evidence-based learning technique that is usually performed with flashcards. Newly introduced and more difficult flashcards are shown more frequently while older and less difficult flashcards are shown less frequently in order to exploit the psychological spacing effect. The use of spaced repetition has been shown to increase rate of learning.[1]
  
> Although the principle is useful in many contexts, spaced repetition is commonly applied in contexts in which a learner must acquire many items and retain them indefinitely in memory. It is, therefore, well suited for the problem of vocabulary acquisition in the course of second-language learning. A number of spaced repetition software programs have been developed to aid the learning process.

This is based on research from cognitive science around the [forgetting curve](https://en.wikipedia.org/wiki/Forgetting_curve):

> The forgetting curve hypothesizes the decline of memory retention in time. This curve shows how information is lost
over time when there is no attempt to retain it.[1] A related concept is the strength of memory that refers to the
durability that memory traces in the brain. The stronger the memory, the longer period of time that a person is able to
recall it. A typical graph of the forgetting curve purports to show that humans tend to halve their memory of newly
learned knowledge in a matter of days or weeks unless they consciously review the learned material.

# Reading Review

Polar implements spaced repetition around reviewing your annotations on a given schedule  We currently do not allow you 
to review your flashcards directly in Polar and for now you can use Anki directly.

At some point we will probably have basic flashcard support and more advanced users can use Anki directly.

Polar's reading review allows you to schedule review of your annotations while mobile and makes reading of text and 
complex PDFs easier as you can pre-read them on desktop devices and then review on mobile or tablets.

# Start Review

Polar allows you to review annotations directly and you can go to the annotation view and then select "Start Review"
which will review ten cards at a time.   

<img class="img-fluid border" src="https://i.imgur.com/FNEYGTj.png">

These will then be scheduled for the future so that you can review them at a later date.

# Scheduling 

Polar implements a variant of SM2 to schedule cards. This is the same algorithm used in Anki, and SuperMemo with a few 
modifications which effectively do not change the core scheduler algorithm but just make it easier to work with.

## High-level Overview

All cards go into a 'learning' mode until you've been able to get a good grasp of the core material.  At that point they
'graduate' to a 'review' mode which schedules the jobs at higher and higher intervals when you accurately complete each 
task.

<!--
FIXME: 
 - how to 'install' the mobile app
 - lapses
 - intervals for the learning stage
 - example of delays
 - graph of the forgetting curve  
-->
