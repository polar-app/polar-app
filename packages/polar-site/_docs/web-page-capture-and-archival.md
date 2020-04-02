---
title: Web Page Capture and Archival of HTML Content
layout: doc
date: 2018-12-16 07:22:47 -0800
permalink: /docs/web-page-capture-and-archival-of-html-content.html
large_image: https://getpolarized.io/assets/screenshots/capture-preview-narrow.png
description: Polar supports long term web page archival via a process called "capture" which downloads and caches the content locally.  
---

# Web Page Capture

Polar supports long term web page archival via a process called "capture" which
downloads and caches the content locally.  We store it in Polar as if it were
any other type of document (like PDF).

This allows you to manage web pages with tags and annotations including text and
area highlights, comments, and flashcards.

This essentially allows Polar to work like your own personal Internet archive
for documents critical to your education and maintain the knowledge 
contained within using annotations and comments and use incremental reading to 
read large collections of web pages in parallel.  

One issue with annotating documents on the web is that the author might change
the document (or even delete it) thereby invalidating your annotations.

Polar prevents that by capturing the content on disk (and in the cloud) for your
own long term usage.

During this process we fetch the full HTML, including iframes, and store them in
a portable PHZ file that can be used for long term archival of web content.

Additionally, we capture the document in a way to make them more usable and more 
readable.

<!-- <img class="img-fluid img-shadow" src="./assets/screenshots/captured-content-window.png"> -->
<p class="text-center"><img class="img-fluid img-shadow" src="/assets/screenshots/capture-preview-narrow.png"></p>

# Readability

Polar supports capturing the document in a more readable form by emulating 
tablet and mobile devices during capture.

Websites usually try to cooperate with tablets and mobile devices by making
them more readable on smaller screens.

With Polar we emulate these devices during capture to preserve web pages in a
more readable form - often with sidebar and navigational content removed.

<p class="text-center"><img class="img-fluid img-shadow" src="/assets/screenshots/readability-example-bad-narrow.png"></p>

<p class="text-center"><b>Document Captured with Sidebar</b></p>

<p class="text-center"><img class="img-fluid img-shadow" src="/assets/screenshots/readability-example-good-narrow.png"></p>

<p class="text-center"><b>Captured as Tablet with Sidebar Removed</b></p>

# Link Rot

Capture prevents the problem of "link rot" where URLs vanish from the web over
time due to a natural form of attribution.  Either the domain expires or the 
content is deleted or the location changed.

The <a
href="https://blog.archive.org/2018/10/01/more-than-9-million-broken-links-on-wikipedia-are-now-rescued/">Internet
Archive</a> has found that more than 9M URLs on Wikipedia return 404 error
pages.

With Polar you never have to worry about this being an issue as you have a 
permanent long term copy of important content.

# Usage

To capture a new page just select ```File | Capture Web Page``` then enter a URL.

A preview window will show what the page will look like in Polar.

After that you have to click the 'capture' button to the top right and a new
document will be saved within Polar.

# Document Repository

After the web page is captured and saved locally it's saved to the document 
repository where you can reference it at any time in the future.

The document repository supports features like tagging, tracking reading progress,
custom sorting (by updated time, added time), etc. 

<p class="text-center"><img class="img-fluid img-shadow" src="/assets/screenshots/document-repository-narrow.png"></p>

# Chrome Extension

The <a href="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd">Polar Chrome Extension</a> 
allows you to send directly from Chrome into Polar.  You can copy the URL and paste it
into Polar directly but it's more convenient to have a one click button in integrated
into your browser. 

# Design

## Light, Thin, Fat, Full Archives.

We define the following archive types:

- light: URL only (not supported yet)
- thin: HTML only with iframes.  No CSS, images, audio, or video (supported in Polar 1.x)
- fat: HTML + CSS + images. No audio or video.  (under development)
- full: HTML + CSS plus all resources including images, audio, and video (not supported yet).

## Why not use a standard format.

I would have loved to. I didn't want to build a document format and spend months 
doing so.

We're lucky captured pages work AT ALL.

## What are the challenges of creating a portable HTML archive that mandates something custom.

 - CORS access policies prevent the content being access programmatically for
   things like screenshots.
   
 - CORS prevents loading resources from our origin and the target origin

## Why not MHTML

- Firefox doesn't support MHTML

- MHTML doesn't support images

- We can't extend it, fix bugs in it, etc.

## Why not WARC

- Chrome can't replace an HTTP response while it's served.  Only send a redirect.
  This means that you end up building a loader ANYWAY which is 90% of the 
  requirements for Polar.

- WARC doesn't support compression settings for individual entries.  We only STORE
  images/video for performance and storage gains.
  
- With WARC the full HTTP request would need to be replayed.  With our content 
  capture we're able to use in-browser assets and cache to rebuild the page.
  
- We also cleanup and strip javavascript.

- WARC would only represent the storage, not the extraction.  It might be 
  possible to WRITE WARC or have export to WARC though.
     
 
