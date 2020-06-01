---
title: Polar 1.100.13 - Tags for Annotations
date: 2020-03-27T08:00:00.000-08:00
layout: post
description: Polar 1.100.12 is now available on the web for all desktop users and will be rolling out over the next week.  
release: 1.100.13
---

Polar 1.100.12 is now available on the web for all desktop users and will be rolling out over the next week.  

<div class="embed-responsive embed-responsive-16by9">
<iframe class="embed-responsive-item"  
        src="https://www.youtube.com/embed/6M6jNlairGc"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen></iframe>
</div>

## Tags for Annotations

The main feature of this release is tags for annotations.  

This has been frequently requested by users and we finally were able to devote 
the time to making sure it was implemented properly.

## Stability

Of course we've also fixed a number of bugs in this release including a bad one
that sometimes prevented the UI from updating when working with annotations.

## What's Next

We're working on moving the entire platform over to React including the PDF 
viewer.  Once this is complete we'll be able to quickly finish implementing 
EPUB, dark mode, and some improvements to our chrome extension to enable 
annotation and capture directly in the browser for web content.

This will also meant that tablet and phone support can come online as 2.0 is 
being designed with mobile support in mind.

## Full Changelog

- annotations in the annotation view are now sorted by 'last updated' not the
  creation time.  
- annotations can have tags
