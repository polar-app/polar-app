
# Resize Bugs / Tests

- load two PDF documents , make sure we can switch back and forth between them.
- load two PDF documents , resize the window, make sure we can switch back and forth between them.
- load a PDF and an EPUB, switch back and forth, make sure there's no overflow and EPUB doesn't 
  lose scroll position when we swap back and forth 
- make sure PDFs repaint after we switch to them on scroll
  
## Bugs Encountered
    - sometimes when going back and forth between PDFs parts of the canvas aren't repainted.
    - EPUBs lose their scroll position on chrome due to display: none losing it. 
    
## Solutions to hiding and incompatibilities

    - display: none will not work with EPUB because it loses scroll position
        - I might be able to persist that

    - position: absolute and placing it off the screen breaks it us too as PDF.js gets confused about the 
      width of the items.

## Remaining bugs 

    - EPUB highlights aren't re-rendered until we scroll them again... 
