- use react-pdf ?

    https://github.com/wojtekmaj/react-pdf

- react-pdf-sample has a demo using react-window

    https://github.com/michaeldzjap/react-pdf-sample

- we use 2.2.228 and so does react-pdf but we want to upgrade to the 
  latest so I might have to fork this in the future.  That and 
  it doesn't support typescript.

- there is a @types/react-pdf but it's slightly out of date

- going with something like react-pdf might be better anyway especially  
  if I webpack the full thing

- the problem now is that if I import react-pdf it won't compile due to module 
  dependency issues. Maybe for now I need to have my OWN @types/pdfjs-dist 
  which would replace the one in npm and that way I can have a custom version
  of the bindings which is more correct.

- now the problem is that react-pdf and our version of Polar do not cooperate 
  and are running different versions of pdf.js

- I think I should fork react-pdf to polar-react-pdf and make my changes
  there so that I can post the packages ot npm and then give the changes 
  to npm repo

- if I want to revert to using the new windowed version I have to add the following
  to packages.json
  
      "polar-react-pdf": "^1.100.8",
      "@types/polar-react-pdf": "^1.100.8",
      "react-window": "=1.8.5",
      "@types/react-window": "=1.8.1"


- I'm now using my own custom pdf build and pushing it to github.  I think this
  is by far the best way to do that. 

- The viewerContainer needs to be overflow: auto, absolutely positioned, and use
  a rendering queue.  Otherwise ALL pages are loaded
  
- dark mode *sort* of works in PDF.js but 
