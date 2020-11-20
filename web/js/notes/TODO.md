
- node input text... 
    - 


- we need a way to handle link input and rendering...


- save the note to the store when I type ... 
- jump to other notes
- what about markdown support?
- edit the main content of the note...
- completion of nodes by name and the ability to jump to them

temp1.commands.get('insertTable').execute();


- basic functionality v1

    - enter sub-nodes and have the ability to enter text there
    - ability to jump to a node and keep the breadcrumb path
    -  


- we need some sort of background saving function so that we're constantly persisting what the user types
  while they're using the app.... 
  
- will this trigger the UI being constantly updated

- [enter] to create a new node under the currentone
- [tab] to indent it
- I THINK the active node can be handled by having the code listen for 'activeNode' and switch automatically

// TODO: when I hit 'enter' the action should execute and the menu should be dismissed
// TODO: filter the list input based on what the user has typed after the /
// TODO: we can do editing.view.focus()
// TODO: we can call ref.focus() (on the element) to select the current items
// and we can use that to navigate through them.
// TODO: link to another node using completion with [[
// TODO: link to tags too

- I need to be able to click nodes in the UI to jump to them...
- if text is selected and I type it should link to it... 

- I'm going to need to have 'special' notes and handle their clicking differently.


// Applies the link to the selected content.
// When the selection is collapsed, it creates new text wrapped in a link.
temp1.execute( 'link', 'http://example.com' );

// If there are decorators configured, the command can set their state.
editor.execute( 'link', 'http://example.com', { linkIsExternal: true } );

// Removes the link from the selection (and all decorators if present).
editor.execute( 'unlink' );

- insert table command

- 