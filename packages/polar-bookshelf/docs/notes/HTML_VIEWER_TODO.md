# TODO:

- Some documents are always 105% of the browser height.

    1. If we capture with a HUGE window then we end up with a HUGE captured
       document.  Even if the HTML document is super small.  This happens in
       practice with some real world documents.

- maybe one way to apply CSS style to an element could be to:
    - CSS hide the original
    - make a clone of it, including style,
    - mutate it
    - inject the shadow dom node...
    - the problme with this approach is that I would still need to use span.

    - ANOTHER idea is that I could, instead of using DOM , use the Selection.
    ... but then the user could NEVER copy text.

- Also listen for timers to terminate. Many events of the page still haven't
  executed and we're running into races wehre the page hasn't finished loading.

  Right now we have a 1.5s timer setup to allow this to finish but that's a hack.

  I have some code to wrap setTimer() with TimeoutManager and I can use this to
  either:
    - wait until all initial timeouts are finished
    - wait a specific time

    ... whichever happens first.


    If the page is STILL fetching content and executing after 1.5s I'm not sure
    we should do anythinhg.. we can show the user this progress though so that
    theyr'e awayre why the page isn't finished loading.


- some documents seem to NEVER terminate their height adjustment:

    https://medium.com/@mccannatron/guide-to-launching-an-initial-coin-offering-ico-94587af2c8d5

    - consider fixing this via load.js and looking at the document's internal
      state vs the window NOT the external state of the iframe to see if it
      needs to change the iframe size.

    - play with transform: translateZ(0):

        - which might trick hardware acceleration to work.

    - this seems to highlight the problem a bit:
        https://codepen.io/Vestride/pen/CvBrw

- fonts are looking ugly now at 150% ... even 100% doesn't look that impressive.
  Maybe play with the native zoom support in Electron via webContents.setZoomLevel
  which should be [1.0,N].  I might also look at improving fonts in general in
  Electron.

    https://stackoverflow.com/questions/14677490/blurry-text-after-using-css-transform-scale-in-chrome

- broken page:

    https://en.m.wikipedia.org/wiki/Multiple_inheritance

    Try to load this page with my new event listener code to see if I can count
    to either zero pending timeouts or 1000ms.

- sometimes I'm getting this when using capture:

    VM1392:130 Uncaught TypeError: Cannot read property 'scrollHeight' of null
        at Function.captureDoc (<anonymous>:130:52)
        at Function.captureHTML (<anonymous>:48:47)
        at <anonymous>:85:36
        at Function.captureHTML (<anonymous>:76:21)
        at <anonymous>:85:36
        at NodeList.forEach (<anonymous>)
        at Function.captureHTML (<anonymous>:76:21)
        at <anonymous>:1:16
        at EventEmitter.electron.ipcRenderer.on (/home/burton/projects/polar-bookshelf/node_modules/electron/dist/resources/electron.asar/renderer/init.js:75)
        at emitMany (events.js:147)
        at EventEmitter.emit (events.js:224)

    - which brings up another problem of executeJavascript not handling thrown errors.

    - FIXME :" what about async callback funcitons? those won't work I think!!!

- the Selected CSS should always be blue background with white text...  the
  guardian uses yellow so it looks like a highlight:

    https://www.theguardian.com/technology/2018/may/24/facebook-accused-of-conducting-mass-surveillance-through-its-apps

    https://css-tricks.com/overriding-the-default-text-selection-color-with-css/
-

- This webContents API might be easier than ContentCapture... holy fuck!  THIS
  would have saved me a shit load of time!!!  Like a WEEK... FUCK THIS.

    contents.savePage(fullPath, saveType, callback)

    fullPath String - The full file path.
    saveType String - Specify the save type.
    HTMLOnly - Save only the HTML of the page.
    HTMLComplete - Save complete-html page.
    MHTML - Save complete-html page as MHTML.
    callback Function - (error) => {}.
    error Error

    - mhtml DOES support iframes if we page down... The main problem is that
      it creates a subdir but I could package that I think.

    - it also wouldn't support the work I did on page emulation but that is still
      something I can work with.

        - It DOES do this... but I think the work I already did gets me 99% of
          the way there...   It sucks though that I couldn't have leveraged
          that work.

    - Since I control the file output I can at least implemetn the 'partial'
      support.  That I wanted.

- A better way to create highlights could be to create my own copy of the underlying
  element, and then create three layers.

    - the base layer is still there but 100% hidden.
    - a new layer on top of the original text
       - this has a background 'highlight layer'
       - then a new layer on top of this one which is transparent and has just
         the text.

    - this would enable us to have black text without any opacity.

- I think we should NOT serve X-Frame-Options.  Ever.  It wouldn't actually ever
  yield a positive outcome:

    https://www.whitehatsec.com/blog/x-frame-options-xfo-detection-from-javascript/

