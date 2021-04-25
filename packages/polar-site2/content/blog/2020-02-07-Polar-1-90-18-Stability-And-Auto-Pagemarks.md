---
title: Polar 1.90.18 - Stability Improvements and Auto Pagemarks
date: 2020-02-07T08:00:00.000-08:00
layout: post
description: Polar 1.90 is now available for all desktop users and will be rolling out over the next week.  
release: 1.90.18
---

Polar 1.90.18 is now available for all desktop users and will be rolling out over the next week.  

## Stability

A ton of work has gone into stability to continue improving reliability for users.  

## Filtering Annotations in Sidebar

You can now filter annotations in the sidebar to search by text.  

<img src="https://i.imgur.com/Ph4xcM7.png" class="border" style="width: 400px">

## Auto Pagemarks

We have preview support for auto-pagemarks which are part of our new [pagemark design](https://getpolarized.io/docs/new-pagemark-design.html).

This will create pagemarks automatically while you naturally read the document.

You have to enable it in settings (as it's preview for now) and it only supports PDF documents.

We're going to probably make this the default mode and remove manually sized pagemark boxes as this is a better initial
user experience but also resolves some issues with manually resized pagemarks being buggy.

## Full Changelog

**1.90.18**

- Sentry is now disabled as it was breaking windows builds.
- Flow for the annotation sidebar now fixes the header at the top and 
  properly sets overflow so just the sidebar text flows. 
- Short term workaround for a bug where firebase won't write to prefs on 
  startup which blocked cloud sync on restart for some users.
- Upgraded to latest Firebase libraries (7.7.0)
- Fixed bug with spacing in the tree sidebar for nodes that get compressed.
- Ability to filter annotations on the sidebar.
- Fixed bug with performing reviews when nothing left was available.
- Fixed bug with #? not being encoded properly due when creating file URLs.
