---
title: Frequently Asked Questions (FAQ)
layout: doc
date: 2019-01-30 07:22:47 -0800
permalink: /docs/frequently-asked-questions.html
description: Polar Frequently Asked Questions (FAQ) 
---

# How do I support Polar?

The best way to support Polar is to just [buy Polar premium](https://getpolarized.io/#pricing) (bronze, silver, or gold).

We also have an [Open Collective](https://opencollective.com/polar-bookshelf) setup to allow donations.

# How do I import my existing data?

If you have a large number of PDF files that you would like to import you can 
select ```File | Import``` and select multiple files and they will all be 
imported into your repository.  

This process is fairly quick taking about 1 minute per 100-200MB.   

# Where is my data kept?

Your data is kept in a ```.polar``` directory in your home dir.  

This changes between platforms depending if you're on Windows, MacOS or Linux.

You can find out the exact directory by going to ```Help | About```.

# How do I backup / restore my data?

If you're using the desktop version of Polar you can perform the following 
operations to backup/restore your data.

- Go to ```Help | About``` to find the Polar data directory.
- Stop Polar
- Backup this directory (copy it to another folder)

## How do I restore?

If you have a backup and want to restore?

- Stop Polar
- Delete the Polar data directory
- Copy the data you want to restore to the same path as the Polar data directory
- Start Polar

Your data should be restored.

# Why is Polar using so much disk space?

The Polar disk repository is actually amazingly efficient in terms of disk 
usage however the operating system sometimes misreports the total usage.

The main culprit is our .backup directories which are used when performing 
cloud syncs.  We generally keep one per day for every initial sync (though we
might keep more in the future).

These contain a full backup/snapshot of your disk repository at the time 
it was created (once per day).

However, these use what are called 'hard links' where we 'link' the same files
together and they appear in two places on the filesystem but they're actually
the same file.

If you have 10 hard links to 1 file, and you count the bytes used, some tools
report 10x the actual space.

However, we're actually using very little more than the original file size sync
the data is actually the same.

They're basically just alternative for the same underlying file.        

# Why can't I open files directly?  

Polar has somewhat strict data requirements for the files it's managing.  The 
goal of Polar is to keep your data for as long as it's valuable to you so we 
need to make sure it's always consistent.

By using a dedicated data directory we can avoid accidental deletions, 
and mutations of files.

Additionally, since all your data is now in one place, we can support features
like cloud sync, filesystem consistency checks, sharing, etc. 

Some of these features aren't implemented yet but are on the roadmap.

# How do I sync to Anki?

Please see [Anki Sync for Spaced Repetition](https://getpolarized.io/docs/anki-sync-for-spaced-repetition.html)

# Can I export data from Polar?

Yes.  The PDF and PHZ (web capture) files are in your ```stash``` directory in 
your local datastore.  You can just copy them out if you wish to export.

The annotations are another issue.  

We have exporters for annotations which can be run per document and are located
in the annotation sidebar.

# What characters are supported in tags?

Polar documents can be tagged for classification and management.  This allows you
to filter the document repository for specific tags.

Right now we use the ```twitter-text``` library to determine if a tag is valid.

This is somewhat constrained as characters like '#' and '-' are not supported.

International characters and any character that can be supported as part of 
Twitter hashtags are supported within Polar.

We DID extend the framework to support ':' so that we could have typed tags.

The idea was to be compatible with external systems so that data exported from
Polar was compatible.

We might revisit supporting extended tags in the future with additional characters
but just issue warnings that these tags aren't supported on all platforms.

# Do you have any plans to support ePub format?

Yes.  But not in the short term.  Check out our notes on [EPUB](EPUB_SUPPORT.md).

# How do I build and run from source?

Polar is VERY easy to compile from source.  Polar is based on Typescript, Electron, 
and other important dependencies so these must be fetched first.  

## Install NodeJS + npm

First, install the lasted version of NodeJS and npm for your platform.  At the
time of this writing we're using the 10.x series to build Polar.

## Build from Source

First, fetch the latest version of Polar from git then run:

```bash
npm install
```

Make sure to run this periodically when pulling a fresh version from git as 
dependencies may have changed.

Then run:

```bash
npm compile && npm start
```

At this point you should have a version of Polar running on your machine.

```npm install``` only needs to be run occasionally.  Usually when you pull 
from git and the ```package.json``` file changes with new dependencies.  

# How do I enable advanced logging?

There are two ways to enable advanced logging:

## Update environment (temporary)

Set the ```POLAR_LOG_LEVEL``` environment variable.

Linux/Mac run ```export POLAR_LOG_LEVEL=DEBUG```

NOTE: Make sure it's exported. If you just set it child processes can't see the value.

Windows run ```set POLAR_LOG_LEVEL=DEBUG``` 

then run Polar either via ```npm start``` for source builds or run the binary
directly.

## Update your config (permanent)

NOTE: This is no longer the recommended way to change your log level. We 
recommend setting POLAR_LOG_LEVEL.  When permanently setting the log level to
DEBUG there can be sever performance degredations - especially when moving 
pagemarks which can lock up Polar and make it feel that the app has crashed when
in reality it's just being amazingly slow logging thousands of messages.

Create a file in your ```.polar/config``` directory named ```logging.json``` 
with the following content:

```json
{
  "level": "DEBUG",
  "target": "CONSOLE"
} 
```

By default we use logging level WARN to improve performance and also so it does
not log pointless messages to the console which would just be confusing to an
end user.

The available log levels are:

```text
DEBUG
VERBOSE
INFO
WARN
ERROR
```

We currently only support a log target of ```CONSOLE``` due to performance reasons.

There IS an on-disk version enabled but it usually ends up locking up Electron
essentially defeating the point.  

We plan on implementing a logger implemented on Websockets in the future.

# Commons Errors

## Quiting.  App is single instance.

This happens because another version of Polar is running in the background.

Either quit this version or run:

```bash
killall electron
killall polar-bookshelf
``` 

... on MacOS and Windows you probably want to kill either the ```Electron``` or 
```Polar Bookshelf``` processes if they're running in the background.

# Aren't Electron Apps Bloated?

## RAM

A default install of Polar uses about 350MB of RAM after a fresh start.

As of 2018 this is about $5 worth of RAM.

Electron and web apps provide for an amazingly powerful development platform.

Without PDF.js, React, Node, and other frameworks, it would be prohibitively 
expensive to re-implement Polar (and not very fun either).

Now add the cost of porting to Windows, Linux, MacOS, Android and iOS.  

You're asking to spend hundreds of thousands of dollars hiring a developer to 
save $5 on RAM.

It's just not a very practical solution.

I'd like to get memory consumption down. It's possible that there are some 
features we can remove but right now it's not a priority.

Just spend the extra $5...
 
## Disk 

The binary download is only 100MB. Fairly reasonable for modern apps.
