---
title: Flashcard and annotation review
layout: doc
permalink: /docs/spaced-repetition.html
description: Polar implements spaced repetition and review of annotations on mobile and desktop devices. 
---

# Overview

You can review all flashcards and annotations that you have created in Polar in the annotation viewer. Polar supports spaced repetition to automatically schedule reviews based on how well you know a card.

# Spaced reptition background

If you're not familiar with spaced repetition you can ready up on it <a href="https://getpolarized.io/2020/09/20/What-is-Spaced-Repetition-A-Beginner's-Guide.html" target="_blank">here</a> or read a more detailed overview <a href="https://numinous.productions/ttft/">here</a>.

At a high level spaced repetition allows you to review your notes by efficiently scheduling them into tasks that can be performed 15-60 minutes per day spread out while you're idle.

<a href="https://en.wikipedia.org/wiki/Spaced_repetition">Wikipedia has a good overview of SR</a>:

> Spaced repetition is an evidence-based learning technique that is usually performed with flashcards. Newly introduced and more difficult flashcards are shown more frequently while older and less difficult flashcards are shown less frequently in order to exploit the psychological spacing effect. The use of spaced repetition has been shown to increase rate of learning.[1]
  
> Although the principle is useful in many contexts, spaced repetition is commonly applied in contexts in which a learner must acquire many items and retain them indefinitely in memory. It is, therefore, well suited for the problem of vocabulary acquisition in the course of second-language learning. A number of spaced repetition software programs have been developed to aid the learning process.

This is based on research from cognitive science around the <a href="https://en.wikipedia.org/wiki/Forgetting_curve">forgetting curve</a>:

> The forgetting curve hypothesizes the decline of memory retention in time. This curve shows how information is lost
over time when there is no attempt to retain it.[1] A related concept is the strength of memory that refers to the
durability that memory traces in the brain. The stronger the memory, the longer period of time that a person is able to
recall it. A typical graph of the forgetting curve purports to show that humans tend to halve their memory of newly
learned knowledge in a matter of days or weeks unless they consciously review the learned material.

# Incremental reading

For incremental reading, we support spaced repetition for of flashcards and annotations. Reading your annotations with spaced repetition 
intervals allows you to pursue incremental reading where you re-read important parts of documents you've highlighted.

You can read more in our detailed overview of <a href="https://getpolarized.io/docs/incremental-reading.html">Incremental Reading with Polar</a>.

# Anki vs Polar

Polar supports Anki sync and our own native flashcard and spaced repetition based on similar technology and concepts.

For details, read our documentation on <a href="https://getpolarized.io/docs/anki-sync-for-spaced-repetition.html">Anki sync</a>.  

# Review

Polar allows you to review annotations directly by going to the annotation view and selecting ```Start Review``` at the top left which will review ten cards at a time.   

<p class="text-center">
<img class="img-fluid border" src="https://i.imgur.com/2JZu8EV.png">
</p>

When you create an annotation or flashcard, they will be scheduled for the future so that you can review them at a later date. Specifically, a newly created flashcard or annotation will only show up in the review queue 24 hours after it was created.

Ever time you start a review, the algorithm takes 10 cards that are due for review. After those 10 cards, this review is finished. If you want to review more cards, you can start another review

If you only want to review a specific set of annotations or flashcards, you can do that by selecting a specific tag or annotation color. When you start a review, it will only review cards with those attributes 

# Algorithmic schedule for reviews

Polar implements a variant of SM2 to schedule cards. This is the same algorithm used in Anki, and SuperMemo with a few 
modifications which effectively do not change the core scheduler algorithm but just make it easier to work with.

## Stages

All cards go into a 'learning' mode until you've been able to get a good grasp of the core material.  At that point they
'graduate' to a 'review' mode which schedules the jobs at higher and higher intervals when you accurately complete each 
task.

Once in reading the intervals keep increasing if you keep selecting 'good' until, at some future point, the card becomes
so mature that you're only reviewing it every year or so.

When you're reviewing a card and you can't remember it you can hit 'again' and it will lapse and revert back to the 
learning stage.  If you remember it the second time it will go back to review mode with a lower interval. 

