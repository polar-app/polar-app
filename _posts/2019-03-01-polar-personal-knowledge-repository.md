---
title: Polar as a Personal Knowledge Repository  
date: 2019-03-01 09:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/open-library-scaled.jpg
description: Polar is designed around the idea of maintaining all your documents in one place and maintaining key extracted knowledge via spaced repetition. 
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/open-library-scaled.jpg">

# Polar as a Personal Knowledge Repository

I wanted to finally take the time and write up my long term vision of where
Polar is headed as well as discuss some anti-goals (or at least secondary goals)
of the project.

Polar is designed around the idea of maintaining all your documents in one
place, annotating them with highlights, comments, managing your documents with
tags, and maintaining key extracted knowledge via spaced repetition.

I believe this is a new class of application which we will see more players over
the next decade - at least I hope so as competition is a good thing.

Polar is a Personal Knowledge Repository (PKR) designed to maintain an external
repository of everything critical to your education.

This includes all your books, annotations, notes, and flashcards.

I don't *only* mean a formal education though.  If you want to load a text book 
into Polar for work and maintain the knowledge long term you should be able to 
do that as well. 

The more you use your PKR the more value it has but additionally the greater 
risk that its failure would have a negative impact on your life and your career.

If the company that runs your PKR goes out of business you're entire education
might be in jeopardy.

While you might still have a copy of the data you won't be able to actually 
use the notes or at the very minimum your notes will have less value as they're
not exactly usable.

This is why I went with the name Polar.  Your repository essentially freezes and
protects all your knowledge and maintains its integrity.  A Polar repository is
designed to follow through your entire career.  Everything that you learn in
college (or in your spare time) is kept in Polar to prevent forgetting key
material.

This is why spaced repetition is important.  Without spaced repetition managing
such a massive repository of information would not be manageable.

## Data Integrity.

One of our primary goals is that you control the data and you can export at 
any time and the file formats used are self describing and easy to work with.

While they might not necessarily be an open standard (yet) you can export 
and easily write tools to migrate to another platform should you wish.

Right now we can sync with Anki but we also support export to markdown and have
an elegant API for sync.  

We haven't exposed any 3rd party integrations outside of Anki just yet but 
our sync API should support systems like Evernote, Quizlet, OneNote, etc.

# Long Term Education

Be honest. If you retook your final exam from your high school calculus class
would you pass?

Maybe you would if you were a mathematician or a math teacher but if your career
is in politics (or an unrelated field) you would probably fail.

This is because everything we learn has a rate of decay.  In computer science
we call this "bit rot."

Generally, for neurological systems (AKA humans) if the neural connectivity 
isn't regularly exercised - it's lost.  

Simply put - you forget.  Use it or lose it.

We force students to go through the gauntlet, pass the exams, then don't care 
that they've forgotten the material.

This is a tragedy.

It doesn't make sense to get a degree just to forget everything you've learned.

Granted a lot of key material is kept but you lose key detail.

Polar is designed to combat this problem and it's one of our primary goals.

Polar enables you to go heads down on learning complex topics without the worry
that what you learn will just be forgotten.   

# Flashcards

In 2016 I decided to do an experiment with Duolingo and see if I could teach
myself a language in my spare time.

Ever since I was a boy I developed a habit of reading while I was idle.  If I
was waiting a the DMV or in line to order a coffee I would read the news,
politics, or listen to podcasts.

However, I felt that what I was learning wasn't very valuable to my career or 
education in the long term.
 
The latest tech or political gossip has a finite shelf life.

However, learning a new language, a new branch of mathematics, studying history 
- these things benefit you for the rest of your life. 

What if it was possible to learn this type of material without actually having 
to sit down and read a text book?  What if it was possible to remember the 
material long term?  

I began just developing a habit of taking out Duolingo when I had a few minutes
to kill.

The results were really amazing and convinced me that spaced repetition is an
amazingly powerful and underrated tool.

In about a year of stealing 5-10 minutes here and there I was able to gain 
basic conversational skills in German.  I now regularly listen to German 
podcasts and TV shows - though I admit that I'm still stuck on some grammar 
and issues with pronunciation.

## Collaborative Flashcards

The problem with this style of asynchronous learning is that without sitting
down to study a text book you can't make flashcards.

Many people in the SRS community feel that creating flashcards is a major part
of the learning process.

I don't doubt that this is true for many people, however, I think we can do 
better.

What if we broke apart a book into chunks, and each chunk was readable in isolation?

What if we then (optionally) had flashcards associated with each piece of
content.

While reading the text you could have the option to view the flashcard, and
optionally import it into Polar.
  
The community could exchange these flashcards and vote on them and improve the 
quality over time.

This way you could load an academic paper or textbook and it's already 
pre-processed into a form that's easily imported as either flashcards or as a
threaded conversation with more detail.   

# Social Collaboration

This is why social collaboration is very important to Polar and why we've based
the cloud functionality on Firebase.  

Firebase allows us to support basic cloud sync for the initial cloud
functionality but for Polar 2.0 and 3.0 it will enable us to allow people to
actively collaborate around documents.

This includes document discovery, sharing comments, highlights, and flashcards.

I also want to add the ability to build high quality flashcards to enable people
to improve them collaboratively.

For example, adding audio, video, or image to flashcards can help with retention
and adding memorization techniques like mnemonics can greatly improve their
effectiveness. 

# Machine Learning

I think that with the right dataset a great deal of this can be built via 
machine learning.  

The highlights, and comments can be used to find potential anchor points for 
flashcards.  We can then use the community to build out the flashcards and 
extend them over time.

# Architecture Decisions
   
This is why we've made some of the core architectural decisions within Polar to
be biased towards a hybrid offline + cloud infrastructure.

Many of our users are from the "offline / free at any costs" camp and while I
respect that it doesn't enable us to build out the long term collaboration
functionality I want to see in future versions of Polar.

I think we can still have our cake and eat it too.

There's nothing (at least right now) preventing Polar working completely in
offline mode without using Firebase.

Some users have complained about the use of analytics frameworks like Google
Analytics.

While I also appreciate their concern we're only tracking high level events. Not
only that, but you can audit the code if you'd like.

We might offer the opportunity to disable tracking as part of Polar Premium
which would resolve that issue and still allow users to support Polar.


