---
title: Web Page Capture with Chrome extension
layout: doc
permalink: /docs/web-page-capture-with-Chrome-extension.html
large_image: https://getpolarized.io/assets/screenshots/capture-preview-narrow.png
description: Use the Polar Chrome extension to capture web pages for into your repository and for later reading.
---

# Web Page Capture using the Chrome extension

With Polar's <a href="https://chrome.google.com/webstore/detail/save-to-polar/jkfdkjomocoaljglgddnmhcbolldcafd?hl=en" target="_blank">Chrome extension</a> you can add web content into your repository in one simple click.

This allows you to treat webpages like any other document and use tags, metadata, and all the other good stuff like area highlights and AI flashcards.

The main benefit is that it allows you to build your personal knowledge base not only from PDFs and EPUBs, but also web content (and let's be real, lots of what we learn these days is in blogs...).

# Mechanism and readability

When you capture a web page with the Chrome extension, a snapshot is saved in your repository. Please note, this means that if the website is updated or deleted in the future, those changes will not be reflected in your captured version.

During the capture process, we fetch the full HTML including iframes, and store them in
a portable PHZ file that can be used for long term archival of web content.

Additionally, we capture the document in a way to make them more usable and more 
readable. This is achieved using Mozilla's Readability.

Each capture process consists of two steps. In the first step, it converts the webpage into an easy-to-read format using Readability. Clicking the button on the top right of that page then saves the webpage into your repository.

# Tips on how to get the most out of it

Capture only parts of a page by highlighting the text you want to capture. If you select a specific text and use the Chrome extension, only the selected text will be captured into your repository instead of the entire webpage

You can easily open the original URL of any captured webapge through Polar. Any potential changes on the website will not be reflected in the previously captured webpage.
