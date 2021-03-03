# Design

    - use the pdf.js capture to take screenshots of the canvas.   This does
      not include any annotations
      
    - Use Electron + WebContents#capturePage to work with PHZ files.   This way
      we can work with canvas elements witin HTML.  
      
        - this would be super ugly to impelement though because it would use two
          contexts. 
      
        - I could just ALWAYS do it in the main context though.  This way the 
          renderer isn't involved.
          
        - this functionality is rather difficult to implement so I need to decide 
          if it's actually worth it... 
          
        - can I 'capture' a webview window this way? If it's possible to capture 
          the entire thing because it's 'visible' that would be interesting.
          
        -  
      
            

# https://www.npmjs.com/package/html-screen-capture-js

# https://html2canvas.hertzen.com/

- that doesn't support SVG bug we could clone the node + style and replace
  all the ```<img>``` and SVG data with canvas binary rendered SVG content which we
  convert to PNG with the same dimensions.

# Annotations:
 - how do I hide/show annotations when trying to capture the page without a flicker?
 - 
 
# Electron
 
We can call this to capture the page.
 
https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentscapturepagerect-callback
