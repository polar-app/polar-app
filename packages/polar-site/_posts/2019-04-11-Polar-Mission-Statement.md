---
title: Polar Mission Statement and Design for a Personal Knowledge Repository
date: 2019-04-11 05:00:00 -0800
layout: post
large_image: https://getpolarized.io/assets/images/darts-scaled.png 
description: Polar has a broad mission statement to provide high quality tools for document annotation, management of documents (tagging, storage, etc) and sharing of content.
---

<img class="img-fluid" src="https://getpolarized.io/assets/images/darts-scaled.png">

This document is under construction and still evolving.

# Polar Mission Statement and Design for a Personal Knowledge Repository

Polar has a broad mission statement to provide high quality tools for document
annotation, management of documents (tagging, storage, etc) and sharing of 
content.

There's a great deal of overlap in the technical requirements needed for these
features so Polar provides a great deal of functionality to provide a
comprehensive personal knowledge repository and distributed content management
platform.

## Roadmap

See the roadmap for [Q2/Q3/Q4 2019](https://getpolarized.io/2019/04/10/Roadmap-Q2-Q3-2019.html).

The roadmap living document so please check back over time to see how it evolves
especially as new features are released. 

## Use Cases

Polar focuses on a number of key use cases. 

The core is document management which provides about 70% of the technical
complexity and allows us to re-use this infrastructure for the other use cases.

Each additional use case builds upon but shares the core functionality to avoid
technical complications.

### Document Management

Document management is used by nearly all additional layers within Polar.  This
includes basic functionality like adding documents, supporting multiple formats,
storing metadata (title, author, etc) and handles replication, document
integrity, etc.

Functionally, this includes features like tagging, flagging, archiving, updating
metadata, etc.

### Incremental Reading

Allows the user to keep track of their position using pagemarks, update their
pagemarks as they read documents, find new documents to read, etc.

We also keep track of core stats including number or documents read per day, etc
to encourage the user to hit their reading goals. 

### Annotation

Supports text and area highlighting, comments, flashcards, etc. The user can
attach annotations directly to documents.

Annotations are top level metadata and can be exported, copied, and shared 
between users.

### Document Sharing and Collaboration

Document sharing allows others to view and share documents you're reading, and annotating.

This is a key Polar function as we want to test collaborative sharing to improve
knowledge retention using flashcards, and annotations to allow users who are 
sharing the same documents to actively collaborate towards a better experience.

For example, users could collaboratively build flashcards, add video, etc. 

We could also use this to automatically suggest flashcards for users of 
documents that are being shared with Polar.

This way you could add a text-book and have pre-built flashcards already 
compiled and easily added with one click.  

### Bibliography Management

This is primarily used for the scientific community and involves lookup of
document metadata via DOI, preserving extended metadata including author
information, and supports exporting selected documents as a bibliography.

### Web Archival

Annotating web content is irrelevant if the document can be deleted by the site
thereby invalidating your annotations.

Polar supports storing web content offline supporting annotations against
content that may or may not be deleted (or updated) by the original site.

We plan on extending this use case to both improve archival in general but also 
support more transparent archives that seem like real web pages within your web 
browser.

We also intend on supporting annotations for content which isn't necessarily
cached.  This functionality should allow Polar to be used by more users as it
should be much easier to annotate content when it's just a native web page.

### Spaced Repetition and Flashcard Management

Having all your reading at your fingertips is pointless if it's quickly
forgotten.

Polar currently implements spaced repetition by supporting easy flashcard
creation and attaching these to text/area highlights directly.

The Flashcards can then be sync'd directly to Anki.

We tend to continue supporting Anki for power users for the forseeable future
but also want to support basic spaced repetition within Polar directly.

This will help people who aren't Anki power users get started with SR without 
having to commit to Anki, add the plugin, create an account for sync there, 
install the app on their phone, etc.

## 5D Internet

Polar provides a five dimensional (5D) web platform.  We assert that the current
Internet is three-dimensional (3D) with traditional pages and links forming
nodes, edges and building a graph representation of the web.

We're adding the following dimensions:
   
### Fourth Dimension: Time

Polar supports a content addressable storage scheme where documents are 
represented by their hash, not URL.

This allows us to store web pages in portable web archive formats (bundled as 
one document) which can be stored in perpetuity.

This allows users to lookup content in their personal repository and have 
multiple copies of the document based on time.

When connected this provides for an Internet-scale Internet Archive whereby 
users are individually archiving portions of the Internet. [^internet-scale-archiving]     

### Fifth Dimension: Annotation

Users can annotate documents in Polar including adding text and area highlights,
comments, and flashcards.  

This data is valuable to the individual but also to the web community at large.

TODO: Expand on this in the future.

## Federated Data

The underlying Polar data model is not specific to any type of network or 
storage infrastructure. 

## Beyond standards:

Web standards are only one part of what we're trying to address.  Without 
millions of users using Polar as a integral part of our workflow we will not be
successful.  

To that end we have to have to focus on growth, UI/UX, support, mobile, and 
accessibility.

## Corporate and Non-Profit Setup

There will effectively be two organizations setup to support Polar.

PolarOrg will support Polar as an Open Source project.

PolarCom will sell cloud storage, private team sharing, and additional premium 
features.

It's our goal that the vast majority of users using Polar will use the platform 
for free. 

We're trying to target roughly 95% of users on Polar will not pay and will be 
on a freemium model. 

In order for Polar to be competitive there must be an economic component to 
continue funding development. 

Otherwise, we risk our ideas and technology being stolen by other companies who
wouldn't aggressively support the rights (and goals) of our user base.

## User Rights

Polar wants to aggressively support the rights of our user base.

We're not interested in doing anything evil.  Without your trust we believe 
this will hurt our mission.

This includes but is not limited to:

### Data Portability

You should be able to easily access your data in easy to work with file formats
and export to 3rd party services at any time.  

### You Data is Your Data

Polar will never attempt to take exclusive ownership of your data and will only 
pursue reasonable rights to access your data for your use or the use of our data
partners (cloud service infrastructure) when you give us access.

Polar will require non-exclusive rights to have access to your data when using
cloud services including sync to mobile, web, etc.

We may also engage in data partnerships which will be disclosed and will only 
do so for the benefits of our user base.

Basically, we're not interested in doing anything evil and will only use your 
data for your benefit.   

### Encryption

We will make reasonable attempts at making encrypting your data when reasonable
and at rest.  

We're also investigating private encrypted end-to-end datastores for private 
and sensitive data.

### Desktop-only

We have every intention to continue to support desktop-only and offline-only 
usage where your data is not sync'd to the cloud.

If cloud-only features are built (for example full-text search) we will not 
force uses to use cloud services.

## Federation

Federation allows Polar to tie in different backend storage providers which 
could have different properties, security and privacy features.

Polar supports federation through the concept of Datastores which provides a 
high level interface for reading and writing data, subscribing to events, etc.  

Currently Polar supports three datastores:

### Disk

Provides a local storage for the desktop app and allows user to read and
write data without any major privacy considerations inherent with cloud.

### Firebase

Stores data in Google Firebase to provide cloud functionality including web
and mobile support.

### Cloud

Provides a hybrid between Disk+Firebase for the desktop cloud sync across devices.

### Future Datastores

Polar provides for a Datastore interface which means we can easily implement
new technologies for data storage in the future.

Filecoin is an example of an attractive Datastore which we might implement in 
the future.    
 
## Long-Term Archival

Due to the importance of Polar data we're committed to verifying that documents
stored in Polar are preserved long-term.  

This include selecting reliable file formats and using web standards as much as 
possible.  
                                                         
[^internet-scale-archiving] At some point we might allow users to share documents
but there are privacy concerns we have to address here as web documents served
to users might have PII data embedded within them and we also have to comply
with local laws as well as be respectful of user privacy.  Initially this ]
functionality won't be enabled but it's a sub-project we'd like to pursue in 
the future and might be possible for some fraction of the documents indexed 
when we can identify that they have zero PII.




