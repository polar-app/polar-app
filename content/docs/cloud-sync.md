---
title: Cloud Sync
layout: doc
date: 2019-01-14 09:00:00 -0800
permalink: /docs/cloud-sync.html
description: Polar supports synchronizing the storage of your documents and annotations with the cloud 
---

# Cloud Sync

Polar supports synchronizing the storage of your documents and annotations
(known as our datastore) with the cloud and synchronizing data across computers.

Cloud sync is near real-time and actively pushes updates to your other devices
so that when you change computers your documents are already up to date - no 
waiting (assuming your computer is active at the time). 

## Backed by Firebase

Polar cloud sync is backed by Google's Firebase.  You can read about the design
in this <a href="https://getpolarized.io/2019/01/03/building-cloud-sync-on-google-firebase.html">blog 
post in the cloud sync infrastructure.</a>

## Security and Permissions

All documents in Polar are only available to your account and we use Google
Firebase access control credentials to block unauthorized users (anyone other
than you).

## Storage and pricing

Every new user gets 1 GB of cloud storage for free. Higher tiers provide you with up to 500 GB storage. See details <a href="https://getpolarized.io/#pricing">here</a> 


