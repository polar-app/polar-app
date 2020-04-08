List of required features we need in the viewer to replace the current viewer

- the sidebar filtering doesn't work at all.. 

- pointer-events are still enabled on text-highlights for some reason and not
  sure why.  If I enable them I need SOME way to enable the popover/interaction
  with the text highlight/annotations though.   

- Fix the side of the input in the menu bar.  

- make sure auto-pagemarks work

- blur the items that are being selected / focused when escape is hit?

 -sidebar width/height needs to be remembered per machine including toggle/expose.  
  I think that should just be a width... Maybe do the type of sidebars that are 
  on intellij with the vertical labels that can be clicked on?

 -full text search totally working
 -sidebar rendering and reading the PDF from the datastore.

 - mobile and tablet nodes that disable the sidebar when in
 - properly center the zoom scale information at the top of the page
 -blur the input after changing them.. 

 -zoom/scale changes
 
 - handle the dock resize issues with text/fonts being selected 

 - Make sure debouncers are everywhere and not insanely slow

 -implement all pdf keyboard shortcuts. 
// https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#what-are-the-pdfjs-keyboard-shortcuts


 -context menu
    - create pagemark to point
    - create area highlight / including resize
    - 
    
 -area highlights

 -get annotations placed properly when the pdf viewer pages are activated/deactivated

 -get find working

 -resize of the doc layout... 


 -context menus... 

 -key bindings
 -area highlights

 -full screen mode without a navbar...
 -sidebar that can be toggled on and off with the pdf width
// adjusted
 -load the docMeta to determine what doc to load and listen
// for changes
 -the sidebar / annotation bar needs to work.
 -dark mode for the PDF (needs changes to pdfjs)
 -verify that it works on mobile...
    // FIXME the PDF version of this viewer doesn't seem to handle CPU
    // properly and continues to composite this on the GPU using 100%
    // of resources while scrolling.  This is probably the issue we
    // had with react-pdf

    //
     -it seems that chrome with pdfjs tends to run
    // "composite layers" too often.  Not sure why.

 - DONE: jump to page number... 
 -context menu working

// DONE : get the ActiveSelections / annotation bar system working ... 
// DONE: when a PDF is being downloaded we need to track and show progress.
