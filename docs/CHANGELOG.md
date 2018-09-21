
# 1.0.0-beta175

- Updated large number of dependencies

- Electron 3.0.0

- new (initial) annotation sidebar for navigating and creating additional 
  annotations. 

# 1.0.0-beta170

- New tagging UI for the repository. Documents can have tags and and properly 
  filter them.  Tags follow twitter hashtag constraints.  

- Fixed issue with circular structure when logging.

- Fixed document repository corruption bug

# 1.0.0-beta160

- Fixed corruption issue regarding the store when two documents are open and one
  is updated.
  
- Using intercept stream protocol instead of intercept buffer protocol. Should
  fix a number of major problems regarding capture.
  
- Fixed capture issue around document corruption and some races after capture
  launched.

# 1.0.0-beta152

- Fixed potential race creating directories

- new build targets to make a new / local deb/snap without pushing them.

- Fixed bug if a single DocMeta file is broken

- Update to Electron 3.0 beta 12.

# 1.0.0-beta150

- new browser based capture system.

- Fixed bug where we could accidentally put the user in a situation where they
  can lock themselves out of the document repository.

# 1.0.0-beta141

- Fixed issue with repository generating errors when no files were in the repo

- Fixed issue with Files API returning empty exceptions which prevented debugging
  when in production.
  
- We now write errors to ~/.polar/logs/error.log which should make it easier for 
  users to help us find problems in production.

# 1.0.0-beta140

- Electron 3.0 beta 10

- Document Repository now supports the following features:

    - flagging files 
    - archiving files
    - filtering files by flagged only
    - filtering files to hide archived files.

# 1.0.0-beta133

- improved spectron tests
- migrated to chai everywhere for assert
- more windows bug fixes.

# 1.0.0-beta132

- Fixed hopefully the last Windows issue. This was due to not awaiting a promise
  where on Linux it was unnecessary.

# 1.0.0-beta131

- Fixed a major Windows regression in pagemarks.

# 1.0.0-beta130

- AHA.. We were not using Electron 3.0 beta8.. we were still stuck on beta5 
  due to an electron-builder issue. 

# 1.0.0-beta129

- Improved how we create TextHighlight to avoid type issues.

- Notes and Questions properly typed

- BaseHighlight.rects properly typed now. 

- TextHighlight properly using string | Text for the text of a highlight.

- FAQ updated for how to enable advanced logging.

- FAQ updated to build from source. 

- Fixed logging issue where we might have been swallowing an uncaught exception.

- Fixed bug where Polar is running and the user double clicks on the app again
  and nothing happens.

- Removed # in URL for sync app since it's no longer needed and prevented
  execution on Windows.

- Re-launch the app repository if polar is already running and the user clicks
  on the desktop icon.

# 1.0.0-beta128

- Updated logging to include the path when we can't open an AppPaths relative file.  

# 1.0.0-beta127
 
- Fixed a half dozen path separator bugs on Windows.

- Fixed potential Windows bug when importing PDF files into the repo and working
  with files in general.

# 1.0.0-beta126

- Sending error traces to Sentry

# 1.0.0-beta125

- Fixed more platform issues on Windows

# 1.0.0-beta120

- Fixed a number of important bugs with Windows

- Screenshots are now taken when text highlights are created.

- Improvements to HTML content generation when copying from the document.

- new Screenshots and Attachment support for object model. 

- crash reporter enabled for backtrace.io but only in a basic scenario.

- the renderer can write directly to disk now which improves performance

- Updated to beta 8 of Electron 3.0

- Spectron tests sort of working again.

- More data copied from the PHZ to the DocMeta including URL and filename.

- If you open a PDF file off disk it's imported into the stash now.

- Major logging system improvements. 

# 1.0.0-beta110

- If the PHZ file is wider than the window we're loading in we now expand the 
  window.

- Snap file distribution disabled at the moment. They don't work properly and 
  I need to take the time to build them correctly.  We have tar.

- Offset given to new windows so that it's not confused with the previous window.

- Better logging for additional performance. Default log level is INFO bug we 
  can change it later to WARN.  Include the source of the log event and the log
  level in messages now.  

- new document repository UI as standard. Supports viewing your documents as a 
  queue based on time, progress, filtering by document title, sorting by document,
  pagination of the documents in your repository, and double clicking to open 
  a document.

- AppAnalytics now sends userAgent to Google Analytics so we can track OS, 
  Browser version, app version, etc.  

- re-enabled opening a file from the command line.

- Started work on screenshots which are now disabled by default.  When you take
  a highlight the screenshots are stored as part of the annotation for future
  reference.   

- Went through and upgraded all apps to make sure electron-log was enable and 
  working properly.

- now using electron-log as our logger by default.  We now log to .polar/logs 
  and consolidate all the window log lines into one location.  This way users
  can debug their problems easier.

- big refactor of the main app into smaller components. Code is much more 
  manageable now.
  
- update electron-log version      

# 1.0.0-beta103

- deleted some of the pdf.js nav links as they were broken for the most part.

- Removed errant link to jquery-ui which was being fetched and probably slowing
  down the initial page load.

# 1.0.0-beta102

- Fixed Windows builds to have proper files for the .exe. Setup tested and it 
  works properly now. 

# 1.0.0-beta100

- Capture now using webview by default for captured content. Should be much much
  more reliable and usable. Prevents crashes on Linux.
  
- Windows builds now dramatically smaller.  From 300MB down to 75MB.  

- Migrated to ASAR builds which should significantly improve performance on Windows
 
- 64bit and 32bit Windows builds now available.

- Capturing now more reliable if it is aborted by the user.  Electron used to
  lock up.   

- Initial Anki sync working

- Flashcard input now fully working.  

- Ability to set titles for a document

- Initial support for pagemarks that can be 'ignored' and have a state so that
  you can say that you're ignoring a whole section of a doc and not that it's 
  been 'read'.

- Image sync works for Anki and we properly handle media files.

- Better integration with your primary browser. If you click on a link in a 
  captured page it opens in your browser.

- Started work on a video implementation to create notes+flashcards while watching
  a youtube video and keeping track of progress while watching it.  Will take a 
  while to have an implementation of this feature ready. 

# 1.0.0-beta10

- ability to easily toggle the devtools.

- --enable-dev-tools command line arg for starting with the dev tools already running

# 1.0.0-beta9

- reworked command line handling so that PDFs that are opened from the command
  line are opened in a new window.

- new "Open in New Window" menu option so that we can work with multiple PDF
  files.

# 1.0.0-beta8

- New windows were always maximized which was difficult to work with.

- Support opening multiple windows now.  We were constrained to just one window
  before.

# 1.0.0-beta7

- All PDF files are served via HTTP and webapp served via HTTP too which avoids
  some pdf.js bugs.
