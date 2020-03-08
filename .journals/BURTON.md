# 2020-03-06

- I worked on the SEO system so that everything has a unique slug and we 
  will also fetch from arxiv so that we can pull in a summary of a document too.
  
- I think we're going to use the Google PubSub system to handle a queue of items
  that need to be processed.  They have a simpler queue system that allows us
  to do HTTP POST to our cloud functions.  
  
    - These have a 9m max timeout which is more than enough time to execute
    
    - https://cloud.google.com/functions/docs/concepts/exec#timeout
    
    - docPreview
    
    npx gcloud functions deploy docPreview --timeout=9m
 
    - unfortunately, it seems difficult to change the timeout and I received an error:   

        ERROR: (gcloud.functions.deploy) OperationError: code=3, message=Build failed:
        {"error": {"canonicalCode": "INVALID_ARGUMENT", "errorMessage": "`npm_install`
        had stderr output:\nnpm ERR! code ETARGET\nnpm ERR! notarget No matching version
        found for polar-backend-shared@^1.90.35\nnpm ERR! notarget In most cases you or
        one of your dependencies are requesting\nnpm ERR! notarget a package version
        that doesn't exist.\nnpm ERR! notarget \nnpm ERR! notarget It was specified as a
        dependency of 'polar-hooks'\nnpm ERR! notarget \n\nnpm ERR! A complete log of
        this run can be found in:\nnpm ERR!    
        /builder/home/.npm/_logs/2020-03-06T19_00_15_065Z-debug.log\n\nerror:
        `npm_install` returned code: 1", "errorType": "InternalError", "errorId":
        "1E8DF1C2"}}
    
        - but I think think its just because I need to deploy functions again
          at which point I can change the timeout

- zettelkasten + roam would require linking to cards.  We can do that but I would
  have to improve suppot for it.
  
## NOT MOBILE FRIENDLY

- Google thinks our pages are not mobile friendly

    https://search.google.com/test/mobile-friendly?utm_source=gws&utm_medium=metaline&utm_campaign=notmobilefriendy&id=DFoGC1MSyqDXbsz23K3FNQ&view=fetch-info  

    - this is because the pre-render doesn't exacute Javacript and then our CSS
      width of the page is not adjusted.
  
## TagsDB 

    - DONE: I have a new UserTagsDB which merges user tags with the new write
      through system so that we can have ONE view of tags at a high level.

    - DONE: need to update the UI in the annotation sidebar to support tags
      for annotations.

    - DONE: migrate the EXISTING tags... 

    - DONE: The spacing in the document repository is broken due to the tag button I think

    - DONE: the annotation repo does NOT properly filter by tag when they are
      applied to the annotations.

    - TODO: I need to implement deletes and removing all the tags on all the
      docInfos and annotations and then persisting things back out.

    - Should flashcards have tags?
        - Should objects inherit the tags of their parent?
        
    - Should comments have tags?

    - If I add a tag to a doc in the repository, the tags in the viewer are not 
      updated.  

    - The viewer doesn't seem to get any updates from firebase.  We will have to 
      figure out how to unify this datastore with the disk datastore.

## Things to test:

    - If I update the tag on the doc, make sure all the dependent annotations 
      update as well.
      
    - make sure migration of user tags works without cloud sync being used
    
            
        
      
# 2020-03-04

## TagDB design

- getTagDB method in PersistenceLayer which is updated for every doc write via
  DefaultPersistenceLayer 
  
    - I forget where the main tags are kept now when the user creates one manually.   

    - If I can unify these easily I think the whole system would work.
    
    - We will ALSO have to do it when reading snapshots as new tags could be 
      present which need to be updated because the *local* machine could be 
      out of sync with the cloud.  
      
      - if this whole system executes in a few ms it won't matter from a 
        performance standpoint. 
        
        - I think the existing system is done via PREFS for our tags.  
        
        - I think I can put this into the init() method and add a snapshot listener
          and it would be updated on loading the docMetas and when writing them 
          too...  

# 2020-03-03 

