- The main browser doesn't have access to my secondary authentication tokens 
  under my main account. I don't like that.  It's not the end of the world 
  though.

- authentication credentials don't seem to be remembered
- I do NOT like the auth flow... it seems super slow.  

- TODO: before I continue

    - VERIFY 100% that I can properly login with a regular user/pass because
      if this isn't possible this entire solution wn't work.

- new design:

    - NO authentication in the chrome extension

    - generate a CSRF in the web app on signin that can be validated in the app

    - do POST of the data on the server? I don't like this.  I'd rather embed
      the firebase datastore in the client ... but if it's slightly more work
      I guess it's not the end of the world.

    -     

- Send a message to the content script as a daemon
    - create-preview...
    - send message to the popup to send the data to polar...
    - then open the final document in polar...
        - 
    - DONE: create an epub from the metadata including docMeta and send it to the server
        -
        - this is like a day...
    - connect to firebase with noInitialSnapshot
        - 2-3 hours
    - include image and HTML metadata in the epub.
        - 1 hour
