---
title: Polar Usability Milestone  
date: 2019-03-06 09:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/usability-scaled.jpg
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/usability-scaled.jpg">

# Polar Usability Milestone

Last week we were lucky enough to get on the [front page of Hacker News again](https://news.ycombinator.com/item?id=19294799)
which resulted in a lot of new users providing valuable feedback.

I'm going to be focusing on usability in the next few releases (as well as 
shipping Polar as a webapp) and I wanted to include the features (and bug fixes)
we're prioritizing in the next couple weeks. 

I'll try to update this post as some of these new features come onnline.

## New Features

### First priority (easy)

- ~~ Restore of pagemarks when opening up new documents when resuming and I have to improve performance here.~~ 

- Tour of the pagemarks as this is important and one of our main selling points.

- ~~Ability to edit flashcards inline without having to delete and recreate them.~~

- Support for area highlights on the sidebar now and storing them in the 
  datastore as binary screenshots.

- Annotation bar changes for highlighting text: https://github.com/burtonator/polar-bookshelf/issues/651

- Toggle pagemarks visually on/off.  For now / key binding and context menu
  options but we need to create a menu bar for some of this functionality.

- Button to toggle/the annotation sidebar

- Button to toggle the pagemarks

- ~~Automatic resume of position from last time document was opened: https://github.com/burtonator/polar-bookshelf/issues/673~~

- ~~Missing padding in the comment box confusing to users:  https://github.com/burtonator/polar-bookshelf/issues/662~~

### Secondary priority


- Make inviting users to Polar a top level feature so we can hopefully encourage people to invite their colleagues.

- Include document information in exported annotations 

- Add content button should have 'import from directory' not just importing from
files.  The work for this is 95% completed so I just need to incorporate it into
the UI. Right now the files need to be selected in the dialog but expanded in
the Electron renderer process so that we can show the recursion status to the
user and potentially allow them to abort.

- (done) Enable feature to create tables within notes    

- New menu / dropdown system on the top right for key buttons.  

    - Tasks
        - Invite Colleagues
        - Anki
            - Sync          - key binding for this... 
            - Full Sync
          System
            - Repair Repository
            - Check for Update   

- Highlight 'mode' to create highlights automatically when the text is selected.  
  The model should be popup by default and 'by selection when the user picks 
  the dropdown 

- ~~Search + filtering of of the annotations view with a filter bar like we have in the documents view.~~

- Display comments on annotations in the annotation view like they are in the sidebar.
      
- Delete annotations from annotation view: https://github.com/burtonator/polar-bookshelf/issues/645

- Slow loading PDF: https://github.com/burtonator/polar-bookshelf/issues/661 

- Faster anki sync:
    https://github.com/burtonator/polar-bookshelf/issues/676

## Changes to the Tour

The tour has proven very valuable with ~~75%~~ 50% of people using Polar completing the 
tour on first install.  

I want to improve on this by expanding on the tour to highlight more key Polar
features.

- Explain that comments can be rich text and have images

- New sub-tour explaining how to work with Pagemarks or at LEAST a brief 
  explanation of them via text.

- New sub-tour explaining content capture or at least a auto-triggered tour 
  the first time the user tries to capture a document.

- New ability to show key "highlights" on the right like that fact that
  Polar does not waste disk space due to keeping the file in another place 

- Prompt to allow the user to automatically import files from local folders
including Documents, Downloads so that we get them a large number of files in
the repository automatically.  I also want to be able to automatically import 
from Zotero too if the user has that installed.
  
- Improved tour for creating annotations explaining how to use text + area 
highlights and how to attach comments and flashcards.   
