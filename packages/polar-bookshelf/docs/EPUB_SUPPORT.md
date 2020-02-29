# Overview

ePUB is a very book file format that many of our users support. There are high
quality Javascript libraries for rendering ePUBs so supporting them in polar
seems to make sense.

# Implementation Challenges

# pdfviewer

Right now our PDF reader UI is mostly powered by pdf.js.  We hook into it using
some unusual and not supported APIs like injecting DOM event listeners since 
we didn't actually build out the viewer.

This is called pdfviewer and is located at ```./pdfviewer```.

It supports advanced features like:

    - thumbnails of pages on a sidebar so you can page down and see pages before 
      you've switched to them
      
    - automatic document fit including page width, page fit, and automatic   
    
    - table of contents view
    
    - search
    
    - jump to page
    
    - page spreading where you can see two pages at once.

## htmlviewer  
 
This is a simple app for viewing HTML documents as captured pages.  It functions
by storing pages in an 'iframe' and just loads one major page.

It does NOT have the same features as pdfviewer and is MISSING:

    - thumbnails of pages on a sidebar so you can page down and see pages before 
      you've switched to them

    - automatic document fit including page width, page fit, and automatic   

    - table of contents view (mostly because HTML doesn't really have a ToC)
    
    - search (but I think this is straight forward to add)
    - jump to page (because there's only 1 page in an HTML file)
    - page spreading where you can see two pages at once. (because there's only 1 page in an HTML file)

# strategies

This leaves us with a few strategies.

## force an implementation with htmlviewer

We could work on a proof of concept that renders in the '.page' element in the 
htmlviewer.

this would mean we lack the same features that the htmlviewer lacks (see above)

We could implement this as just a single rendered page and place nav buttons
in the UI to jump to the next page.

It would be a baby step but could get us there.

It would require finding a decent ePub library that just did rendering to an 
element and allowed us to control it via 'next page', etc.

We will also probably have to update the annotation code to stick the annotations
in the right place but we might get lucky and find it works similar to the way
we handle annotations with pdf.js

## build a new react-based viewer for both epub, pdf and html

We could build a new viewer with a plugin format for the docs.  The plugin 
would need operations like:

 - getNumPages - get the total number of pages
 - getDocDetails - return metadata about the doc including title, url, etc. 
 - renderThumbnail - render a thumbnail to a canvas element
 - renderPage - render a page to a given element
 - getTableOfContents

Then we would of course have to build a react viewer for hiding/showing the 
sidebar, table of contents, pagination, and everything that's currently 
in pdfviewer.
