---
title: Spaced Repetition and Reading Review
layout: doc
permalink: /docs/spaced-repetition.html
description: Polar implements spaced repetition and review of annotations on mobile and desktop devices. 
---

# Spaced Repetition

Polar implements spaced repetition for flashcards and annotations on mobile and desktop devices. Since all files are stored in the cloud, you can easily create flashcards on the desktop and review on mobile.

# Background

If you're not familiar with spaced repetition you can get up to speed by <a href="https://ncase.me/remember/">reading this infographic by ncase</a> or
<a href="https://numinous.productions/ttft/">"How can we develop transformative tools for thought?"</a> by Andy Matuschak and Michael Nielsen.

At a high level spaced repetition allows you to review your notes by efficiently scheduling them into tasks that can be
performed 15-60 minutes per day spread out while you're idle.

<a href="https://en.wikipedia.org/wiki/Spaced_repetition">Wikipedia has a good overview of SR</a>:

> Spaced repetition is an evidence-based learning technique that is usually performed with flashcards. Newly introduced and more difficult flashcards are shown more frequently while older and less difficult flashcards are shown less frequently in order to exploit the psychological spacing effect. The use of spaced repetition has been shown to increase rate of learning.[1]
  
> Although the principle is useful in many contexts, spaced repetition is commonly applied in contexts in which a learner must acquire many items and retain them indefinitely in memory. It is, therefore, well suited for the problem of vocabulary acquisition in the course of second-language learning. A number of spaced repetition software programs have been developed to aid the learning process.

This is based on research from cognitive science around the <a href="https://en.wikipedia.org/wiki/Forgetting_curve">forgetting curve</a>:

> The forgetting curve hypothesizes the decline of memory retention in time. This curve shows how information is lost
over time when there is no attempt to retain it.[1] A related concept is the strength of memory that refers to the
durability that memory traces in the brain. The stronger the memory, the longer period of time that a person is able to
recall it. A typical graph of the forgetting curve purports to show that humans tend to halve their memory of newly
learned knowledge in a matter of days or weeks unless they consciously review the learned material.

# Flashcards and Incremental Reading

We support spaced repetition for your flashcards and annotations.  Reading your annotations with spaced repetition 
intervals allows you to pursue incremental reading where you re-read important parts of documents you've highlighted.

# Anki vs Polar

Polar supports Anki sync and our own native flashcard and spaced repetition based on similar technology and concepts.

Read our documentation on <a href="https://getpolarized.io/docs/anki-sync-for-spaced-repetition.html">Anki sync</a>.  

# Start Review

Polar allows you to review annotations directly by going to the annotation view and selecting "Start Review"
which will review ten cards at a time.   

<p class="text-center">
<img class="img-fluid border" src="https://i.imgur.com/FNEYGTj.png">
</p>

When you create an annotation or flashcard, they will be scheduled for the future so that you can review them at a
later date.

# User Interface

We will compute 10 or more 'tasks' that need to be completed.  Right now these are reading reviews but in the future
will also be flashcards.

<p class="text-center">
<img class="img-fluid border" src="https://i.imgur.com/BKkEVKl.png">
</p>

# Scheduling 

Polar implements a variant of SM2 to schedule cards. This is the same algorithm used in Anki, and SuperMemo with a few 
modifications which effectively do not change the core scheduler algorithm but just make it easier to work with.

# Selecting Specific Tags/Folders, colors, etc

When you click ```Start Review``` only the currently shown annotations are considered for review.  This will allow you
to narrow a review to a specific folder or tag.  You can also filter by annotation color as well.

# High-level Overview

## Stages

All cards go into a 'learning' mode until you've been able to get a good grasp of the core material.  At that point they
'graduate' to a 'review' mode which schedules the jobs at higher and higher intervals when you accurately complete each 
task.

Once in reading the intervals keep increasing if you keep selecting 'good' until, at some future point, the card becomes
so mature that you're only reviewing it every year or so.

When you're reviewing a card and you can't remember it you can hit 'again' and it will lapse and revert back to the 
learning stage.  If you remember it the second time it will go back to review mode with a lower interval. 

