
# Review These Roam Videos

DONE: https://www.youtube.com/watch?v=v9s3pusI1JQ
DONE: https://www.youtube.com/watch?v=lHkMq3aqDtw
https://www.youtube.com/watch?v=3SwQ4usbCX4
https://www.youtube.com/watch?v=nROryUttSr0
https://www.youtube.com/watch?v=BnwWdTnXlxU
https://www.youtube.com/watch?v=asQ4RSjjCu4
https://www.youtube.com/watch?v=7b2AVCZOMnw
https://www.youtube.com/watch?v=ByiFhtlI66A



# TODO

    - if we hit enter at the beginning of on a note with sub-items the sub-items are
      kept on THAT note and a new note under it has the content of that note...  

    - enter at the end of a note, seems to blink the cursor at the beginning of
      the note while the new note is being created and there might be a race where
      you could enter twice in this stuation.
        

    - merging a note no longer works and says that the mutators are dead...
        
        - I think this could be because the node is fully re-mounted and I need to figure out why.        
        - The alternative is to figure out why its' remounting.
        
        - The recent editors are probably responsible for this bug because it
          was working for a long time.

    - if I implemented this from scratch it wouldn't support image resize but that's ok.
    
    - Actually, with the CKEditorActivator, if I can set the initial cursor
      position, and the key trick, I can force it to remount, then I don't need to
      ever mutate them which would make my job easier.
      
        - I could use some sort of id to remount the node?  The problme is right
          now we don't remount every time ... 
          
        - actually. fuck, if we do a remount it's going to be slow.  

    - enter on an image node doesn't create a new node...  

    - BLOCKER: make sure sharing system is designed properly and make sure permissions will work.
    
        - We would have to copy all the keys from the parent when working with the children
        
        - how does sharing work in Roam?? what happens if there are named node conflicts...?
        
        - BLOCKER: uid can NOT be shared. This needs to stay internal. That's a major obstacle
            Make the name node their profile name + node name so if my profile is burtonator the 
            node that we're linking to would be burtonator/Berlin but it's namespaced when I 
            import other notes via snapshots. 
      
    - Handle proper sizing of images on high DPI displays with window.devicePixelRatio
    
        - https://ckeditor.com/docs/ckeditor5/latest/features/image-upload/image-upload.html
        - https://ckeditor.com/docs/ckeditor5/latest/api/module_image_image_imageinsertcommand-ImageInsertCommand.html
        - https://ckeditor.com/docs/ckeditor5/latest/api/module_image_imageresize_imageresizecommand-ImageResizeCommand.html
                
    
                
    - if I select shift, down/up arrow, and the cursor is in the middle of an item it should select the beginning 
      of the note from the cursor or to the end of the note from the cursor. 
          
    - Don't allow images, formatting, etc in named nodes. Do it with just a
      plain textarea I think...
        - this has to wait until I use the new IBlock work...
          
    - I don't think the citation text at the bottom should be editable... 
        - "All notes that reference this note:"
        
        - if it's editable it needs the same semantics as regular notes
          including creating sub-bullets.
          
    - clicking on a URL, which is the same URL of the one we're currently
      viewing, brings up the native ckeditor URL prompt thing.
    
    - there's no way to link to a new node via text like [[ or ]] by creating a new one...
  

    - using the action menu to link to existing nodes doesn't really work just yet

    - the action menu for regular commands like date/time doesn't really work yet.
   
    - clicking on an inactivated html with CKEditorActivator, then selecting a
      range, doesn't select the range in the activated component
  
    - refs connecting to other named nodes in the JSON needs to be update when
      saving a link to a new node
    
    - indenting an empty node (where the child of a parent is indented) will result in an empty node that
      can't be clicked or activated and that has the wrong height.
  
    - image paste size needs to be correct
    
    - notes can be @user or @org/user/
    
    - sharing:
        - research github, slack, google drive, notion, roam
    
    - BREAKER read only vs write only sharing... 
        - this metadata is in the sharing token
        - allow re-sharing with other people????

    - BREAKER: If we change the name of a named node, all the linking notes need
      to be updated too...
    
        - This is what Roam does but would be nice if it was sort of automated...

        - I think we could save the link as a wiki node with the original text,
          of the note but then also use an ID for the note too which is generated
          from the original name?
          
        - DESIGN/BREAKER : this way if we combine notes ... with the users
          profile, and the notes are local, then I could link to them with
          burtonator/Berlin or just type Berlin ... but the NAME is sort of
          irrelevant.  We're actually linking to the ID not the name... teh name
          is just a shortcut.
 
        - DESIGN: do just-in-time setup of a user profile with a handle... the user can add an icon later.        
            - if we STILL used a uid then we'd have to build a new mechanism on private docs... 
  
            - BREAKING/DESIGN: we could generate a NEW id called a 'sid' that is
              a sharing ID that is a custom claim which is a 'sharing ID' that we
              could use.

            - FIXME: I think we can deal with this now and just use uid because you'd have to 
              now the fingerprint of a document to read it anyway and that's a hashcode too.
              
              
              
            - when a node is created, how do we update the name without having the full datastore 
              in memory.
 
 
            - the way notes are created is that they are links to notes via ID... NOT via name..
              There are only TWO ways we can create a note:
              
                - by typing it in with brackets around it like [[Foo]] ... when that happens we create the note
                  with the ID and name, write it to the store, then we update the structure in memory
                  so that the 'ref' no the note has a name but an ID too... 
                  
                    - clicking on it will load it up by name though.
                    
                    - IF the node name changes, we just update the UI, not the data ... this way we don't have
                      to do bulk renames of nodes.
                      
                        - for now we won't start implementing the renaming just yet.
                        
                - by clicking on a URL and then loading it directly , at which point we say it's not present
                  and would you like to create it in your graph.
                  
            - the added benefit here is that you can link ot another note, by ID, and the name is updated in the UI
              to ALSO reflect the owner , if the owner is not you.  
            
    - BREAKER: if we LOSE permission to a link, say that it was revoked and it has to be removed from the snapshot
      data...
            
 
    - there's no way to link to other notes and to embed them into the current tree.
        
        - FIXME(BLOCKER) what would a block embed look like this way because the parent
          would be wrong wouldn't it?  We could have the parent on the graft point
          BUT the children wouldn't have the right parents.  
            
            - and why do we need parent again? 

            - oh.. this should be totally fine. the intermediate node would
              re-parent it and remaining parents are totally fine.

    - selection: we can only expand the selection, not narrow it down.
    
        - give it an selectionAnchor where the selection first started and the
          seleciton should from from where it started ot the current point that is
          active using ranges.

    - there is no way to CREATE a new named node and link to it.

    - we need a solution for editing named nodes as you can't split them...

    - implement new hover control for manipulating nodes... 

    - selecting some text, then deleting it, deletes the whole node.
    
        - I think it's the Delete handler and it deletes the text first, then we
          realize that there isn't text for the note, at which point we merge them
          
          - this was an existing bug...
          
          - the ckeditor selection DOES respond to all eventss and we CAN detect if it's the selection is active
            BUT the it deletes the selection in the selection.changed event before we see it on the keyboard 
            handler event 
        
          - I can use a queue handler to listen to the selectino change events and if we have two events that are
            collapsed: false and collapsed: true BEFORE a Backspace then it has a region.  The code won't be too bad
            if I maintain a fixed list in RAM.


    - selection, when in the middle of a post, should just select the text using the selection API not the entire
      note.  Otherwise there isn't a way to just select parts of the text.  THEN , after that, we can select text 
      after it.

    - if I'm on the ROOT node, and hit enter, the node created becomes the last child, not the first child.
        -it seems if a node is expanded, we don't properly pick the right node to expand. 
    


    
    

    - write a DEDICATED test for activating the ckeditor control and setting the
      cursor position.  It hink in my tests it was just about setting the offset

    - I can only join two sibling nodes, not a first child to a parent
    - shift + arrows don't select multiple nodes
    
    - I have to implement undo in the store.  
     
    
    - implement support for selections and multi-select

    - actions no longer work even when I select them.
        - use the store to select an action...
        - we have to catch the action menu at the window level...  

    - strategy for drag and drop and moving notes around that way

    - when at the end of the note, if we arrow right, then we have to go to 
      the beginning of the next note.

    - when at the begginning of the note, if we arrow left, then we have to go
      to the end of the previous note.
      
  

# Design Notes

    - It's better to think of this as multiple trees, but with links between them via:
        - block embeds
        - named nodes 
        - tags (just a form of node named node)
    - nodes MUST have a single parent or else they are roots... 

# Key Actions and Behavior that need to be tested

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
    - 1h: breadcrumbs with path during navigation... 
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


# Sharing Design:

      
    - Sharing will be user based so @alice101/Berlin would be the node name locally and we link to that 
      not to [[Berlin]] it would be [[@alice101/Berlin]]
