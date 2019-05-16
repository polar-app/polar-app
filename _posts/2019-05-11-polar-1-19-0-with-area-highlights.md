---
title: Polar 1.19 Released With Area Highlights and Updated Annotations View
date: 2019-05-10 09:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/screenshots/1-19-sidebar.jpeg
description: Polar 1.19 Released With Area Highlights and Updated Annotations View
---

# Polar 1.19 Released With Area Highlights and Updated Annotations View

<div class="embed-responsive embed-responsive-16by9">
<iframe class="embed-responsive-item"  
        width="560"
        height="315" 
        src="https://www.youtube.com/embed/TDYDOGGTPls" 
        frameborder="0" 
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<br/>
<br/>

Polar 1.19 has been a lot of work but it's finally out the door.

If you haven't updated Polar in a while make sure you're on the latest version 
by going to Help | About or Help | Check for Updates.

There are a few we want to highlight about this release.

## Area Highlights

Area highlights are now shown in the sidebar and updated and resized while you
drag the area highlight box.

This was frequently requested by our users and allows you to select mathematical
figures and illustrations for annotation.

<img class="img-fluid img-shadow" src="/assets/screenshots/1-19-sidebar.jpeg">
<br/>
<br/>


## Updated Annotations View

We've updated the annotations view to show preview annotations and a better view
of each annotation including showing area highlights.

<img class="img-fluid img-shadow" src="https://getpolarized.io/assets/screenshots/annotations-view.webp">
<br/>
<br/>

## Color Selector

There's now an advanced color selector for highlights and this expands us to 12
different colors.  We're going to expand the palette in the future but this is
already a step in the right directly.

Technically we support any RGB value but we're limiting the colors you can
select for now just to make the UI simpler and easy to use.


<p class="text-center">
<img class="img-fluid img-shadow" src="/assets/screenshots/1-19-colors.png">
</p>
<br/>
<br/>

## Performance Improvements

We've also implemented some more major performance improvements when working
with larger documents and larger sets of annotations.


## Native PDF Handling in Web Extension Disabled

We've had to remove the native PDF handling in our web extension.

This feature automatically previewed and added a PDF to the Polar webapp while
browsing.

We had to disable it due to cross domain security issues we weren't able to fix.
This might be enabled again in a future version of Polar.
