

- Ability to change color of highlights. 

- sidebar for the main reader which shows all the annotations on a page and 
  provides the ability preview them, scroll through and then navigate to the
  annotation on the doc.

- Simple 'About' webapp that includes the version of the project. Where to find
  more resources, donation links, etc.

- Initial / basic Anki sync.  

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

- Support other ebook formats like ePub. There are javascript implementations of
  these. It might also be nice to just convert them to PDF.

- Better integration testing of core functionality?

- 'Repository' view for all the documents you've loaded, their progress, 
  thumbnails, titles, etc.  I might have to create a mockup of this and get 
  feedback from the community.
   
- Implement a plugin API for sync providers

- Implement ad blocking and consider working with Wexond on this functionality.

- Need to support a system for settings/config based on json schema form.

- Migrate back to Bootstrap 3.3.x since both react and summernote prefer the 
  3.3.x series. 

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
   
