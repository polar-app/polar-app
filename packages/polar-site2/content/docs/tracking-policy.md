---
title: Tracking Policy
layout: doc
date: 2019-01-30 07:22:47 -0800
permalink: /docs/tracking-policy.html
description: Polar uses Google Analytics and other 3rd party services to track your usage of Polar for quality assurance 
---

# Tracking Policy

Polar uses analytics services and other 3rd party services to track usage 
of Polar for quality assurance, usability issues, and fault detection.

Our *only* goal for tracking is to improve the quality of the application. We only track data in an anonymized fashion which cannot be pinpointed to a specific user.

We are *not* interested in tracking the actual content of the books you read, 
the annotations, you create, etc.

## Runtime Faults and Exceptions

We use <a href="https://sentry.io" target="_blank">Sentry</a>
to report exceptions as they are encountered
in the application. If Polar has a bug of failure a recording of that is sent
to sentry which allows us to debug them.

## Usage 

We use 3rd party analytics services to track various features and usage of the product 
including but not limited to:

 - Number of active users (anonymized, non-attributable to a specific user)
 - Product version and platform (anonymized, non-attributable to a specific user)
 - Polar usage by region (anonymized, non-attributable to a specific user)
 - The types of features used (anonymized, non-attributable to a specific user)
 - Application level events (anonymized, non-attributable to a specific user)

# How we track

ALL tracking data is sent via SSL.  We consider this a hard requirement and will
revert any tracking system that either has insecure or broken SSL.
