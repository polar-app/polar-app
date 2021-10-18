 - determining where to place anchors
 
     new EPUBCFI(element).toString();
     
     // should generate an epubcfi string
     
     


  - https://github.com/futurepress/epub.js/issues/277
        
        You can listen to book.on('renderer:selected', function(range){ }) to get the selection when it happens.
        Alternatively you could call book.renderer.render.window.getSelection(); to get the selected content.
        
        Once you have the selection you can get the cfi with the following:
        
            var epubcfi = new EPUBJS.EpubCFI();
            var cfi = epubcfi.generateCfiFromRange(range, book.renderer.currentChapter.cfiBase);
        Should probably add a method to pass that event as a cfi.

    - EpubCFI.fromNode
    
        - it's unclear how to jump from a CFI string to find the node but I can
          find the range

    - use a regular react portal but add the context listener with window.addEventListener 

- THREE main things I need to do for EPUB pagemarks
    - get the context menu to work in the EPUB document
        - for now don't worry about the CSS as I could inject that myself 
          manually
    - Ability to right click and determine the EPUB CFI that was selected
    - New pagemark strategy for mounting pagemarks based on the EPUB CFI
    
- 

TODO: 
    - the entore epub is ONE element because it's all br ... so I can't use 
      this properly... 

    - http://idpf.org/epub/linking/cfi/epub-cfi.html#sec-path-terminating-char
    
        I think I might have to take the event, and make a 'range' for it
        and then select that RANGE and make it  into a CFI... 
        
        - I could compute elementsAtPoint?? 
        
        
        
document.body.addEventListener('click', (event) => {
    const range = document.getSelection().getRangeAt(0);
    console.log(range);
})

document.body.addEventListener('contextmenu', (event) => {
    const range = window.getSelection().getRangeAt(0);
    console.log(range);
})


- remaining issues:

     - all pagemarks display no matter what the page numbers is.
     
     - no ability to resize and re-anchor them to another point.
     
     - the pagemarks go outside of the 'body' which has padding now..
     - 