- some text highlights are getting expanded when the second half of the content
  is being rendered.  ... as well as overlapped.  The document:

    "Announcing TypeScript support in Electron"

    That I was reading is a good example of this problem.  I can now test for
    this I think but I could also pull out the raw rects and write a test
    for that data.

    - text highlights are doubling up on top of themselves so we're getting
      incorrect opacity.

- iframe URLs within the main page are not handled and they can have 'script'
  there which needs to be resolved.  This mostly impacts ads right now so
  isn't of major importance.

- The Text Highlighter has a bug where an element that is hidden can actually
  get a highlight created for it if it is 'selected'.  I could probably bypass
  this by making sure each element I'm about to highlight is actually visually
  present.  And not visibility: hidden or display: none

    https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom

- There is a problem with the docMeta not being loaded until the entire iframe
  is loaded...  This isn't really necessary as some pages fetch fonts and so
  forth ... I need to load the docMeta once the page STARTS loading so that I
  can render pagemarks and initial highlights.

# User Requirements

High level requirements for all of our solutions:

- Work with the main browser instance. This way if the user is using ad-block
  or us logged into a site using user/pass the HTML is preserved

- link rel styles...
- CSS @import
- images via "data:" URLs


# Dev Requirements

- ideally don't require running within an extension so we can run it from Electron

# Stages

Can I break this down into stages so I can get an initial version working:

## Stage 1

- simple <link> handling. If they use @import, it breaks
- compressed .zip handling would have to work

## Stage 2

- parse out @import and replace that content
- I would have to figure out how to serialize the new CSS
- It breaks the original CSS content (not the end of the world)



# Rendering at small screen resolutions doesn't help too much.

    - The 750px screen resolution for the main viewer is actually still being
      used by the CSS in many situations. I need a way to KEEP the same CSS but
      expand the viewport.

        - Try to run the iframe window with the browser restrictions/emulation
          that I built out in capture.js to see if they work

        - create a basic viewer.js script that just launches a viewer with the
          options we specify.

# Long Term Strategies

## Service Workers

- I could use the HAR capture, then implemetn a service worker to serve via HAR.

    - they have precaching , background sync, and more:

        - https://developers.google.com/web/tools/workbox/
        - https://github.com/GoogleChromeLabs/sw-precache
            - this supports a whole pre-cache system for resources and might work.
            - the EASIEST way for me to do this is probably to just map URLs to
              content and then have the precache service worker just load the
              URL from the service worker once it matches the content.

### CONS

 - Big one! THIS WILL NOT WORK!  I can't serve other URLs for other domains.


## Set referer or "fake" document.location.href

- if we can set a referer we could avoid resources being blocked which would
  enable us to save page without offline support (for now).

## I could take Save Webpage WE and Pocket and combine them. Hack Save Webpage

    - I can just stub out the UI and replace it with my code without having to
      understand the complexities.

## Capture MHTML in Main Browser , emulate device + capture in Electron.

### PROS

- I get to use saveAsMHTML which is easy to work with.

### CONS

- the URL would not be authoritative and could be blocked via <script> tags
- I can not load from the filesystem I think because then web security would be
  an issue
-

## Use my static capture and then Inliner

https://github.com/remy/inliner

### TODO

- what is the user agent?

- get.js needs:

      var settings = assign({}, options, {
        encoding: null,
        followRedirect: true,
        headers: inliner.headers,
        gzip: true
      });

- links.js needs:

   $(link).replaceWith(`<style data-inliner-style-url="${url}">${css}</style>`);

### PROS

### CONS

- It doesn't fetch URLs using the browser. It fetches them using node.

- Won't ever work within chrome

- Won't work for sites that have authentication setup on the dependent resources

- It seems to lock up ...

- it skips google analytics

- how do we specify HTTP timeouts, etc? It would be better to do this ALL in the
  browser, then bundle it up and send it to capture.

- what is the user agent?

- inliner doesn't work with CSS properly and we're still missing things rendering properly.
    - I think this is because we're giving it the source, not the URL and then
      full URLs can't be expanded and it's not using 'base' to expand the URLs.
    - it also doesn't respect the BASE URL...

## Snapshot all HTML + JS + CSS in browser, perform 'capture' in Electron.

- we would have to re-define document.location.href (if possible)
- emulate device and screen resolution
- then capture there

### PROS

- would mean that we can capture pages behind authenticated pages
- would work with ad block

### CONS

- more complicated
- what do we do about XHR responses?  Those can require HTTP response headers and
  are not normal URLs.

## Chrome Extension with Cookies + URL sent to electron

If we send the cookies, we will authenticate as the user.

### TODO

