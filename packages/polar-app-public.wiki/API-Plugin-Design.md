# Goals

- the entire API is implemented via message passing

- allow 3rd party developers to tie code into Polar.

- provide 3rd party developers with a high level API that allows them to avoid
  having to work with react. We ship APIs to allow them to create buttons, etc.
  
    - images are passed as data URLs to SVG
    - onClick handlers are implemented as message factories to create a new
      message which is then sent out.
      
- there are hooks to generate buttons and messages to generate when the buttons
  are clicked.  The API creates the MUI components directly in the UI and they can
  be removed too.  This prevents you from having to deal with MUI or React.

- initially there are just going to be hooks to add new buttons and menu options
  and a framework to perform sync once that's implemented.

- plugins are discovered by scanning .polar/plugins/*.zip.  Each .zip is opened
  and an index.js file inside is evaluated.
  
- for security reasons. plugins will only be supported in the desktop app.
    - we might bundle some extensions by default and in the webapp if we can
      identify/validate the publishers.
