---
title: Apple Lying About "User Agent" in iPad Pro - Blocking PWAs
date: 2019-12-21T08:00:00.000-08:00
layout: post
description: Apple Lying About "User Agent" in iPad Pro - Blocking PWAs and pretending they're MacOS
large_image: https://i.imgur.com/c5vfb1e.png
---

<div class="text-center"> 
<img class="img-fluid" src="https://i.imgur.com/c5vfb1e.png">
</div>

# Apple Lying About "User Agent" in iPad Pro - Blocking PWAs

Apple is lying about the user agent in the latest iPad Pro.

They're misrepresenting both the OS and the chipset.  They should be saying that they're iPadOS on the A12X chipset.

Instead they're saying that it's running MacOS on Intel.

I honestly can't believe this isn't being covered elsewhere as it seems to me to be a pretty shocking and incredible
error on their part.

This basically means it's impossible for 3rd party developer to determine that they're actually working on an iPad Pro.

If you're developing a progressive webapp you're unable to reliably determine that you're working on an iPad Pro.

This essentially breaks webapp development targeting the iPad Pro.

# User agent

The user agent is usually used to detect the version of the browser, operating system.

In the case of the iPad Pro they're sending:

> Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.1 Safari/605.1.15

Now what they've done is added a feature for 'Request desktop version of site by default' and they're using this UA 
to trigger the desktop site.

This might be true, and maybe we need better standards for implementing this feature, however, lying about the UA isn't
the right strategy.

They can handle this in the UA by saying "like Mac OS X" and still trigger UA scripts that use the older version.

Even if this technique didn't work, Apple has a responsibility be a good citizen on the web and use web standards 
properly and in the way they were intended. 

# Great Device for Reading

The reason I'm so excited about the iPad Pro is that it's a great device for reading. I'm working on porting Polar to
running on it natively with a progressive webapp (PWA).

Our PWA looks and behaves almost perfectly like a native mobile app.  

It allows you to review your reading annotations and review your flashcards and notes while mobile.

It's also the perfect weight for reading while mobile and feels like an actual book.  Perfect for Polar users who want 
to read while traveling.

Our desktop app would NOT run reliably on an iPad Pro and we're specifically trying to target features for this device
including a layout that properly utilizes the screen resolution and hand gestures.

For example, here's our webapp running on a resolution targeted for iPad OS:

<div class="text-center mb-2"> 
<img class="img-fluid border border-secondary" src="https://i.imgur.com/ZVYUYCO.png">
</div>

... and here it is targeted for desktop users:

<div class="text-center"> 
<img class="img-fluid border border-secondary" src="https://i.imgur.com/nzwhXZG.png">
</div>

# Blocking PWAs

PWAs behave like native apps in that they can be cached locally, installed like regular apps, etc.

However, [Apple seems hostile to PWAs](https://onezero.medium.com/apple-is-trying-to-kill-web-technology-a274237c174d) and seems to be actively penalizing the technology in favor of their own App Store
since their revenues there are much higher.

> Apple also handicapped an emerging standard called Progressive Web Apps (PWAs) — which, like Electron, allows
developers to build native-like apps for both desktop and mobile — by partially implementing it in a way that makes it
too inconsistent to rely on. PWA doesn’t have the same problem if users open apps in Chrome or Firefox, but iPhone and
iPad users can’t install third-party browsers, which makes PWA-based technology a non-starter.

In light of this larger conversation, I can't help but think that Apple is doing this on purpose.

I sincerely hope I'm wrong.

A PWA won't be able to determine if it's running on iPad OS and enable the appropriate feature set.  There are some 
hacks that can be done like looking at window.screen.width but this will yield false positives in some situations.  

At the very minimum, Apple should augment the 'navigator' object with some proprietary extension so that I can at least
add custom code to detect that I'm on an iPad.
