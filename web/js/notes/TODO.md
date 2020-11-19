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