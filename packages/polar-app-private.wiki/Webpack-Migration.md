- ALL CSS and <script> moved to Firebase and not referenced in index.html
- how are we going to do source maps?  
- I need to have a solid development environment including hot reload
- needs to support debugging
- the electron build should use webpack too.
- I need an environment like create-react-app which just hosts the webserver
- ability to toggle dev mode?
- we need to have a harness loader that shows that the newest webpack is being 
  downloaded
- I'd like to have some sort of automatic code splitting but I have to use
  promise based loading to get that. I might have to use some sort of transformer
  to get that to work.
