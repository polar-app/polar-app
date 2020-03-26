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
