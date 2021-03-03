---
title: Device Sync
layout: doc
date: 2019-01-16 09:00:00 -0800
permalink: /docs/device-sync.html
description: Polar supports two main types of data sync to keep your data transferred and  synchronized between your devices 
---

# Device Sync

Polar supports two main types of data sync to keep your data transferred and 
synchronized between your devices - 
<a href="/docs/git-sync.html">git sync</a> and 
<a href="/docs/cloud-sync.html">cloud sync</a>. 

If you're only using your local machine you don't really need to use device sync.

IF you have a laptop, desktop, or work machine, and routinely go back and forth then 
using device sync might be for you.

## 3rd Party Sync

DO NOT use a 3rd party sync framework like Dropbox, SpiderOak, etc.  

Polar is not designed for this use case and it's possible to corrupt your Polar data.

Polar cloud sync is optimized for use with Polar. Dropbox and other 3rd party
sync systems introduce data write race conditions that can lead to corruption.

Additionally, the design for cloud sync supports more features and functionality 
than 3rd parties.  We haven't enabled some of these features yet but will be doing
so in Q1 2019.
