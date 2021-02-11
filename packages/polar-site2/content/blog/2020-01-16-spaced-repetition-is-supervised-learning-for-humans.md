---
title: Spaced Repetition is Supervised Learning for Humans
date: 2020-01-21T08:00:00.000-08:00
layout: post
description: 
large_image: 
hidden: true
visible: false
---

# Spaced Repetition is Supervised Learning for Humans

What if you could train your brain the way computer scientists train computers
and effectively remember anything you want - forever?

On the surface this sounds rather absurd. You're not a computer.  You can't be
*forced* to learn new things.  Education is complicated, and (if you're like me),
there doesn't seem to be any rhyme or reason to why some facts stick while you fail
to grasp other (often more complicated) concepts.

Cognitive science has actually found a way to solve this problem.  It turns out
that we've had a solution for more than 135 years and the tools are finally
starting to become mainstream.

This connection between supervised learning (AKA machine learning) and spaced
repetition was my motivation for building Polar. I wanted a unified learning
platform that exploited spaced repetition and made it easy to use and
incorporate into your workflow.

I'll get to the connection between spaced repetition and supervised learning in
a moment but it's probably best to first explain spaced repetition.

## Background in Learning

Spaced repetition is centered around what's known as the 'forgetting curve' and
directly exploits the way the brain encodes knowledge.

The forgetting curve is based on the intuition that it's best to study something
*just* before it's forgotten.

<img class="img-responsive" src="https://i.imgur.com/jOAqCpi.png">

This was discovered in 1885 by
[Hermann_Ebbinghaus](https://en.wikipedia.org/wiki/Hermann_Ebbinghaus) when he
was researching the rate of information loss when trying to memorize three
letter syllables.

As an aside, Ebbinghaus's major innovation, in my opinion was the use of data
and statistics to learn how the brain functioned internally. Prior to
Ebbinghaus, most "research" on memory was done by philosophers without any form
of scientific rigor (at least no where near Ebbinghaus).

It might be best to think of these as time intervals from when you originally
studied a piece of information.

Let's say you wanted to remember that "Fe is the chemical symbol for Iron." 
This is actually a bit complicated (at least for English speakers) as Fe is
taken from the Latin word for iron - ferrum.

You can imagine that this would be quickly forgotten so you might want to recall
it twenty minutes before it's forgotten.

It's this observation that the intervals keep increasing which makes spaced
repetition so powerful.

Typical intervals her would involve reviewing the material at 20 minutes, 1
hour, 4hour, 8hour, etc intervals.  These would keep increasing exponentially
until you're reviewing the material with intervals of years, not minutes.

This is eventually a scheduling system to supervise your brain to learn
complicated topics which your brain wouldn't normally be able to encode. 
Supervised learning for humans.  It's almost a *cognitive prosthetic* designed
for force you to learn.

## Exponential Backoff

One key innovation is that spaced repetition intervals use exponential backoff -
or ever increasing intervals.

What the heck is exponential backoff?

A naive (and rather insane) strategy to review your flashcards would be to just
review them ever week.  However, This won't scale to a large number of
flashcards.

Over ten years, and 15 seconds pre review, this would require 2 hours of study
time - for one card.

However, using an efficient flashcard scheduler, which adapts itself your
answers, we're able to retain this knowledge using just 8 iterations.

This is approximately 99% more efficient (8 * 15 seconds vs more than 2 hours)
than a naive solution.

These scheduler increases the interval based on your feedback.  If you keep
answering the flashcard properly the interval will increase exponentially
(approximately t^1.3).

For example, 3 days, then 9 days, then 27, then 81 days, etc.

## 




What's key about the forgetting curve is that it exploits exponential decay.



- include a chart of the learning curve



 
  
- Hacks to Remember 

    - Ubsurdity
    - Passion

- Bitrot... 

    - It's easier to commit to learning something if you know it will never be forgotten
    
- What is Machine Learning?

  - unsupervised is where the algorithm, inherently knows what to do and 
    generally tends to do the right thing.
    
  - supervised learning is training a computer
  
- What is Supervised Learning?

- Cognitive prosthetic

- Other Mnemonic Strategies 
    - these can accelerate spaced repetition but (in my opinion) are not a replacement for SR.
    - 
    
- Mainstream.
