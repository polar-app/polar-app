---
title: Google Killing Chrome Extensions with 1 Week Publishing Delays
date: 2019-04-05 05:00:00 -0800
layout: post
description: Google has recently started performing reviews/code audits on any chrome extension that requests the <all_urls> permissions. The problem is that they take 1 week to audit your code!  This isn't just for code changes but **ANY** change even if you just change a typo in your app description. 
---
# Google Killing Chrome Extensions with 1 Week Publishing Delays

Google has recently started performing reviews/code audits on any chrome
extension that requests the <all_urls> permissions.

I can understand the need to audit the code for safety since this is a 
very specific use case and apps could (and have) abused this permission. 

The problem is that they take 1 week to audit your code!  This isn't just for 
code changes but **ANY** change even if you just change a *typo* in your app 
description.

This is the 3rd change we've made and each time it's taken about a week.

We just added some images to the [Polar Chrome Extension](https://chrome.google.com/webstore/detail/polar-pdf-web-and-documen/jkfdkjomocoaljglgddnmhcbolldcafd) and
this ended up triggering a full 1 week review.

I need to add a video and perform some other changes but this means that I now
need to wait ANOTHER week for that to be accepted. 

## Bypass via ActiveTab

We need this permission because Polar needs to add CORS headers to allow it 
to add PDFs to your document repository while you browse.

This way if you come across a cool research paper you can easily add it to Polar
and start highlighting and taking notes on it.

It makes it super easy to stumble upon a URL and then easily add it to your 
reading list.

Some developers can bypass this via extensive auditing with the ActiveTab
permission but it doesn't apply to Polar.

## Banning Obfuscated Code

I thought this might be related to the [code obfuscation ban](https://www.zdnet.com/article/google-to-no-longer-allow-chrome-extensions-that-use-obfuscated-code/) 
but apparently this is not the case since it also impacts images and text.

## Chilling Effect

Chrome has about 80% of the market so this impacts a LOT of developers.  

It shouldn't take more than a few hours to update my app.  If I'm changing the 
code and it's a 5 line diff it should be published immediately.  

I realize Google doesn't make any money here but developers can always use 
other platforms so it's in their best interest to fix this.

By comparison, it takes Microsoft eight hours to publish a new version of our 
app to their app store.  

I really hope someone at Google see this posts and we see some sort of resolution 
to this issue.
