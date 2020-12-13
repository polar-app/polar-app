
# Key Actions and Behavior that need to be tested

    - delete between new notes that are full will join them
        - we don't need to do aything other than joion the markdown into a new / updated note
        - we're going to have to create a selection over a range
            - HOW?
        - then copy it to HTML
            - HOW?
        - then insert the new HTML
            - HOW? 
            

    - TODO: when deleting a node, selection the previous one, and position the cursor properly.
  
    - enter / new node creation
  
        - enter in the middle of a node should split it and create a new node below it.   
        - DONE: enter at the beginning should insert a node before
        - DONE: enter at the end should insert a node after 
  
    - when at the end of the note, if we arrow right, then we have to go to 
      the beginning of the next note.
  
    - when at the begginning of the note, if we arrow left, then we have to go
      to the end of the previous note.
      
    - shift+tab needs to indent
    - tab needs to indent the node


- Do the HARD input tasks first so I don't get into a swap of code.

    
    - HARD: when clicking on a node for the first time when activating it the cursor jumps to the beginning
        - the problem is that the cursor isn't placed in the right spot... to begin with and 
          has no correlation with the jumpToEditorStart


# BUGS

    - If the selection is active, when we delete content, don't delete the note too
        - the seleciton in either ckedoitor AND the main browser seleciton isn't
          working and showing it's collapsed
    
    - can not delete the previous node if the current node has text in it... this is part of the join operation


    - when creating NEW node references, we don't register the anchor handler so clicking on them brings up the 
      ckeditor link handler. 

    - how are we going to handle copy/paste of notes and multi-selection since we're interacting with ckeditor
      AND the browser DOM.
        - one strategy is to just deal with the link clicks directly so that if the user highlights multiple nodes, 
          then we select them.
          
            - workflowy doesnt' allow you to copy partial ones... 
  
    - Deleting the first empty node in the root does not cause the root to be selected
    

    - when changing nodes, the root seems to stay the same... and the node title
      doesn't seem to change. 

# Ideas from other Note Taking Platforms 

    - need to support #headline I think...
        - we have to set line-height: 0 to get this to work... 
        
    - the OCR in evernote is cool because it can accept and search ANYTHING you
      throw at it.
    
    - notion supports basic kanban boards.
        
    - notion's little 'drag' button is also the context menu and I actually
      think this is a better idea

    - notion has icons and covers for notes which I think is pretty slick... 

    - Cornell note taking system
       - the idea is that you put your notes on the left and questions on the right
       - his idea is that you put the answers under bullet points
       
   - this is the spaced repetition timestamp
        - https://youtu.be/ONG26-2mIHU?t=659
       
   - TODO: watch this too:
   
        - https://www.youtube.com/watch?v=ukLnPbIffxE
   - TODO: buy a book "Make it Stick" - "The Science of Effective Learning"
   
   - notion supports 1000 free blocks.
   
   - .edu plans automatically qualify..?
   
   - notion gave away 1000 coupon codes... 
   
   - TODO: 
        - find the paper referenced in this video: 
        
            https://www.youtube.com/watch?v=ukLnPbIffxE
        
        

# FEATURES
    - how do we do named notes because we need to constrain the characters here
      because we can't accept images, video, complex formatting, etc
        - ckeditor without formatting so that the code doesn't have to be different?
        - either that or just <textarea> but also some characters can't be used like [ and # ... 
    - shift+tab needs to unindent
    - enter between a node should split it...
    - backspace at beginning of the node should join it

# MVP.1


    - 4h:  basic workflowy style outline manipulation
        - tab indents the current item
    - DONE: image paste
    - 2h: inbound references
    - DONE: click the bullets next to links to jump to a new node
    - 2h: ckeditor activation working

    total: 8h 

- MVP.2
    - 1h: breadcrubs with path during navigation... 
    - 1h: block references (ability to link to another note by just the ID)
    - 2h: note selection via shift+ArrowUp , and shift+ArrowDown
    - 1h: correct image size...
    - 2h: action menu properly completed
        - [[]] working  
   
   total: 7h
   
- MVP.3
    - 4h: all core roam + workflowy context + keyboard operations.
    - 3h: basic backend persistence

    total: 7h

- MVP.4
    - 3h: proper handling of undo/redo
    - 2h: drag notes around...  
    - 1h: multi-line notes with shift+enter
        - ability to enter 'editing' mode so you can make a node multi-line    

    - total: 6h
    
    
    - /table support
    - exports of data

- The app is too slow now... 
    - consider trying to figure out how to restore the cursor position with ckeditor5 by having a toggle.


- main tasks:
    - 
    - we should work through now is to get the workflowy-style navigation working
    - fix images



- don't keep the [[]] IN the DOM... show it via CSS with before and after 

-   

- finish up the node selection action

- the action system has the following issues
    - we have to read FROM the text because if we don't 
    - and the user places a mouse back down it won't resume properly

- ckeditor performance now really really sucks. It's what's taking 1 second to
  render. It seems to be a regression with our custom build I think.

- if we type wiki-style syntax it's not incorporated properly
    [Canada](https://www.example.com)

    - it gets escapes as \\[foobar\\](https:///www.example.com)

- what do we do about markdown double [[]] when linking. It's not supported by ckeditor5...
    - 

- test all markdown features...  


- update 'links' properly as they are created including when the user completes the note manually.
    - how do I update them if the nodes are typed in manually 
        - DO NOT update it on the action, just update the text but use a markdown parser on the result
          to update the text
        - plus this means we can exec these on the serverside too. 

- make the note name or content but not both
- ckeditor bubble mode working properly
- ckeditor classic vs bubble mode toggler
- proper arrow/tab naviation
    - when a note is empty, and you hit delete, delete the note
- when inserting an image with an HDR display, use the right dimensions.


- we need some sort of background saving function so that we're constantly persisting what the user types
  while they're using the app.... 

- undo will be required

- performance issue when going back... (maybe it's useHistory)

- proper tabbing like with workflowy

- make ckeditor tasks 

    - DONE: click on and abort clicking a link

    - DONE: editor mode vs bubble mode and the ability to switch between them
        - I *think* we can do it but not until I do a proper ckeditor build

    - Try to complete AND type the input that we're reading so that I can filter the actions the user 
      is taking
      





  

https://github.com/ckeditor/ckeditor5-angular/issues/110


    - FAIL: write one pag with a bunch of ckeditors to see if we can make them
      faster... maybe it's a plugin or something.
        - this doesn't work... It seems that there's an inherent performance issue