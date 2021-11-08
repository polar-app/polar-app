---
title: Polar 1.80 - Manual Update Required for Desktop Users 
date: 2019-12-20T08:00:00.000-08:00
layout: post
description: Polar 1.80 - Manual Update Required for Desktop Users
---

# Polar 1.80 - Manual Update Required for Desktop Users

Polar 1.80 for MacOS and Windows requires users to manually update to the latest version by [manually downloading and
installing the latest version](https://getpolarized.io/download.html).

We're very sorry for the inconvenience.  There was a bug in Electron >7.1.2 that broke updates for all Electron
applications.  I've filed bugs against the Electron project to hopefully fix this before it impacts other projects.

We aggressively test all major releases but didn't think that a small point upgrade would have such a massive 
implication.

Moving forward, we're going to be migrating to a new build system which automatically tests the update system. 

This should prevent the problem from happening again.
