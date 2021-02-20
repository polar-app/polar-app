    
- NoteNavigation needs to be reworked and all options moved to the new system...

- hitting backspaces on a node should merge it with the previous even if it's not empty.
    - we should have two methods splitNote and joinNotes ... createNewNote doesn't seem
      to articulate what we're trying to do... 

- we might want to make it so that the cursor is rendered only on change and we jump to it...
  that way rather than having this stored in the store as that's not really react-ish but
  I need a way to re-mount when that happens.

    


- if we have a tree like

    - hello
    - world
        -dog 
        
        
    - and we delete 'world' the 'dog' should reparent under 'hello'

- I think links like <a> need to be have 'hand' cursor when on hover and the contenteditable isn't active.
- 
