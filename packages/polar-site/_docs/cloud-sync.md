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

## Future Features

Additionally, cloud sync was specifically designed to support additional
features in the future including mobile, selective replication
online collaboration, and other exciting new capabilities.

Selective replication is something we plan on adding in Q1 2019 and allows
you to keep the majority if your documents in the cloud and selectively fetch
them when necessary.  

This enables users with massive repositories to free up disk space by keeping
most of their data in the cloud.

## Pricing

Right now cloud sync is free for all users.  We plan on making Polar cloud sync
free for 95% users and the remaining 5% have the added benefit of supporting
Polar with their monthly subscription fee.            

We expect cloud sync to cost $7.99 per month for users with the largest document 
repository.
 


