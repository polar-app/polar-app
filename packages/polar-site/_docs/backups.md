---
title: Backups
layout: doc
permalink: /docs/backups.html
description: How to backup your data in Polar.
---

# Backups

We work very hard to make Polar as reliable as possible so your data is safe.  However, since this data is very
important to our users we want to make it as easy as possible to perform a backup so that you can know your data is safe.

## Creating a New Backup.

Backups (for now) require the desktop version of Polar.  

Go to ```Help | About``` and it will show you where your data is stored.

Then perform the following steps:

 - Shut down Polar
 - Make a full copy of your ```.polar``` data directory and store it somewhere safe
 
Ideally copy it to another computer or to the cloud for extra safety.

## Restoring a Backup.

 - Make sure to logout of cloud sync
 - Shut down Polar
 - Rename your ```.polar``` data directory to ```.polar.old```.  This way if there are any issues with restore you 
   still have your existing data
 - Move your backup directory to the same path as your ```.polar``` directory.
 - Start Polar
 
Your data should now be restored when Polar starts.

## Web Backups (Future)

We're working on a system to generate an archive (tar.gz or zip) of your data so that you can download it directly.  

This way users that only use the web app can export their data easily.

We're still working on this feature and will update the documentation once it's available.