- we could look for blocked elements and/or blocked resources and also block
  them in electron

- we would have to redefine document.location / etc

### PROS

- most of what we want works

### CONS

- ad blocking and other extensions won't be enabled

## Chrome Extension + Cookies + HAR + Inliner

This setup would capture most of the content in the brower, send it to electron
for processing but the HTML+CSS+images,etc would all be in the HAR.

# Related Projects

- https://developer.chrome.com/extensions/pageCapture

    - standard chrome API
    - this is the BEST way for me to implement it as an extension. My capture
      script might not be needed.

    - can I serve mhtml over HTTP?
    - could I make them data URLs?
    - what about iframes?
    - CONS:
        - I'm 99% certain pageCapture isn't implemented by electron
        - I have to serve the files via file: URL (which might be acceptable)

    - https://stackoverflow.com/questions/24672190/can-we-download-a-webpage-completely-with-chrome-downloads-download-google-chr

- https://github.com/rahiel/archiveror

- pocket's extension is OSS... I can leverage that:
    https://github.com/Pocket/extension-save-to-pocket

- research HAR (HTML Archive) files
    - chrome has an API for this feature
    - a .har file is just JSON though.

- https://github.com/gildas-lormeau/Scrapbook-for-SingleFile
    - ships as a chrome extension
    - https://www.npmjs.com/package/chrome-har
        - this allows building one from:
            - Chrome DevTools Protocol data


- https://chrome.google.com/webstore/detail/save-page-we/dhhpefjklgkmgeafimnjhojgjamoafof?hl=en-US

    - Uses the WebExtensions API and supports FF and Chrome
    - I would need to port this one to chrome/electron though.
    - chrome extension ID: dhhpefjklgkmgeafimnjhojgjamoafof
    - I might be able to install this as a devtools extension if ALL the APIs
      are implemented.
        https://github.com/electron/electron/blob/master/docs/tutorial/devtools-extension.md

- https://chrome.google.com/webstore/detail/singlefile/mpiodijhokgodhhofbcjdecpffjipkle?hl=en

# General Design
    - Capture raw HTML headers and response data
    - We KEEP the full URL and implement this as a proxy service where we use
      an HTTP proxy service.
    - I could do a static HTML and then a 'computed' CSS styles system now with
      just computed inline rules.
      - Web fonts and images would be the only other issue at that point.
        - CSS is going to be the biggest challenge because there are a lot of
          ways to represent a page using url() and so forth.
      - IF I can implement this just as raw HTTP that would have a HUGE benefit
        but I would have to capture and change URLs somehow.

      - This is just a difficult issue I think.. one that I would need to put
        engineers on to solve.


      - AHAH!  I think I CAN do it for a single proxy in Chrome.

      https://stackoverflow.com/questions/15020387/set-proxy-using-google-chrome-extention

      but that would require everyone use chrome.

      If they use the chrome extension it would work well for offline web pages.

## Gotchas
    - chrome can't set a proxy on a per window or per request basis (pretty sure)
    - CSS can use @import
    - HTML imports also complicate issues


# Zip / Archive storage

- We can do a quick proof of concept of zip / archive storage.  The first one
  with JUST one static file will get us 90% of what we need.  We can just store
  HTTP headers and then the raw HTML file but also the secondary / associated
  metadata.  In fact we don't even need the header file now.  Just serve it as
  index.html but there would also be metadata.json and thumbnail.png as well
  as other resources there.

# Design for storing + handling static HTML vs PDF

- New Pulldown
    - Import Web Page
    - prompt for URL
    - create invisible electron window with 'show=false'
       - ... need some sort of progress listener while it loads
    - Capture the HTML to disk
    - Store it as a .zip file with a metadata.json and an index.html file
    - Serve the .zip file from HTTP with
        https://www.npmjs.com/package/express-static-zip
        - FIXME: this caches it in meemory
    - Update the app to support indexing from within an iframe.
    - Store the html within a .page and a .textLayer so that all the existing
      tools work properly.
    - pagemarks for now are all we can support I think.

# Baby steps.

    - build a command line electron app that does this for me... without the
      issue of HTML.

    - store just the static .html file for now. the 'base' and existing document
      title are enough to work with I think.

    - then get a menu option for a 'htmlviewer' that works like 'pdfviewer' but
      is just for html archives.


# Locked Reflow

This is an idea where we set the screen resolution much much smaller.  Closer to
a mobile device like an iPhone.  So say 375px wide.

This will build a more realistic "document" view where the viewport is only
composed of the text.  The PROBLEM here is that viewing it on a 30" monitor would
be horrible.

To avoid this problem we can 'lock' down the elements by permanently keeping them
as display: none... then , in theory, I should be able to hide then once I return
to the normal size.

