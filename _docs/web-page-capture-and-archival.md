---
title: Web Page Capture and Archival of HTML Content
layout: doc
date: 2018-12-16 07:22:47 -0800
permalink: /docs/web-page-capture-and-archival-of-html-content.html
large_image: https://getpolarized.io/assets/screenshots/capture-preview-narrow.png 
---

# Web Page Capture

Polar supports long term web page archival via a process called "capture" which 
downloads the content locally and stores it in Polar as if it were any other
type of document (like PDF).

This allows you to manage web pages with tags and annotations including text and
area highlights, comments, and flashcards.

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
