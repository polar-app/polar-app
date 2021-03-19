
# Overview

Right now we use a HTML editing control called 'summernote' that allows 
the user to create text / html in a WYSIWYG editor.

It *does* support Latex via a more "primitive" plugin system bug we might want
to look at something else.

# Requirements

- We should decide on Katex or MathJax and which one we like best.  This will
  influence which libraries we use that support Latex.

- The Latex support should use a 100% Javascript framework like Katex or MathJax.
  It MUST not support any type of server-side rendering because then it won't
  work in our desktop app. 
  
- We should consider supporting / migrating to Markdown + Latex and *maybe* 
  WYSIWYG editor but I think markdown might be better.

- We should be able to have cloze deletions in the Latex like we have in Anki.

- The serialization of the output needs to have support for identifying what 
  part of the HTML / markdown / content is in Latex so that it's not just a 
  "blob" of HTML.
  
- Summernote might be a plan B as there's a plugin that supports latex which we
  could consider using if migrating to markdown/latex looks difficult.
  
- IF we ARE going to go with Markdown it would be nice to find the BEST markdown
  library in Javascript.  Ideally the library dependencies for this should be
  minimimal as too many libraries means bloat and conflicts with our current
  libraries.
  
- Any *new* system we support would IDEALLY have Typescript bindings and have
  proper node module/npm packages.  Otherwise supporting these in our framework
  will be a bit difficult.
  
- We need to document what's required to sync to Anki as their Latex support
  needs to be escape I think and I believe they use $$ but I'm not actually
  certain.
