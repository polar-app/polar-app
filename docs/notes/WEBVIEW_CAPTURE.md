- I can't implement the WebView capture properly because I don't have access 
  to the WebContents.
  
    - I could make the webview work via a preload and then have it control its
      own operation and behavior and then. 
      
    - I might also be able to use my reactor there too... It's just that the
      driver would need to send the response.  I really hate how I can't use one
      process for all this work.   

    - I could call this from the root frame and all child-frames ... 
        - https://stackoverflow.com/questions/9249680/how-to-check-if-iframe-is-loaded-or-it-has-a-content
