---
title: Git Sync
layout: doc
date: 2019-01-14 09:00:00 -0800
permalink: /docs/git-sync.html
description: Polar supports synchronizing the storage of your documents and annotations with git. 
---

# Git Sync

Polar supports synchronizing the storage of your documents and annotations 
(known as your datastore) with git.  Polar just stores JSON files directly
and the underlying PDFs are immutable.

We still recommend using <a href="/docs/cloud-sync.html">cloud sync</a> for most 
users as it supports a much greater feature set and is vastly easier to use.

However, if you're already familiar with git, it's nice to have a secondary 
backup.  Additionally, git sync allows you to diff and work with the files 
directly. 

The main polar developers keep their .polar directory in git for this purpose.

## Incompatibility

Right now git sync and cloud sync are compatible but they might not be at a 
future point in time. Specifically, the selective sync issue will not be 
compatible with git since files are removed but may be selectively restored. 

Selective sync allows you to selectively replicate files locally that are 
actively being used and keep the rest of your repository in the cloud.

## Usage

Just add your ```.polar``` directory to git via ```git init``` and use the normal
git flow.  

Just make sure that if you do a ```git pull``` that you first stop Polar as you
could corrupt documents as Polar isn't yet smart enough to do a differential 
reload when docs change while Polar is running.    




 
