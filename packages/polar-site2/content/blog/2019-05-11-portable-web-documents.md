---
title: Portable Web Documents - An Alternative to PDF based on HTML5 and Web Standards 
date: 2019-05-11 09:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/portable-web-documents-scaled.png
description: Portable Web Documents - An Alternative to PDF based on HTML5 and Web Standards
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/portable-web-documents-scaled.png">

# Portable Web Documents - An Alternative to PDF based on HTML5 and Web Standards

Portable Web Documents are a technology similar to PDFs (Portable Document
Format) implemented in Polar which support offline caching of full HTML
documents, and with (in the future) improved support for video, charts, and
other compelling features.

Polar uses PWDs and PDFs to manage the users reading and allows the user to keep
all documents in a central repository and allows for suspend/resume of reading,
tagging, and annotation.

<div class="embed-responsive embed-responsive-16by9">
<iframe class="embed-responsive-item" width="560" height="315" src="https://www.youtube.com/embed/ZkEo5YmNukY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<br/>

## Why a New Document Format?

PDFs are great and have gotten us pretty far to date but I think their future 
is limited.

They're perfect for laying out text and charts in a static format plus
preserving the document long term and of course sending them via email or
storing them in the cloud.

But they also have a few major limitations.

They only support static layouts - not fluid/dynamic layouts that change when
you resize the page.

Don't have support for features like video, animated images, interactive charts.

They also have limited form support.

Printing HTML pages as PDFs is also difficult as HTML wasn't designed to be 
paginated and without explicit support for CSS form-feed on certain items 
(large images) the resulting PDF becomes mangled and hard to read. 

## HTML in a Portable Document Format?

What if we could combine the benefits of PDFs with the benefits of HTML content?

HTML is amazing and supports a lot of compelling features that are not possible 
in PDF but they're also limited in a few key areas.

If any of the resources in your document vanishes it's effectively broken.

It would also be nice to have the ability to cache a page offline in perpetuity.  

HTML pages can (for the most part) be censored.  If your ISP or government orders
a website offline you might be out of luck.

## Portable Web Documents to the Rescue

Polar supports a file format called Portable Web Documents (PWDs) (note
internally we still refer to these as PHZs since we're still in development of a 
finalize document format) which supports the best of both worlds.

PWDs are essentially a full HTML document including all dependent resources 
bundled in a zip file archive.

There are some associated file formats like WARC and MHTML that attempt to solve
this problem but only really get you about 30-50% of a complete solution.

WARCs or example can't actually be loaded properly in Chrome due to chrome's 
inability to handle service workers elegantly in chrome extensions or to serve
resources directly via request handlers. 

Request handlers can only redirect you to a new URL.  They can't really replace 
content.   

Due to cross origin issues and other web complexities it's better to take the 
entire document, rewrite the URLs and properly handle dependent resources,
and re-bundle into a new layout which bypasses all these technical challenges.

## Capture and Storage.

Capture is by far the biggest challenge in making PWDs as representing the
original form an intent of the web designer (and the reader) as a document can
sometimes be very challenging.

To create a PWD we first have to capture it and this requires support from the 
browser.

Right now Polar implements capture via Electron.  We allow the user to preview 
the URL then store the data directly into a rewritten PWD image.

However, the web isn't really static anymore.

You can't just take the CSS stylesheets and <img> references and store them.

You also have to look at the *live* DOM.

Many toolkits like React actually modify the DOM directly and manipulate and 
redefine CSS styles.  These have to be written correctly or you will break
page load.

Now you have to deactivate all scripts and event handlers so that when the 
PWD loads it's in a neutralized document. You wouldn't want scripts running due
to potential security issues.

Now you have to think about web fonts, iframes, and potentially extract metadata 
from the page including title, description and possibly microdata so that the 
PWD has the same metadata exposed in its internal metadata manifest.

This is just an abbreviated list of course of some of the challenges.  There are
another 10-20 issues that we have to be careful when creating PWDs.

We still have some challenges now that we're unsure how to handle.

For example, some iframes only load when they're visible so we enabled a cheat 
to expand the preview window to trigger them to load.

However, this caused another ugly bug where some websites like to 'auto-paginate'
so that when you're at the bottom of a page you're given a full related article
in the hope that you stay with the site longer.

These issues are mutually exclusive though.  A solution for one breaks the
solution for the other so we're stuck in a catch 22 until we have a workaround.

## Current Limitations

We do have some limitations currently which I'd like to lift in the future.

Technically we only support static layouts. PWDs could also support fully fluid
layouts as well which would be really exciting.

It would be nice to support caching of video, audio, images, and interactive 
charts.  

This would make PWDs sort of like a 'young lady's illustrated primer' (if you've 
ever read Diamond Age) where a book is now fully interactive.

This would also mean that this interactivity would work offline and be fully 
interactive!  

Right now Polar is limited to capturing within Electron which means we can't 
access the user's cookies and prevents some URLs from loading properly.

We're porting our capture code to our chrome extension to mitigate this and 
this should be fixed shortly.

## The Future

Polar wanted something like PWDs so that we can enable some cool features in the
future.

The first (which we have now actually) is just full offline archival of web
pages to prevent them from being deleted.  If the content is important you don't
want it to vanish.

We also want a way for users to collaborate around web content.  Add
annotations, comments, etc.

We ideally don't want the content to vanish so PWDs allow us to keep it
associated with the users document store.

We'd also like to enable features where users can exchange documents directly 
without relying on the original site.

This allows us to bypass censorship for documents that might be sensitive 
outside of their host country.  

We also want to support video, audio, and interactive charting formats. Video
is a bit difficult as we need to determine how to stream and store the video 
within the compressed archive and stream it efficiently.  

Our plan is to use web workers and service workers to decompress it in a 
background thread.

Interactive charts and spreadsheets are also compelling but I don't want to just
enable raw Javascript support.  It might be possible that something like WASM
could solve this by putting the controls in a sandbox.

We also need a strategy to preserve teh fonts long term.  Right now we don't
store the fonts along with the PWD because they can increase the size by about
2x.  

It might be nice for a system like Polar to have sort of a shared CDN so that
fonts are only stored once but this creates problems with dependencies which 
aren't ideal.

## Working with Portable Web Documents

If you'd like to play with the current version of PWDs download Polar and take
it for a spin.

Right now you can view them in the webapp but can't create them so you need to
download the desktop version of Polar.

We're planning on fixing this issue in the next big refactor to embed the
capture process in our chrome extension.

Once created the captured document is stored within Polar as a normal document 
just like any PDF doc.

You get all the normal Polar features including tagging, annotation, flashcard
creation, cloud sync, etc.

If you have any feedback please jump on our Discord or create a github issue.
