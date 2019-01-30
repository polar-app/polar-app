
# OUT OF DATE

This document is very out of date and we will be resiving it with a new 
system shortly.

# Overview

Polar is a very ambitious project but since it's based on Electron and uses a
lot of technology from other projects we're moving forward very rapidly.

Anything on the 'short term' feature list below will probably be implemented 
in 1-3 weeks.

Medium term projects aren't very complicated to implement but just require more 
time to complete.  They might also require fixes from a future version of 
Electron or another API on which we're blocked. 

# Short Term

- Annotation sidebar that shows the annotations you've created in the document 
  and allows you to scroll through them and clicking on them should bring that 
  item into the scroll.

- Chrome extension to take the rendered page and load it into polar, possibly
  with the option to re-generate the PHZ if it didn't render properly once 
  in polar.  Try to use the 'pocket' chrome extension as an initial proof of 
  concept and if it works we can use it as our main extension.  This should 
  be based on an REST API within Polar that should be documented. 

- Some type of ad block implemented to avoid showing ads when performing a 
  web capture.

- thumbnails and favicons of captured documents (and PDF)

- binary file attachments for the datastore for images and video

- firebase cloud support for realtime sync

- Automatic package updates for all platforms

# Medium Term
  
- beautiful UI and UX and bring in a designer to put some fit and finihs on polar
  
- Advanced video support including a video player with the ability to keep 
  annotations on the video and jump to the offsets.  
  
- Fix font / zoom issues at 1.5x.  In order to do this I need to get access
  to the webview behind the iframe but if I change the zoom level there it
  changes the zoom level for the entire page.  

- Better integration testing of core functionality?

- 'Repository' view (bookshelf) for all the documents you've loaded, their
  progress, thumbnails, titles, etc.  I might have to create a mockup of this and
  get feedback from the community.
  
- Migrate to using JSON schema for validation of all the JSON before we commit 
  to disk or read content from disk. 
  
- Improve our protocol interception support on Electron so that we can implement
  a progress bar while a document is rendering and enable smooth rendering of 
  pages while they are loading. 

- Support annotation on video and audio with links back to the original.  Video
  and audio support would need to be integrated into Polar but since it's based
  on Electron this shouldn't be a problem. 

- Undo, Redo support.

- Progress Web App which allows you to view your annotations on your mobile 
  device.
  
# Long Term

- Transactional JSON write ahead log across machines which is merged to the 
  on-disk store. It should support time travel so that the user can recover their
  store/repository at a given point in time.  This would also support apps
  listening to the log to discover new files written between machines.  We should
  support filtering the log so that certain clients can perform sub-replication
  of only a reduce set of data.  

- Implement ad blocking and consider working with Wexond on this functionality.

- Support other ebook formats like ePub. There are javascript implementations of
  these. It might also be nice to just convert them to PDF.
   
- Implement a plugin API for sync providers

- Need to support a system for settings/config based on json schema form.

- Basic REST API based on Express for high level operations in Polar:
    - add documents to the repository
    - list documents in the repository
    - get document metadata 
    - fetch documents from the repository

 - Additional annotation types including a complex feature set like notes and
  tags for these objects.

 - Fully distributed. You control your notes. You can export them to Evernote,
   Google Drive, etc but Polar keeps track of your notes for you.

 - Distributed collaboration with other Polar users.

 - Ability to pull down ISBN metadata for books

 - Ability to pull down metadata by academic paper ID using various platform
   APIs.

 - High level plugin API so that developers can write extensions without having
   to know about more complicate details like React and so forth.  This way 
   developers could write plugins that do basic UI stuff without complex UI 
   integration work.
    
 - 'Add to Polar' android app
 
 - Polar Android App for spaced repitition
    - Maybe make it a PWA or react native.

 - Sidebar for annotations.
