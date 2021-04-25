Initial design of storing books as polar documents.

# Problems
    - how do I turn on the print stylesheet by default?  I could rewrite the DOM.
    -


# Requirements

- No javascript execution required.  the documents are pre-rendered inactive DOM
  documents.

- The pagemarks should be full screen and attached to elements by their offset
  after being rendered.

- How do we want to handle reflow?  Should I just 'scale' the document instead
  of increasing the viewport?

- BrowserWindow on electron supports width+height + zoom on webPreferences...
  if I can dynamicially change the zoom I can have a fixed width presentation
  like we do with pdf.js...

    - the problem is what is the DEFAULT width we should use?  maybe 1280

    - I could create a basic/skeleton electron app to test this hypothesis...

- one other issue is what are 'pages' like in HTML / DOM land?  I could just assume
  the "height" is the page. So if the viewport is 1280x1024 then a 'page' is
  1024 so a a pagemark would just be that size...

    - https://ourcodeworld.com/articles/read/547/how-to-change-the-window-zoom-level-in-electron-framework
    - https://stackoverflow.com/questions/34905539/electrons-browserwindow-zoomfactor-can-be-changed-after-construction-and-how-t


- We could have an 'anchor' element fixed point to handle reflow.

- I don't think viewport hacking will actually fix this problem as chrome
  doesn't yield to the viewport I think.

- we can use 'express-zip' to serve pages directly from a zip file.

    https://www.npmjs.com/package/express-zip
