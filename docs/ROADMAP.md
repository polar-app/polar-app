
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

- Ability to change color of highlights. 

- Right click context menu to create text highlight if a selection is active.

- Right click context menu on text in the document and 'set title' on the result.  
  
- build out some sort of loading icon icon. At least for the htmlviewer which 
  really needs it.
  
    https://www-static-blogs.operacdn.com/multi/wp-content/uploads/sites/3/2018/01/spins.gif


- Redo the HTML app so that it scrolls via overflow not via the page scrolling.
  This way the PDF viewer and HTML viewer have the same general layout which 
  should reduce bugs.

# Medium Term

- Support native platform integration for file extensions. *.pdf and *.phz. 
  This is a good project for someone else on MacOS or Windows to take on as we
  just need to augment electron-builder to implement support for the extension
  and then update main.js to handle the event when the file is opened.  

- Chrome extension to take the rendered page and load it into polar, possibly
  with the option to re-generate the PHZ if it didn't render properly once 
  in polar.  Try to use the 'pocket' chrome extension as an initial proof of 
  concept and if it works we can use it as our main extension.  This should 
  be based on an REST API within Polar that should be documented. 

- Some type of ad block implemented to avoid showing ads when performing a 
  web capture.
  
- Fix font / zoom issues at 1.5x.  In order to do this I need to get access
  to the webview behind the iframe but if I change the zoom level there it
  changes the zoom level for the entire page.  

- Better integration testing of core functionality?

- 'Repository' view (bookshelf) for all the documents you've loaded, their
  progress, thumbnails, titles, etc.  I might have to create a mockup of this and
  get feedback from the community.

- Migrate back to Bootstrap 3.3.x since both react and summernote prefer the 
  3.3.x series. 
  
- Cryptographically signed releases for Windows, Linux and Mac

- Automatic package distribution / updates for all platforms.
  
- Migrate to using JSON schema for validation of all the JSON before we commit 
  to disk or read content from disk. 
  
- Support 'archive' in the bookshelf app which would enable you to hide a document
  which is completed or no longer of interest.  
  
- Improve our protocol interception support on Electron so that we can implement
  a progress bar while a document is rendering and enable smooth rendering of 
  pages while they are loading. 
  
- Undo, Redo support.
  
# Long Term

- Repository app that shows all documents, allows you to sort them, open them
  view stats on the repository, etc.

- Transactional JSON write ahead log across machines which is merged to the 
  on-disk store. It should support time travel so that the user can recover their
  store/repository at a given point in time.  This would also support apps
  listening to the log to discover new files written between machines.  We should
  support filtering the log so that certain clients can perform sub-replication
  of only a reduce set of data.  

- Support annotation on video and audio with links back to the original.  Video
  and audio support would need to be integrated into Polar but since it's based
  on Electron this shouldn't be a problem. 

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
   
 - Management UI for all the notes you've worked on (editing, changing them,
   adding metadata, etc).

 - Tagging system and the ability to perform advanced functions on the tags.

 - Native cloud sync across devices.
   
 - 'Add to Polar' chrome extension
 
 - 'Add to Polar' android app
 
 - Polar Android App for spaced repitition
    - Maybe make it a PWA or react native.

 - Sidebar for annotations.
