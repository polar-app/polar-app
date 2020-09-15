---
title: Tracking Policy
layout: doc
date: 2019-01-30 07:22:47 -0800
permalink: /docs/tracking-policy.html
description: Polar uses Google Analytics and other 3rd party services to track your usage of Polar for quality assurance 
---

# Tracking Policy

Polar uses Google Analytics and other 3rd party services to track usage 
of Polar for quality assurance, UI/UX and usability issues, fault detection, 
and adoption and usage of new features.

Our *only* goal for tracking is to improve the quality of the application. We only track data in an anonymized fashion which cannot be pinpointed to a specific user.

We are *not* interested in tracking the actual content of the books you read, 
the annotations, you create, etc.

We would consider this a bug and revert any change that actively exposed the 
reading list or annotations of our users without their consent.

There may be data leaks ()such as the name of a book in an exception log) but we
try to keep this to either zero or a minimum by iterating and improving any
potential data leaks.

# What we track

This is a non-exhaustive list of what we track in Polar.  We update this from time to time.

## Runtime Faults and Exceptions

We use <a href="https://sentry.io" target="_blank">Sentry</a>
to report exceptions as they are encountered
in the application. If Polar has a bug of failure a recording of that is sent
to sentry which allows us to debug real-world problems fix them.

## Usage 

We use Google Analytics to track various features and usage of the product 
including but not limited to:

 - Number of total active users
 - Product version and platform
 - Polar usage by region (anonymized, non-attributable to a specific user)
 - The types of features used (anonymized, non-attributable to a specific user)
 - Application level events (anonymized, non-attributable to a specific user)

# How we track

ALL tracking data is sent via SSL.  We consider this a hard requirement and will
revert any tracking system that either has insecure or broken SSL.
