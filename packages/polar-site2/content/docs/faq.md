---
title: Frequently Asked Questions (FAQ)
layout: doc
date: 2019-01-30 07:22:47 -0800
permalink: /docs/frequently-asked-questions.html
description: Polar Frequently Asked Questions (FAQ) 
---

# How do I support Polar?

The best way to support Polar is to [buy Polar premium](https://getpolarized.io/pricing).

# How do I import my existing data?

If you have a large number of PDF files that you would like to import you can 
select ```File | Import``` and select multiple files and they will all be 
imported into your repository.  

This process is fairly quick taking about 1 minute per 100-200MB.   

# Where is my data kept?

Your data is encrypted and kept securely in the cloud.

# How do I backup / export my data?

You can download all your reading and annotations as a backup. To download your reading, click on the download button in the repository view. To download your annotations, clickon the download button in the annotation viewer.

# How do I sync to Anki?

Please see [Anki Sync for Spaced Repetition](https://getpolarized.io/docs/anki-sync-for-spaced-repetition.html)

# What characters are supported in tags?

Polar documents can be tagged for classification and management.  This allows you
to filter the document repository for specific tags.

Right now we use the ```twitter-text``` library to determine if a tag is valid.

This is somewhat constrained as characters like '#' and '-' are not supported.

International characters and any character that can be supported as part of 
Twitter hashtags are supported within Polar.

We did extend the framework to support ':' so that we could have typed tags.

The idea is to be compatible with external systems so that data exported from
Polar was compatible.

# Do you have any plans to support epub format?

Yes.  Epub support is available since Polar's 2.0 release.
