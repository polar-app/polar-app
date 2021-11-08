---
title: The Future of Polar Cloud Sync  
date: 2019-10-05 08:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/firebase-sync-scaled.jpg
description: We're going to be changing some features in the 'local' mode version of Polar and some new cloud features won't be available in this mode.    
---
<img class="img-fluid" src="https://getpolarized.io/assets/images/firebase-sync-scaled.jpg">

# The Future of Polar Cloud Sync

We're going to be changing some features in the 'local' mode version of Polar and some new cloud features won't be 
available in this mode.

I've tried to keep Polar's local mode as full featured as possible but I've decided that this just isn't possible 
moving forward.

New features like full-text search, machine learning, and other features won't be available in local mode.

I'll explain more below but please read the full post if you're concerned or have any suggestions.

# Background

Polar has three modes of operation.  Local, cloud, and web.  These are internal modes and you've probably never 
really thought of them before.

When you first install Polar on the desktop it's local only. No files are written to the cloud.

When you login to cloud on the desktop, it goes into cloud mode and transparently syncs between local and the cloud
so that your local files are synchronized between all your devices.

The web mode is basically just the cloud mode bug without any local support.  It's what you're using when you login 
to the webapp or use Polar on tablet or desktop devices.  It has the same features as cloud mode.

# Offline

The local, cloud, and web modes don't accurately portray offline functionality.

All three modes will work in offline (and disconnected) mode.

For example, if you're using a tablet, and have Polar installed, and you've downloaded a PDF before, you can still open
it again and continue reading and annotating while it's offline.

What WILL NOT work is search and some of the features articulated below.

## Offline vs Online Features

Most core features of Polar will be designed to work offline.  Firebase itself has support for offline operation which
means our webapp, and mobile and tablet apps will work just fine while offline.

## Cloud-specific Features 

Some features won't be ported to the desktop mode and will only work in cloud or web mode.

|     | local | cloud | web |
|-----|-------|-------|-----| 
| full-text search | no | online | online |
| thumbnails for documents | no [1] | online | online |
| ML features like tags suggested from content | no | online | online |
| search for new documents using Arxiv / Pubmed | online [2] | online | online |

1. Probably not initially but perhaps in the future.
2. This will use a web service and will run your queries online but the PDFs and metadata will only be stored locally.

# Motivation

Features like full-text search and other machine learning (ML) features have been requested by our users for a while now.

I want to add these features but they're very complex and I can't approach them as I would like adding a new UI button 
or something trivial.  Complex performance issues, scale, power utilization, all factor into this decision.

# Reasoning

Mobile and tablet support are going to be a big part of Polar's future.  After talking to our users it's becoming 
very clear that we'd probably have 50% of our users using these devices if they weren't locked down to just desktop
and the web.

This is by far the primary motivator for implementing these features in the cloud.   

I can't use Elasticsearch in mobile devices.  We can't spin up tensor flow on your tablet.  

Even if we could the power requirements would be insane.  

There are dozens of APIs and features we can use with cloud APIs that just aren't available any other way.  Thumbnails,
text to speech, OCR, etc.

## Portability

Any code based on cloud infrastructure will work across all devices.  

Mobile, tablet, desktop. Android, iOS, MacOS, Windows, Linux. 

If we're using Elasticsearch in the cloud it doesn't matter which frontend device you're using.

## Complexity

Supporting all platforms and operating systems for these features would be completely unworkable.

## Performance

Even if we could solve all the above the performance would be abysmal.  Importing a large document set could take 5-15 
minutes when using full-text indexing.

With Elasticsearch I can index your documents across 100 nodes in parallel and have it done 100x faster.  
        
## Feature Set

Frameworks like Elasticsearch and Tensorflow are very powerful. We might be able to get away with using something else 
but for the most part it's not going to be worth it.

Even simple features like language stemming aren't really well documented in other desktop-only search libraries.

## Scale

Moving forward, I can bring in additional teams to easily manage these services on the backend.  This is going to help
grow the team and make sure you're a satisfied user.

# Pricing and Access

Some of these cloud features will cost money.

I have some ideas on how to keep things more affordable (and free) for students and freemium users but generally
speaking, users with larger repositories will have to pay to use these features.

... but believe me, it will be worth it!

## Unlocking Features

Some features of Polar may be unlocked in the future and in that case, if you don't want to use any cloud services, we
will just authenticate you and then allow you to opt out of cloud sync.

# Backups / Snapshots

This will also allow us to support backups and snapshots of your data so that you can restore data directly from the 
cloud.  Google cloud storage is insanely cheap so the plan is to enable a simple export/import mechanism which will 
store your datastore directly on Google Cloud Storage.  

The pricing for this is reasonable so we're planning on taking regular backups for our users.

## Offline First and Data Privacy

We generally support the "offline-first" movement to keep data out of cloud devices but it's a very complicated subject.

Some users don't want any of their data in the cloud. Some are just concerned about which data providers are used.  
Some users don't care at all as long as it's reasonably secure.  

One major issue is data storage location.

We're going to improve our usability here by allowing the user to pick a primary location among the available Google 
datacenters.  

We're going to support the United States and Western Europe.  [Google's Datacenters are located here](https://firebase.google.com/docs/firestore/locations). 

This will help our users concerned about where they have their physical data stored.

We probably won't have this soon but we'd like to have it done in the near term (3-12 months).

We won't be able to provide any non-Google issues as we're using their Firebase platform and don't have plans to move away.

## Additional Features

Cloud mode enables additional features as well including the ability to sync the URL of your document (or annotations)
to Anki so that the context for a flashcard is available with one click.

We're just simply not able to implement features like this without some type of cloud backend.

## Default Mode

In the future we will encourage users to use the cloud mode by default so that all features are enabled including sync. 

# Conclusion

In summary, Polar will continue to support local mode into the near future with limited features compared to full cloud
and web mode. 

We're also going to encourage users to use cloud mode by default moving forward and will also allow you to pick your 
own datacenter and by default pick one closer to you.

With the new cloud support we also intend on supporting advanced features like full-text search, machine learning, and 
backups.
