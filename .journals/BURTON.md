# 2020-02-27

Trying to determine where to resume my coding. I think I can have the DOM 
string search code working soon and also use JSDOM to test this without having
to use the browser.

## placing highlights in HTML

This has some sample code for working with highlights by showing them in the UI 
directly with minimal DOM interaction. 

/Users/burton/projects/journal/2020/02/test-shadow.html

## search within DOM

this is some example code that allows us to search within a DOM for text.  We
should port this to JSDOM within Polar so that I can make it work in production.

/Users/burton/projects/journal/2020/01/test-search-within-dom.html 

## new package

.. created new package **polar-dom-text-search**

- the code here isn't complete or tested yet.  I need to implement more of the 
  core operations like join and search but I think the index is created now.

## EPUB is working

- ... work on this in the background ... it IS rendering to a single page now
- I need to build a new viewer for it because we only have our htmlviewer and 
  pdfviewer and this one doesn't work properly
  
- also I need some sort of table of contents for the document and navigation 
  for the ToC
  
- instead of a VIEWER maybe we just make it a fully fluid webpage.  I think that
  might be better!
  
    - FIXME what about the sidebar? use the same web sidebar style in the browser.
    
    - FIXME: OR inline annotation and improve upon that... 
    
- I have the basic epub loader working but I need some way to change 'chapters

- Do we need to have nrPages and how do we handle that?  each 'chapter' should be 
  a page for now?

# PREHISTORY

- We have a new EPUBViewer that basically can RENDER to a single page but we 
  have to dramatically improve it to make it work in production.  