We can accomplish this by:

    - setting the viewport smaller
    - capturing all the elements that are now invisible
    - when the page is reverted, to a larger size, I can then add a new class
      of "polar-locked-reflow" which is just "display: none !important;" to
      hide that content.

# Serving zip files:

    https://stackoverflow.com/questions/10359485/how-to-download-and-unzip-a-zip-file-in-memory-in-nodejs


# Ad Blocking

https://www.geekwire.com/2018/meet-pulumi-seattle-grown-cloud-startup-wants-development-platform-multicloud-era/

This site has too many ads...  They show up as large white iframes which take up
a ton of space.

# Expanding past 850px

https://techcrunch.com/2018/06/17/after-twenty-years-of-salesforce-what-marc-benioff-got-right-and-wrong-about-the-cloud/

  850px is still a bit small but it's what we need to trigger ipad mode.

  What I COULD do is size down to 850... find the hidden CSS nodes, then change
  the browser style bit FIRST I set display:none manually!  Since there isn't
  javascript at this point there's that can be done to block it.

  - it seems I can just do this by default now... I might want to play with it
    and see what happens to other page types.

# Packaging and Broken Resources:

- We're going to have to download fonts and other resources I think.

    - Access to Font at
        'http://www.cbc.ca/a/styles/fonts-css/fonts/Stag-Medium-Web.ttf' from origin
        'http://127.0.0.1:8500' has been blocked by CORS policy: No
        'Access-Control-Allow-Origin' header is present on the requested resource.
        Origin 'http://127.0.0.1:8500' is therefore not allowed access.

    - we can bypass this for now by disabling web security which fixes the
      font loading problem but does NOT solve the issue where I'm not able to
      cache the results completely locally.

    - Instead of downloading these and keeping them, can I intercept HTTP requests
      and replay them?

- It would be BETTER if I can build an HTTP proxy with node to capture/save
  resources and serve them from packages directly.

# Broken Examples:

## https://www.infoq.com/news/2018/05/service-workers-supported-across

Broken layout...

## https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

Collapses vertically and means that certain elements have to be expanded to read.

It makes sense from a mobile document but not from a readable document.

I can set aria-hidden=false

## This renders too narrow:

https://techcrunch.com/2018/06/17/after-twenty-years-of-salesforce-what-marc-benioff-got-right-and-wrong-about-the-cloud/

.. I can clean this up by forcing the width the way I way.

I think the algorith would basically be:
    - for every element:
    - compute the exact right position.
    - let elementsByWidthDesc = sort by width , descending.
    - let desiredWidth = window.width
    - let buffer = 5px; // this is used so that some reasonable margin is permissable.
    - for every element in elementsByWidthDesc
        if element.width - desiredWidth > buffer
            element.width = desiredWidth - buffer;
            desiredWidth = element.width

    - this should basically expand every element so that it properly fills up the
      page on larger devices.

    - I might not want to do this on absolutely positioned elements though.

    - If it is LESS than page with (factoring in some margin), then expand it.

- It actually might be better to do something along the lines of rendering in
  TWO modes . Super phone width and tablet width.  Then we can use the DOM
  layout to detect which one rendered better.

    https://stackoverflow.com/questions/6209161/extract-the-current-dom-and-print-it-as-a-string-with-styles-intact


###

- this renders like horribly. ...

http://thehill.com/homenews/administration/392430-trump-i-want-americans-to-listen-to-me-like-north-koreans-listen-to

- I need to figure out why...

    - additionally .. chrome with browser emulation also renders this incorrectly.

    - I think I need to have the device FULLY emulated including APIs that return
      the viewport size..

    - these are returning incorrect values... which is the problem.

    window.screen.availHeight
    1573
    window.screen.availHeight
    1573


    setting:
        maxWidth: 450,
        maxHeight: 450,


    does nto change availHeight or availWidth

    http://www.digimantra.com/technology/javascript/detect-screen-or-browser-size-in-javascript/


    ok.. THIS trick actually works!!!

    https://superuser.com/questions/712461/how-to-customize-screen-resolution-reported-to-a-javascript-application-by-a-web

    so what I need to do is inject some codde BEFORE the page starts executing.. which is totally poossible.

# Broken Examples that don't render properly

## https://www.thedailybeast.com/report-north-korea-sought-backchannel-with-jared-kushner

- the sidebar is still present but on my Galaxy S8 the width is appropriate..

    - this is because the viewport just has to be smaller. 850 is too large.

    - I think I'm going to have to go with my Locked Reflow hack.

## https://www.nytimes.com/2018/06/17/us/immigration-deported-parents.html

- nytimes has a "show full article" toggle
   - plus I have to scroll down the page to see the images.




window.history.pushState = function() {
    throw new Error("Nope.. ");
}
