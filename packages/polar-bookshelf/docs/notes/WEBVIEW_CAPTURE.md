- I can't implement the WebView capture properly because I don't have access 
  to the WebContents.
  
    - I could make the webview work via a preload and then have it control its
      own operation and behavior and then. 
      
    - I might also be able to use my reactor there too... It's just that the
      driver would need to send the response.  I really hate how I can't use one
      process for all this work.   

    - I could call this from the root frame and all child-frames ... 
        - https://stackoverflow.com/questions/9249680/how-to-check-if-iframe-is-loaded-or-it-has-a-content

https://github.com/electron/electron/pull/11607/commits/88b887fe47812a3013a2d584e64bd9adca8dad07

and intend to stay there).
 [spellchecker]: https://github.com/atom/node-spellchecker	[spellchecker]: https://github.com/atom/node-spellchecker
 ### `webFrame.getFrameForSelector(selector)`
 * Returns `WebFrame` for the frame element in `webFrame's` document selected by
  `selector`
* Returns `null` if `selector` does not select a frame or if the frame is not in
  the current renderer process.
* `selector` String - CSS selector for a frame element
 ### `webFrame.findFrameByName(name)`
 * Returns `WebFrame` - a child of `webFrame` with the supplied `name`
* Returns `null` if there's no such frame or if the frame is not in the current
  renderer process.
 ## Properties
 ### `webFrame.top`
 * Returns `WebFrame` - top frame in frame hierarchy to which `webFrame` belongs
* Returns `null` if top frame is not in the current renderer process.
 ### `webFrame.opener`
 * Returns `WebFrame` - frame which opened `webFrame`
* Returns `null` if there's no opener or opener is not in the current renderer
  process.
 ### `webFrame.parent`
 * Returns `WebFrame` - parent frame of `webFrame`
* Returns `null` if `webFrame` is top or parent is not in the current renderer
  process.
 ### `webFrame.firstChild`
 * Returns `WebFrame` - first child frame of `webFrame`
* Returns `null` if `webFrame` has no children or if first child is not in the
  current renderer process.
 ### `webFrame.nextSibling`
 * Returns `WebFrame` - next sibling frame
* Returns `null` if `webFrame` is the last frame its parent or if the next
  sibling is not in the current renderer process.
