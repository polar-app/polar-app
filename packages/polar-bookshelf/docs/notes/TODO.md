

## 1.0 b60

- Anki sync

- Look at borrowing some of this UI code for the capture system.

   https://github.com/hokein/electron-sample-apps/tree/master/webview/browser


- wikipedia pages look poor at 150%

    - part of it has to do with the source document. my test.html looks better
      vs the same captured page.  It could be due to font issues I think.

    - I'm 90% certain that the page is not anti-aliased properly in my polar
    version vs my simulated electron version. The text looks like its subpixel
    antialiased in one but not the other.  These bugs are impossible to detect
    via unit test  I might be able to thumbnail the page and look ad the
    hashcode of the binary image data to see if its rendered differently.

        - I can probably fix this bug easily though... I'm going to have to write
          down all the gotchas that manifest this problem.

        - FIRST fix this problem as I have NO idea what's happening with this
          other problem and it might just be SPAA issues...

        - I can disable EVERYTHING but it won't work BUT if I load it as a .html
          file from the filesystem THEN it works.

    - the Ubuntu AA issues are fixed but they are not resolved on iframe resize!!!
        - it's even if the DEFAULT scale is 1.5 without JS reload
        - try it with my minimal test...
        - my standalone MINIMAL test works when the text is 1.5 by default.. and
          looks fine.

    - OK.. the bug looks to be an issue if the iframe has its src attribute
      changed after already being in the DOM previously.. this might also impact
      resizing it too.  Experiment with injecting a NEW one and see if that
      fixes the problem.

    - OK.. now the issue is that he element WORKS if it's AA when first injected
      as an iframe...

    - OK... NOW it looks like ALL our code is correct... BUT the PHZ file is broken
      and I DO NOT need to add/remove the HTML element.. it's just the PHZ file.
      Maybe ALL documents need a default style.

        - OK.. at this point I think it's nothing we're doing wrong.  The
          problem has to do with the CSS of the document.  The CSS is messing up
          rendering of the page.  This has got to be an Electron bug. We've
          mitigated the problem a bit for many documents but I think if they
          set any weird CSS it then triggers the Electron bug again. We can
          duplicate this by re-loading the Wikipedia page and then seeing if the
          problem manifests itself again.

        - the AA works fine on this content when it's not scale(1.5) so it might
          be a chrome issue which we would need to track down...

        - It is a CHROME bug. the text looks shitty on Chrome too with my
          iframe-fuzzy-text test.

        - and i does NO tneed to be in the iframe.

        - as SOON as the CSS properties for that page exist for transform we
          lose anti-aliasing...

            EITHER transform or will-change transform will disable SPAA ...

            but I need to note that it does not ALWAYS trigger the problem..

        - webview zoom might fix this problem completely... but would be harder
          to implement I think.

        - OK.. a workaround would be to use webview not iframe... iframe sucks and
          opens us up to bugs WRT chrome and transform() ... it might be a hard
          thing to impelement though so don't start it right away.

        - the 2.x 'zoom' as a webview doesn't actually seem to correspond to 2.x
          zoom of the page and we can't calculate the new width as it will reflow

            - it might be that my attempts at zoom don't actually correspond with 2.0

        - the proposal won't work if I can't access contentDocument.. will be 1000x easier


        - I can fix this by using Electron 3.0.. what I have to do is get the
          webContents from the iframe and call setZoomFactor directly instead of
          using CSS scale.  THIS is the fix / workaround I was looking for... if I
          can get the webView for the iframe I should be good.  I need to track
          the URL and documentation for this.

            https://github.com/electron/electron/pull/11607

        - it might also be possible to use meta viewport BUT this doesn't seem
          to work without emulating a mobile device.

        - ANOTHER solution would be to rework the way the html viewer is designed.

          We could do a webview wrapping an iframe for now.  The webview is what
          would be scaled, not the iframe.  We would use the native HTML webview
          zoom support and it wouldn't impact the rest of the UI.


## 1.0 b50 release

- (DONE) Context menu needs copy/paste

- Electron 3.0

- Flashcard UI and data input

- Started migration to typescript

- Flashcards input implemented

## 1.0 b30 release

- DONE: google analytics support

- DONE: area highlights implemented

- DONE: fixed paste on MacOS

- DONE: can't create pagemark lower down on the page... elementsFromPage is supposed
  to be based on the viewport but neither client nor page seems to fix it.

- DONE: create an AnnotationsController in the renderer that listens to postMessage
  for "create-pagemark" , then starts a dialog box to prompt for a flashcard
  text input...

- DONE: Create Pagemark on PDF doesn't work becuase we're not finding the offset vs the
  parent element.  Share this code with the PagemarkCoverageEventListener

## Usability priorities:



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




