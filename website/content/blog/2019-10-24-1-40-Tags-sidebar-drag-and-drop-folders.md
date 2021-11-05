---
title: Polar 1.40 - Tags in the sidebar, Drag and Drop Folders, and more!
date: 2019-10-24 08:00:00 -0800
layout: post
large_image: https://i.imgur.com/HEKJEE2.png
description: Polar 1.40 - Tags in the sidebar, Drag and Drop Folders, and more!
---

<img class="img-fluid border border-dark rounded" src="https://i.imgur.com/HEKJEE2.png">

# Polar 1.40 - Tags in the sidebar, Drag and Drop Folders, and more!

Polar 1.40 is now available.  This release includes a number of new features upgrades and stability improvements.

First, I should apologize for the slower release cycle lately.  I've been working on a number of internal refactors
to Polar to help us scale moving forward.  Among these was a pretty large refactor into a 'monorepo' using submodules
to make Polar much easier to manage moving forward.  

This will enable a number of new features which below.  It's already improved our speed of development now that we've
mostly finished the migration. 

# What's In This Release

Now let's get into what we've changed in this release.

## Tags on the Sidebar

We now have tags (not just folders) on the sidebar.  You can see the tags and the number of documents with the given
tag.

This also works for the annotation view too and you can see the tag counts there as well.

Clicking on the tag will load the tag in the right pane.

## Drag and Drop of Folders 

You can now drag and drop documents on to folders or tag.  Dragging the document will add the the folder or tag to the 
dropped document.

This won't yet work for annotations as we have to upgrade our viewer for this to happen but it's on the roadmap. 

## Fixed Bad Firebase Authentication Bug

We fixed an issue with the desktop version of Polar (running on Electron) where it would intermittently fail to 
authenticate to Firebase when trying to sync to cloud.

This was really tough to track down and I apologize to anyone bitten by this bug. It would only impact some users and
only some small percentage of the time.   

## Library Upgrades

We've upgraded to the latest versions of firebase, pdfjs, jszip.

# What's Next  

In the short/medium term we're working on improving these issues.

## Improved Folders

Many users have been confused with how folders work and in retrospect I can see why.  We shipped with a basic interface
which was somewhat non-standard so it wasn't really possible to figure out how it worked.

We're going to add some UI changes to make this more accessible including a '+' (create folder) button and the ability
to create folders, and then drag files into them.

## Stable Groups Release

We're working on improving groups which are only about 80% complete.  I'm hoping that the drag and drop interface will
make them easier to use. 

I'm struggling with some UI issues here so my plan is to bring in a designer to help me understand the challenges I
have with making it easy to use. 

## New Version of Capture

We're working on a redesign of the way web capture works.

Web capture is the ability for Polar to take a web document in HTML and store it within Polar.

Too many users are reporting that capture fails a significant percentage of the time.

Further, capture doesn't currently support adblock, readability, or other chrome/firefox extensions.

The new design will allow it to work directly within the extension within the browser.

The intention is to target the web extension API which will mean it will work on Chrome, Firefox, Edge, and Safari.

I can't commit to supporting all four major browsers out of the door but that's the goal.  We have about 90% of our
users on Chrome but Firefox and Safari are definitely important.

## DOI Lookup and Extended Metadata

We're working on supporting more 3rd party metadata lookup APIs.  Initially we will support just lookup of public
documents via DOI using [unpaywall](https://unpaywall.org/).

This will allow you to enter a DOI, fetch the document into your repository, and store the extended metadata.

We'll also support resolving the metadata if the PDF has a DOI in stored in its metadata.

This will also serve as the basis for enhanced citation management.

The long term plans are to support the Pubmed API and the Fatcat API provided by the Internet Archive.    

## Thumbnails

We're planning on adding thumbnail previews for documents added to Polar.  This has been on the agenda for a while now
but is only just now possible due to some complexities regarding thumbnails and snapshots across operating systems.

I think initially this might only work when cloud-sync is enabled but I'd like to get it to work on the desktop version
of Polar at some point.

## Electron 7.0

We're going to migrate to Electron 7.0 now that it's out. The major feature here is the updated Chrome backend but there
are some other nice stability improvements here. 
 
## Freemium vs Premium

We're working on some other features in the background to the premium version of Polar including full-text search.  Some
of the citation management features will also be premium features like they are in other citation management tools.

I'm also working on working other ways to get access to Polar premium for students and others in developing nations 
that might not be able to afford these tools. 

I'll be talking about these in the next few weeks.  Unfortunately, many of these features just flat out cost money 
including features like cross-device full-text search, OCR, text to speech, and other premium features I'm considering.

# Upgrading

Want to make sure you're on the right version of Polar?

## Web 

If you're using the web version of Polar you're probably running the latest version.  

## Desktop 

If you're using a desktop app this release will be pushed to all users over the next week. If you'd like to see if
you're already on the latest version just go to ```Help | About```.

If you'd like to upgrade earlier you can go to ```Help | Check for Updates```.



