---
title: What's next for web capture 
date: 2019-10-06 08:00:00 -0800
layout: post
large_image: https://i.imgur.com/lkRjAkq.png
description: Polar has been rapidly adopted by alpha-geeks to combat information overload and looks like we've found another convert -  this time Roger Craig who used it to win $77k on Jeopardy.
hidden: true   
---

# Overview

Since we shipped Polar we've been listening to feedback from our users as to the default behavior and functionality of 
web capture.

Web capture (or just capture) is what we call converting an HTML page to a format that can be persisted and used within
Polar.

This code started off as an advanced proof of concept but it had a few issues in practice that holds it back from 
perfectly solving the problem of offline web pages as documents.

Here's what we're working on in the background.

# EPUB 

EPUB will become the default format.  Internally, EPUB is just HTML and CSS and if we migrate web capture to use EPUB 
then this means we *also* support EPUB as a primary file format in Polar.

It also means less code to debug since everything is EPUB.

We're going to work on a converter to take our PHZ format and convert it to EPUB so that existing documents will 
convert in place.

# Based on Web Extensions

We're going to migrate everything to a web extension. 

This means the native Electron capture will migrate to being completely browser based.

Our goal is to support Chrome, Firefox, and Safari extensions during this process as our Firefox extension is nearly 
finished.

The advantages here are the ability to use regular chrome extensions like uBlock, Ad Block Pro, Mercury Reader, or Easy Reader.

The new extension will completely bundle the pages resources and send them to the Polar cloud or desktop app.

# Fluid Layout.

The new format will not require a fixed document size like the previous version.  This was needed due to the layout
algorithm for placing highlights.  The new version should support placing highlights based on text.

One UI change might be that area highlights for HTML documents will anchor to images or figures.   



- No longer static layout
    - Reflow  
    - Mobile and Desktop
    - 
- Optionally capture on server when triggered from mobile/tablet
- Lightweight capture (URL only)  
