# TODO:

- Text highlights don't work at ALL...

- iframe URLs within the main page are not handled and they can have 'script'
  there which needs to be resolved.

- The Text Highlighter has a bug where an element that is hidden can actually
  get a highlight created for it if it is 'selected'..

    https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom

- There is a problem with the docMeta not being loaded until the entire iframe
  is loaded...  This isn't really necessary as some pages fetch fonts and so
  forth ... I need to load the docMeta once the page STARTS loading so that I
  can render pagemarks and initial highlights.

- iframes also need event listeners recursively...

# Rendering at small screen resolutions doesn't help too much.

    - The 750px screen resolution for the main viewer is actually still being
      used by the CSS in many situations. I need a way to KEEP the same CSS but
      expand the viewport.

        - Try to run the iframe window with the browser restrictions/emulation
          that I built out in capture.js to see if they work

        - create a basic viewer.js script that just launches a viewer with the
          options we specify.


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

# Expanding past 850px

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
