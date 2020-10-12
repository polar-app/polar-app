---
title: Tracking Policy
layout: doc
date: 2019-01-30 07:22:47 -0800
permalink: /docs/tracking-policy.html
description: Polar uses Google Analytics and other 3rd party services to track your usage of Polar for quality assurance 
---

# Tracking Policy

Polar uses Google Analytics and other 3rd party services to track your usage 
of Polar for quality assurance, UI/UX and usability issues, fault detection, 
and adoption and usage of new features.

Our *only* goal for tracking is to improve the quality of the application.

We are *not* interested in tracking the actual content of the books you read, 
the annotations, you create, etc.

We would consider this a bug and revert any change that actively exposed the 
reading list or annotations of our users without their consent.

There may be data leaks ()such as the name of a book in an exception log) but we
try to keep this to either zero or a minimum by iterating and improving any
potential data leaks.

# What we track

This is a non-exhaustive list of what we track in Polar.  It may be inaccurate 
but we strive to keep it up to date.

## Runtime Faults and Exceptions

We use [Sentry](https://sentry.io) to report exceptions as they are encountered
in the application. If Polar has a bug of failure a recording of that is sent
to sentry which allows us to debug real-world problems fix them.

## Usage 

We use Google Analytics to track various features and usage of the product 
including but not limited to:

 - Number of documents in your repository
 - Product version
 - The types of documents you're using.
 - The types of features you're using (capture, annotations, etc)
 - Application level events (create comment, create annotation, etc)

# How we track

ALL tracking data is sent via SSL.  We consider this a hard requirement and will
revert any tracking system that either has insecure or broken SSL.

# Opt-Out

We will implement an opt-out feature in the future.  We would still encourage
you to leave tracking on as this data is very very valuable for us to continue
to improve the application and without your usage data we can't improve the 
application for your specific use case.
