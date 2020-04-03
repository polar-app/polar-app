- use react-pdf ?

    https://github.com/wojtekmaj/react-pdf

- react-pdf-sample has a demo using react-window

    https://github.com/michaeldzjap/react-pdf-sample

- we use 2.2.228 and so does react-pdf but we want to upgrade to the 
  latest so I might have to fork this in the future.  That and 
  it doesn't support typescript.

- there is a @types/react-pdf but it's slightly out of date

- going with something like react-pdf might be better anyway especially  
  if I webpack the full thing

- the problem now is that if I import react-pdf it won't compile due to module 
  dependency issues. Maybe for now I need to have my OWN @types/pdfjs-dist 
  which would replace the one in npm and that way I can have a custom version
  of the bindings which is more correct.

- now the problem is that react-pdf and our version of Polar do not cooperate 
  and are running different versions of pdf.js

- I think I should fork react-pdf to polar-react-pdf and make my changes
  there so that I can post the packages ot npm and then give the changes 
  to npm repo

- if I want to revert to using the new windowed version I have to add the following
  to packages.json
  
      "polar-react-pdf": "^1.100.8",
      "@types/polar-react-pdf": "^1.100.8",
      "react-window": "=1.8.5",
      "@types/react-window": "=1.8.1"


- I'm now using my own custom pdf build and pushing it to github.  I think this
  is by far the best way to do that. 

- The viewerContainer needs to be overflow: auto, absolutely positioned, and use
  a rendering queue.  Otherwise ALL pages are loaded
  
- dark mode *sort* of works in PDF.js but 

- going back and forth between my fork and 2.2.228 ... 

    "pdfjs-dist": "~2.2.228",

    "pdfjs-dist": "https://github.com/burtonator/package-polar-pdfjs-dist.git",


        // Make resize of the 

        // FIXME: get annotations placed properly when the pdf viewer pages are activated/deactivated

        // FIXME: get find working
        
        // FIXME: resize of the doc layout... 

        // FIXME : get the ActiveSelections system working ... 
        
        // FIXME: context menus... 
        
        // FIXME: key bindings

        // FIXME: full screen mode without a navbar...
        // FIXME: sidebar that can be toggled on and off with the pdf width
        // adjusted
        // FIXME: annotation bar working
        // FIXME: load the docMeta to determine what doc to load and listen
        // for changes
        // FIXME: the sidebar / annotation bar needs to work.
        // FIXME: dark mode for the PDF (needs changes to pdfjs)
        // FIXME: verify that it works on mobile...

            // FIXME the PDF version of this viewer doesn't seem to handle CPU
            // properly and continues to composite this on the GPU using 100%
            // of resources while scrolling.  This is probably the issue we
            // had with react-pdf

            //
            // FIXME: it seems that chrome with pdfjs tends to run
            // "composite layers" too often.  Not sure why.

        // FIXME: jump to page number... 
        // FIXME: context menu working

## PDFViewer

 - have to use a manual sidbar configuration.
 - the main app uses CSS transforms to add left and right padding to place
   sidebars via absolute positioning... I don't think I have the option to use
   flexbox here... 
 

## PDFPageView 

- it IS exported as a symbol
- I can make it use SVG by specifying render as 'svg'
- I *think* PDFFindController CAN be used with pages if they share the same
  document and EventBus but I should verify. 


### Open Issues

    - what 'container' should I use??? 

### PROS
    - no weird use of portals to make this work
    - no overflow or position CSS required
    - 
    
### CONS

    - The MAIN issue is that 'find' doesn't work properly and with unrendered 
      pages I'm not sure how this would even work properly... 

    - I don't know if the find controller works
    - I would have to use react-window to page through large numbers of pages
    - not sure if text layers would work.
    - I think I will still have to compute scale
    - Might have to deal with hidpi displays but have to do that anyway
    - I have to research the IDEAL way to do react with items that write to the
      DOM directly

# Dock Issues

    - I could implement a NEW type of doc that doesn't use overflow itself but 
      instead uses absolute positioning and margins work properly, similar to 
      how pdfjs works... 


## Bugs Effecting Us

https://github.com/mozilla/pdf.js/issues/11626


