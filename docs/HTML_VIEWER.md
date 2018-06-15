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


# Serving zip files:

    https://stackoverflow.com/questions/10359485/how-to-download-and-unzip-a-zip-file-in-memory-in-nodejs

# TODO:

- when the page is resized, we need to call the iframe resizer...

- when the user zooms the page, we should trap this and zoom the UI ourselves.

    - https://stackoverflow.com/questions/27116221/prevent-zoom-cross-browser
