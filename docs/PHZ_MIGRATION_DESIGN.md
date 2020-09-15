- Trigger a URL to be migrated by opening up
    beta.getpolarized.io/migrate-phz?id=12345
    
    where id is the docID of what we want migrated


# Algorithm

- Is the chrome extension installed?
    - redirect to the site, verify the chrome extension is installed first.
    - if not installed, redirect to chrome extension install URL
    
- Send a message to the chrome extension that it should begin capture and take 
  the URL we give it and start the migration... 
    - FIXME this is heavy weight and I don't necessary like it... 
    - we could send it DIRECTLY the metadata we need to save with the .JSON 
        - JUST send the text annotations and comments on them
        - OR we could fetch the doc but that would/could be slower
            

# TODO

- TODO starting the whole repository app seems like it would be slow but this 
  process isn't done very often ... 

- I can set localstorage keys for the site but NOT for the chrome extension because
  they use different origins????
  
  
- existing document will be deleted? or overwritten?  would be nice to preserve
  the original though so we can re-migrate if necessary.
  
- pagemarks will be lost 
    - compute a percentage pagemark and create that... but there's no anchor 
      point unfortunately. 
  



