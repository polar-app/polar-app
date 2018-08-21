# Setup

- Install Anki Connect and restart Anki.

# Usage

- Add a flashcard to Polar

- Right click the document and select 'sync'.  

# Limitations

- No support for cloze deletions.  It's on the roadmap.

- Only front/back cards for now.  We will implement more card types in the future.

- No current ability to update flashcards.  Polar currently lacks a flashcard 
  update UI so this needs to be added to Polar before we can implement this in 
  Anki sync.

- Anki must have Anki Connect. This will always be a hard requirement. 

- No support for nested decks.  Each deck is created at the root.  If you move it
  the new deck will be created. We will have a fix for this in the future.

- All flashcards are always sync'd each time. This is probably going to be slower
  for larger decks but we plan to implement differential sync in the future.
