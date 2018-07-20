
## 1.0 b30 release

- wikipedia pages look poor at 150%

- area highlights

- flashcards

- can't create pagemark lower down on the page... elementsFromPage is supposed
  to be based on the viewport but neither client nor page seems to fix it.

    - I think this is because the offset position isn't within the parent page.

    - any child iframes in the host iframe ALSO need the proper event offset...
      I guess I just need a set of events all the way down the tree.

    - wow.. in PDF.js the pageX CHANGES as I move elemtns around the page?  How
      is that possible?

        MUST be element scroll!!!

## Usability priorities:



- there needs to be a 3rd pagemark type, IE informational.. bascially table of
  content and appendix pages. They should not have a full pagemark over them.
  and/or the pagemark should just be inactive.  If the pagemark obsctures / blocks
  the UI then the table of contents won't be usable but at the same time I don't
  want the ToC to count against our progress percentage.


- metadata needs lastUpdate timestamps for pagemarks and for the document...

    - I can do this in Model when I syunc the data to disk but I'll need to
      make sure to not double write it...

- initial window should be a factor of 8.5/11 ?

- fonts aren't being subpixel anti-aliased I think...

    - will-change: transform breaks us
    - must add and insert back in the iframe
    - looks like this is a bug with Electron on Linux...  I don't think there
      is a fix.

- HTML text highlights don't use the whole line-height which is kind of
  frustrating.  Try to fix this.

- The first time we create a new pagemark we can drag it outside of its
  container

- I need a sidebar app to view the highlights.

- I have to finish up the annotation editor for viewing / managing my annotations.

- link text highlighhts that are on different columns


## Next

- multi-color highlights:

    use these colors:

    https://chrome.google.com/webstore/detail/weava-highlighter-pdf-web/cbnaodkpfinfiipjblikofhlhlcickei/related



- full-text search:

    http://elasticlunr.com/
    https://lunrjs.com/
    http://fusejs.io/

- change library to GPL

    - figure out a grid control I should use... should be react based I think.

- I definitely need the sidebar app that shows all highlights in the current
  PDF...

    I think I could build them via a sidebar app...


    I can put

        #mainContainer {
            margin-right: 200px;
        }

    which should give me the room to add it...

- I need the ability to 'link' two highlights if they are between pages or
  between columns.

- Exit doesn't actyually work..

- Issues with resizeable pagemarks:

    - when the box is rendered with interactjs in PDF.js the page is
      permanently changed and it looks like we can resize everything.
        - this ONLY happens when it breaks though.

    - resizes immediately sets height=0 and break rendering

    - placement won't work because left/right aren't being used
        - thumbnails need a valid left/right, real pagemarks don't have one
          currently.


- Get PagemarkRect to work so that I can start using the new pagemark layout
  engine with the drag and resize features I worked out. This would let me use
  two column PDFs too.

- Get the import UI to work.  Ideally I would build out a chrome extension but
  realistically that's a lot of work to get the chrome extension and the app
  to communicate.

- I would still like to get the Home app working so that I can resome reading.

- Mark pages as 'not going to read' for now so that I don't wonder if I have to
  resume reading them.

- two column layout for PDFs.


- migrate to using react+redux ... redux should be the backend since it is very
  near to what I designed using proxies.  If I can implement everything with
  react + redux I should do so...

- The logger should include the class that's calling it.  I can create a new
  Error and parse the caller form that.

- File a bug about text selecton on chrome vs firefox.  Filed. They are not
  working on it though.

- clean up the input page so that it uses whitespace better
    - also initial size should be better

- json schema validation for all data and a schema for our main .json data

- recent files

    - https://github.com/electron/electron/blob/master/docs/tutorial/recent-documents.md

    - https://github.com/electron/electron/issues/4028

    - https://www.npmjs.com/package/electron-config

- get thumbnail capture working for extracting the image of a page.

- enable right click:

    https://stackoverflow.com/questions/32636750/how-to-add-a-right-click-menu-in-electron-that-has-inspect-element-option-like
    https://stackoverflow.com/questions/32636750/how-to-add-a-right-click-menu-in-electron-that-has-inspect-element-option-like/32636751

- offset each new window from the previous one. It's not clear that a window
  was actually opened.

    https://stackoverflow.com/questions/46949194/new-window-positioning-in-electron

- implement a PROPER context menu!!!

    https://www.youtube.com/watch?v=MkVLaM9JAxM
        - I'm going to have to add the event listener in the renderer and then
          use the electron API to popup the context menu for the various
          modes.

- 'open-file' event for mac and windows?

- get the transaction logs working

# Context Menu

    - right click to download

    - PDF links should automatically open in Polar.

# Features

- different 'types' of pagemarks including "ignore" and "read" types so that
  you can mark an entire page as ignore and still have that count towards 100%

- checkpoint journaling so I have confidence that I am not losing data.

# Release (for myself)

## Required editor functionality

- paste images / screenshots from clipboard and save as data URL.

 - https://stackoverflow.com/questions/28644340/how-do-i-get-base64-encoded-image-from-clipboard-in-internet-explorer

 - https://matthewmoisen.com/blog/paste-js-example/

 - I can detect the paste, then convert what's pasted to a data URL, then change
   the CSS it so that the user doesn't need to deal with the full thing.

# Spectron Testing

## Test for:

- re-use of main app when second app attempt requested
- loading PDF file from command line:
    - with no app running
    - with existing app running


## Site

- screenshot and video of the app

- Screenshots with pagemarks.

- Blog / post about it.

# Beta 9

- clean up excessive dependencies.

- file associations working for *.pdf with elecron-builder.
    - Not critical right now.

- Ability to disable PDF links as they would impact our ability to annotate but
  maybe they have to click the annotation button (highlight, highlight region)
  so that the links are then disabled.

- basic logging of renderer console data (errors) to the node console.

# v1.0

- I need a way to get end to end testing done so that I'm not constantly
  tripping over the same bugs.  For example, opening up existing files from disk,
  closing them, making sure the content is persisted and comes back after reload,
  etc.

- some sort of tab support working so I can edit muliple PDF files in the UI


- DMG and Linux releases work but:
    - file associations are broken
        - they don't work on MacOS
        - they aren't even present as an option for MacOS

#

# Development productivity


- get webapp testing working

- get end to end testing with pdf.js working

# Marketing

- (pending) pdf.js
- anki forum
- /r/medicalschool group...
- electronjs group
- other spaced repitition groups
- (done) /r/adhd
- (done) anki reddit
- (done) news.ycombinator

# Cleanup


- TODO: don't use the minified version of the app.  It makes it harder to work with.


- keep a history of recently opened files


- I could use chrome headless via fork() to print my own PDFs of URLs within
  electron since I'm running in the OS as a top level project.

    - this would give me the ability to import a specific URL or to send a URL
      from chrome to polar.

- change REMOVE to ERASE to avoid confusion with 'read'




