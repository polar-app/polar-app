- we need to have ONE central location for dispatching and controlling the menu by keyboard
- how do we inject the items though...

- we will need to inject 
    - the predicate action for triggering / or '[[' or #
    - the items to select from
    - don't inject data, inject symbols, we then handle the symbol somewhere else
    
- FIXME if we have TWO stores it won't be possible to use them... unless I make a HoC to handle them... because then
  I can use no state.     
    
<NoteActionMenu trigger="/" provider="">
    
    <NoteActionMenu trigger="/" provider="">
    </NoteActionMenu>

</NoteActionMenu>
 