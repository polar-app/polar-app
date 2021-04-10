---
title: Dark Mode by Default - 95% Prefer Dark over Light Mode  
date: 2019-11-25T08:00:00.000-08:00
layout: post
description: Dark Mode by Default - 95% Prefer Dark over Light Mode. One thing that's kept coming up when talking to Polar users is that we should implement dark mode. It's quickly become one of our top requested features.  I think it's about #3 right now in our new feature roadmap.
large_image: https://i.imgur.com/KSK0R75.png
pinned: 10
---

<img class="img-fluid border border-dark rounded" src="https://i.imgur.com/KSK0R75.png">

# Dark Mode by Default - 95% Prefer Dark over Light Mode

One thing that's kept coming up when talking to Polar users is that we should implement dark mode.

It's quickly become one of our top requested features.  I think it's about #3 right now in our new feature roadmap.

The problem is that it's a lot of work to build two skins (light and dark) so I had a thought: what if we only had one
theme and what if it was dark mode?

[Turns out Discord looked into the same thing:](https://blog.discordapp.com/light-theme-redeemed-c541b7ab13e9)

> As of this writing, the percentage of Discord users on light theme is in the single digits — and not even the higher ones.

... so single digits.  I'd call this about 95%.

Now this might not be clean data as Discord defaults to dark. Users would have to specifically pick the light theme after installing. 

Further, their light mode wasn't really ideal for a long time (which they admit) so this might have pushed users to 
dark mode.

IntelliJ actually DOES require the user to pick from light/dark during onboarding and I would LOVE to see their data 
since they have a large user base.

## Polling Polar Users

We've built into Polar a feature where we can poll our users and we asked them the same question.

It's currently sitting around 92% of people preferring dark mode.

We asked the same question on Twitter and we're polling around 82% right now (though with fewer users reporting).

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">If you could only use one theme for polar, light them or dark theme (granted it&#39;s not implemented yet), which one would you go with?</p>&mdash; POLAR - Personal knowledge repository (@getpolarized) <a href="https://twitter.com/getpolarized/status/1197388523545845760?ref_src=twsrc%5Etfw">November 21, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Readability

The main goal of Polar is to provide an amazing reading experience for our users. Not just in tools but it should extend
into the UX and usability. 

This, obviously, includes being able to read text.

What's the point of all the other Polar features like tagging, annotation, spaced repetition, etc, if it burns your eyes
out of their sockets?

## Why Just One Theme?

It takes a lot of testing comparing the skins to make sure there is hasn't been a regression.  

And what's worse, you can't really run integration testing on theme colors as a lot of this is just aesthetic.    

The one theme idea, right now is mostly just a thought experiment.

I'm not planning on ditching light mode.  At least until I can confirm that no one is actually using it.  However, if we
can get to a point where it's easily maintained maybe we would support both. 

## Pain and Sleep Issues

I think part of the issue here is that light mode can actually cause pain and sleep issues for some people. Having 
your retina's burned out just before bed isn't the best feeling and reading text for long term is definitely easier 
in dark mode.

## New Apps as Dark by Default

This brings up a BIG issue though.  If you're build a new app it should probably be dark by default.

In retrospect we should have gone dark to begin with but I can't go back in time and change that now.

However, if I were building a new app from the ground up, I would make it dark-mode by default.

... so we're going to eventually have a dark mode.  We have a working prototype but just need a bit more time. 
