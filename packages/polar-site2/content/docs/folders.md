---
title: Folders
layout: doc
date: 2019-07-15 09:00:00 -0800
permalink: /docs/folders.html
description: Polar supports folders for managing your files in a hierarchy. 
---

# Folders and Tags

Polar supports two strategies for structuring your documents and annotations.

Folders allow for hierarchical storage.

Tags allow for non-hierarchical (networked) storage.

Both systems have their own advantages and it's up to you how you want to structure your workflow.

## Folders

For example a folder could be something like ```/school/biology``` or ```/german/history```.  
You could then have multiple sub-folders under ```/school``` for your studies.

Documents aren't actually stored in folders within Polar. They're just organized that way.

The path separator for Polar is always a forward slash (```/```).  On Windows it's still the 
forward slash. 

## Tags

Tags are always a flat namespace.  This allows you to have a more flexible structure. 

For example you could have a tag for ```textbook``` which you apply any textbook you add
to Polar.  This way you could pick your ```/school/biology``` and then select the ```textbook``` 
tag to show only textbooks.


# Creating Folders and Tags

There are three ways to create folders and tags.

## Sidebar dropdown

The sidebar has a ```+``` button you can use to create a new folder or tag.  Just click this and you will
be presented with a dropdown with options to ```Create Folder``` or ```Create Tag```.

<img class="img-shadow" src="https://i.imgur.com/JTctUNd.png">

## Sidebar context menu

You can right click on the context menu to create a folder.  

When right click on a specific folder, the new folder will be created as a subfolder. 

For example.  If you select ```/school``` as your folder, then right click, and create ```Create Folder```
and you enter ```compsci``` it will create a new folder at ```/school/compsci```.

<img class="img-shadow" src="https://i.imgur.com/8vfmdT5.png">

## Tagging a document

You can create a new tag when tagging a document.  In the document repository, select the tag button, then enter your
new tag in the text area, a new tag will automatically be created and will show up on the sidebar. You can also press t to tag a document

<img class="img-shadow" src="https://i.imgur.com/Zj0EPEv.png">

### Tag Removal / Garbage Collection

**NOTE** These types of tags, created directly on the document, only exist when associated with documents.
If you remove them from the documents, they will not exist when you restart.  You can just create them again
at anytime.

# Moving documents to folders/tags

Once a folder is created, documents can be dragged from the document repository and dropped directly 
on the folder where you want it stored.

## Differences between Filesystem Folders.

Polar folders are different than regular folders on your local hard drive:

- A file can be in one or more folders.

- Moving a file in a folder does NOT change the physical storage location on your local hard drive.

