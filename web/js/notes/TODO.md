
# Key Actions and Behavior that need to be tested

    - when changing nodes, the root seems to stay the same... and the node title
      doesn't seem to change. 

    - TODO: when deleting a node, selection the previous one, and position the cursor properly.
  
    - enter / new node creation
  
        - enter in the middle of a node should split it and create a new node below it.   
        - enter at the beginning should insert a node before
        - enter at the end should insert a node after 
  
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


- MVP.1
    - basic workflowy style outline manipulation
        - tab indents the current item
    - image paste and correct image size
    - inbound links and link clicking
    - click the bullets next to links
- MVP.2
    - multi-line notes with shift+enter
    - basic backend persistence
    - /table support
    - exports of data? 
    - select multiple notes via shift+click
    
    
- MVP.3 
    - ability to enter 'editing' mode so you can make a node multi-line
    - drag notes around...  

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