---
title:  Building Cloud Document Sync with Google Firebase
date:   2019-01-03 09:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/firebase-sync-scaled.jpg
description: About a month ago we shipped a new version of Polar which enables support for cloud sync backed by Firebase. 
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/firebase-sync-scaled.jpg">

# Building Cloud Document Sync with Google Firebase

About a month ago we shipped <a
href="https://getpolarized.io/2018/12/16/polar-1.5-with-cloud-sync.html">a new
version of Polar</a> which enables support for cloud sync backed by Firebase.

Polar is a personal knowledge repository for your books, PDFs, and web content
which supports annotation including highlights and comments.  Having this data
available across all your computers is insanely helpful.

Our users wanted the ability to sync their reading and annotations across 
computers with the option for mobile in the future.

We wanted something future proof with the ability to sync and update in
realtime.

We evaluated a number of options including GraphQL, DynamoDB, Elasticsearch, 
and AppSync but kept coming back to Firebase.

Firebase just seems to hit the sweet spot in terms of rapid implementation
and feature set.

For our requirements we also wanted:

 - Support for BLOB storage
 - Flexible permission system
 - Easy (and rapid) implementation
 - SDKs that were Open Source which would enable distribution with Polar (which
   is also Open Source).
 - Simple data model using JSON (Polar's data model is JSON based)
 - Easy authentication and authorization system
 - Ability to share objects with other users (not just the primary account).
 - Support for mobile (iOS and Android)

After evaluating the above platforms we decided to do a quick proof of concept
on Firebase to see how difficult it would be to work with.

Firebase seemed like an almost perfect fit for our model. AppSync and GraphQL 
seem great if you're planning on using DynamoDB or have a complex (and legacy) 
backend with connectivity to a lot of different datasources.

<img class="img-fluid" src="https://getpolarized.io/assets/images/mvp-scaled.jpg">

Firebase is almost brilliantly designed for knocking out a MVP (minimum viable
product).  They seem to focus on the key features needed to get an app off the
ground quickly but also allow you to iterate over time.

I imagine this is part of the distribution strategy.  Make it easy and quick to
prototype your app their platform, pay by usage, and if your app is successful
you can worry about scaling it later.

Once you're on Firebase though your scalability is actually fairly decent and
since you're paying by user you're never really going to get financially 
destroyed as long as your revenue scales with your user base (which is good for
both you and Google).  

That said, Google Cloud (and Firebase) is definitely missing a lot of features
when compared to AWS.

It doesn't really have full-text search.  You can sort of bolt it on but it would
be nice if this was a native feature in Firebase.  

## Authentication

<img class="img-fluid" src="/assets/images/firebase-auth-scaled.jpg">

Clearly the first hurdle would be authentication.  We actually used
this as smoke test to see which platforms were easiest to implement.

If authentication was insanely hard to implement it's probable that the rest of
the platform would be just as difficult.  It's the starting point anyway so why
not try to see if you can get a simple app up and running and writing data.

With Firebase we were up and running in a few hours (once I figured out some
insanity with Electron).

If you're building a traditional webapp you can probably get up and running
in Firebase in about 30-60 minutes assuming you have a basic understanding
of modern web development (Node, Webpack, Typescript, React, etc).
 
Getting OAuth up and running so quickly was motivating.  Technically I had
support for just Google as well as username + password but I could add other
platforms like Github, Twitter, and LinkedIn if I wanted.

I tried to setup Auth0 in the past and it took me about a week.  Not to trash
Auth0 of course.  I imagine their setup is much faster now as I worked on their
platform a long time ago.  It's just that it was very exciting to make quick and
efficient progress with Firebase.
 
## Datastores

Polar is modeled on the concept of a Datastore.  The Datastore interface has
a simple contract which supports binary files attached to a high level document
construct represented as metadata in JSON named DocMeta.

A DocMeta write is always atomic and the ID is constructed from either the 
hash of the URL being stored (in the case of HTML) or the content hash of a 
PDF as SHA256.

We then support binary attachments to the DocMeta.  The first binary attachment
is actually the document itself.  This is written to a 'stash' where we store
the raw binary documents.

Additional binary attachments can be screenshots and thumbnails of the documents.

The screenshots are usually annotations like area highlights but we also have
plans to support thumbnails.

The binary file support initially supports images and raw binaries (PDFs and 
HTML archives) but we also support video and audio.  We'd like to add support
for this in the future so that people could annotate documents by recording 
video/audio from their devices directly.

This binary/meta model maps perfectly to Firebase.  

We write the DocMeta directly into Cloud Firestore which is their JSON datastore
similar to Cassandra or DynamoDB (but with some unique constraints).  

It maps pretty well to a JSON datastore.  It's not very feature rich compared 
to other systems but not bad either.

For example, there's no full-text search - which is definitely a pain if you're 
used to working with Elasticsearch.

The binary files are written to Google Cloud Storage (GCS). They basically setup a
really nice frontend to GCS with Firebase.

The pricing on Cloud Storage and Firebase is really attractive when used properly.

Our BLOBS are immutable and designed for long term storage.  They're often large.

At LEAST 300k for HTML cached content (Polar support offline storage of HTML) and
the average PDF is about 5MB.

The DocMeta is super small and updated frequently.  The DocMeta is usually less
than 10k. 

## FirebaseDatastore

We started with a FirebaseDatastore which implemented the same semantics
as our current DiskDatastore.

That part was actually pretty easy.  The FirebaseDatastore just wrote DocMeta 
as JSON and then the BLOBS to CloudStorage.

That took just a few days of work to have fully polished.

The great thing about this is that it works natively in the cloud.  Nothing is
on disk.  The data just is loaded and cached temporarily.

However, Polar needs to work offline and many of our users want to keep
their data on disk.  We needed a better solution.

## CloudAwareDatastore

Polar needs to support something that's offline-first and we already had on
disk support so we needed a Datastore to bridge the two.  Our DiskDatastore
is what users used by default and we didn't want to force all our users to use
cloud.  

We implemented CloudAwareDatastore which used events synchronized between the 
two systems (DiskDatastore and FirebaseDatastore) to build a coherent platform
between the two.

Firebase has a really amazing event system which allows you to monitor the 
system as it's reading and writing to the backend.

We were able to then use these events to merge a stream which enables 
realtime sync across all your devices.

It's really fascinating to watch annotations and documents update on my Mac
laptop while I'm working on my Ubuntu desktop.

This took the most time because of the sync semantics required and things 
had to be done properly. I think we had a full implementation of cloud sync 
in 2-3 weeks.

# Offline Support 

One of the nice things about Firebase is that it has native support for offline.

This means you can configure it to load previously cached data from local
browser storage and it will complete a query locally rather than from the
server.

This means that all the normal sync functionality will work even when offline - 
it's just that it's synchronizing with an offline cache.  

This means that the code for offline and online support can function the same in
both situations.

This has the nice benefit that once the machine comes back online synchronization
can continue as normal and the local machine would receive updates immediately.  

# Realtime Snapshots

In Firebase the queries are implemented as 'snapshots'.  If you have caching
enabled you can fetch the first snapshot (which could be resolved from disk) and
then subscribe to additional snapshots which could arrive in the future when 
data is updated remotely.

The snapshots are delivered in realtime.

In my experience the data took about 1 second to arrive.  I think this is usable
for most practical purposes but it would be nice if this was faster.

I'm not sure if the latencies were due to my code being slower to handle the events
or if the data was just slightly lagged within Firebase.

That said, 1 seconds is probably usable in almost all web usage and anything 
but hard realtime usage. 

# Authorization

Authorization within Firebase is another area that really shines.

Here's an example Firebase authorization rule to only allow access to documents 
for the current user:

```bash

// Allow read/write access on all documents to any user signed in to the application
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null && (resource == null || request.auth.uid == resource.data.uid);
    }
  }
}

```

The above authorization code will only allow read and write if the user is 
logged in and the user is the same user who created the document.

It also supports NEW documents (resource == null) by allowing creation.

For a future version of Polar we're going to support document sharing and 
collaboration so we can add fields to the underlying data to permit modifying
the records but only if the users who wrote the document explicitly granted
sharing permissions.   

# Conclusion

If you're trying to bang out an MVP and your use case fits Firebase I think you 
would be able to implement something quickly and get it in front of your users
to see if it resonates with them.

If not at least you would be able to cut your losses.  You might find that 
there's a key feature you nee but hopefully you address this in your initial 
requirements analysis.   

Additionally, if you need quality mobile support with high quality SDKs I think
Firebase would work out well.

There are a ton of secondary APIs already setup for mobile which can be used
with your app out of the box including features like cloud messaging and 
analytics.