- worked on revamping the annotation viewer so we can have full record
  manipulation within the viewer.  I can DELETE now and properly update the UI
  but I have to continue working on full manipulation like we have in the 
  sidebar.
  
  - The main issue I have is that we're using IDocAnnotation and not
    DocAnnotation and I need to have children and other methods supported.

  - one of the MAIN things I need now is the tag manager...
   
    - We have SharedDocTags and SharedAnnotationTags BUT I have to handle 
      deletes properly in the UI but that's really not THAT hard to do.  
      
      - I just have to sit down and figure out EVERY place I create/delete tags
        and make sure we have a coherent backing.
 
- We have the following half implemented features that we should probably resume
  work on:
  
    - cloze deletions do not work right now in polar???   
        - create new account, with just one doc, and one cloze, and then test it
        - 
        

# 2020-03-02

new metadata.mutations package in polar-shared including:

- CommentMutations
- FlashcardMutations 
... and other mutation objects too.

which should allow us to delete and update flashcards by just the flashcard 
and the docMeta so that we can easily update in the UI and commit back to 
the datastore.  

... I need these for area, text, comment and flashcards and I think I just have 
to get them to work properly with the web + cloud datastores so that the UI 
updates in the local datastore.

# 2020-03-01

I'm going to build a new framework to give us an annotation bar that's isolated
from the main code.  This way I can dock it into the chrome extension and then 
have web annotation, a basic sidebar (as a new component), and a new pagemark
system for keeping track of your reading.

# 2020-02-29

- had bad insomnia but worked on the annotation viewer.  There is a bad bug
where the annotation bar comes up in the wrong place because the selection
bounding client rect is wrong.  It's a race condition that goes away after 300ms.
I might want to just ignore it though.  


# 2020-02-28

I need to work on the DOM text index algorithm and then port the text overlay 
code into Polar so it's ready to display the text highlights.

- The DOMTextSearch functionality now seems to work. What I now need to do is
  port over the highlighting code so that I can verify thatI can both SEARCH
  and highlight and then we should build a basic UI to perform highlighting 
  directly.   

- I have the new DOM text stuff working... so now I need to figure out how to 
  get the text highlighter to work... 

- the epub viewer is writing to an iframe.  This kind of breaks our viewer 
  in that:
    - the annotation highlighter won't work
    - the DOM text overlay algorithm won't work.

# 2020-02-27

Trying to determine where to resume my coding. I think I can have the DOM 
string search code working soon and also use JSDOM to test this without having
to use the browser.

## placing highlights in HTML

This has some sample code for working with highlights by showing them in the UI 
directly with minimal DOM interaction. 

/Users/burton/projects/journal/2020/02/test-shadow.html

## search within DOM

this is some example code that allows us to search within a DOM for text.  We
should port this to JSDOM within Polar so that I can make it work in production.

/Users/burton/projects/journal/2020/01/test-search-within-dom.html 

## new package

.. created new package **polar-dom-text-search**

- the code here isn't complete or tested yet.  I need to implement more of the 
  core operations like join and search but I think the index is created now.

- the basic DOM text search stuff SHOULD work but I now need to write unit tests
  for it to verify real world behavior.  I should use JSDOM for this since 
  this is the easiest way to reliably test this functionality.
  
## EPUB is working

- ... work on this in the background ... it IS rendering to a single page now
- I need to build a new viewer for it because we only have our htmlviewer and 
  pdfviewer and this one doesn't work properly
  
- also I need some sort of table of contents for the document and navigation 
  for the ToC
  
- instead of a VIEWER maybe we just make it a fully fluid webpage.  I think that
  might be better!
  
    - FIXME what about the sidebar? use the same web sidebar style in the browser.
    
    - FIXME: OR inline annotation and improve upon that... 
    
- I have the basic epub loader working but I need some way to change 'chapters

- Do we need to have nrPages and how do we handle that?  each 'chapter' should be 
  a page for now?
  
- I finished up the BASIC loader for EPUB including the metadata. Now I have to 
  work on:
    - area highlights using the new inline-text layout algorithm
    - some sort of sidebar for the annotations 
    - 

# PREHISTORY

- We have a new EPUBViewer that basically can RENDER to a single page but we 
  have to dramatically improve it to make it work in production.  
