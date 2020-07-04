- TODO: 

    - we have to publish packages first
    - then npm install them on the release
        - downside of this is that we have a LOT of package incrementing and its
          slow and annoying with lerna
    - I'm not sure if it's really practical to get the whole thing to webpack. 
      Express won't webpack which is a problem but maybe I could upgrade express
      dependencies.    
    
   - I get errors when starting up the webpack version... 
   
   - I could use:
        https://github.com/evanw/node-source-map-support
        
     - but this is, yet again, another thing to support.
        - it would probably be BETTER to have our electron build just a way 
          to host the PWA/webapp and basically be a wrapper binary.

    - I *think* I could just make the electron app load from the site directly.
      It would basically be a wrapper JUST around the PWA and would not need
      anything special.  The PWA would be cached locally.
      
        - What glue would I need?
            - how do we open new windows?
            - the latest electron supports this:
                window.open('https://github.com', '_blank', 'nodeIntegration=no')
            - we won't be able to do recursive directly downloads
            - we would only need to push the new version of the app on new
              version with new versions of electron
             
            - no webserver would be needed as the first time it loads it will 
              pull down all dependencies.  We just need to make sure it works
              the same way as it does in the browser - which it should!
              
         - how do we handle screenshots? If we are just doing canvas images 
           and PDF canvas we should be ok - including on Android/iOS
      
         - we would have to have a way to detect that we're running with
           electron in the browser and we would NOT have a dedicated
           electron-renderer build so that might be difficult. 
           
         - Anki sync wouldn't run!  I think that would be the main issue.  
         
         - No IPC either.
            - I can search for all IPC uses and remove them  
         
         - No filesystem access for recursive imports.

         - security would be improved too... 
