# Cursor & ContentEditable Quirks


## ContentEditables

## contentEditable=false cursor issues
Currently, wiki links have `contentEditable` set to `false` this is because we wanna deal with them as one entity so we know when they're deleted (because we need to update the links index and do other stuff).
But this approach has many issues that occur when trying to update the position of the cursor, because most of the time when trying to put the cursor inside of a `contentEditable=false` element the cursor disappears.

### The current possible solutions are
- Improve the functions that update the cursor positions that are inside `CursorPositions.ts` to detect when we're trying to put the cursor inside of a link for example or any `contentEditable=false` it will abort the operation and try to put the cursor at the *start/end* of it instead.

TODO: There are multiple ways to put the cursor at the start/end of a contentEditable=false element (not sure if they all work though)
- Create an empty text node at one of the edges of a link and put the cursor in it.
- Create a text node that has a single whitespace, put the cursor in it, and remove it right after. I've seen this done in some other website.


<br />
<br />
<br />



## Setting innerHTML on a contentEditable
- Every time we set `innerHTML` on a `contentEditable` element the cursor gets reset to the start.

## Collaboration issue
When 2 users are trying to edit the same block, lets say **Bob** has his cursor in the **middle** of a **block**,
after that **Alice** tries to edit the **same block** which causes **Bob's** cursor to **reset** to the start of the **block**

This mainly happens because of when **Alice** *changes* the content of a **block** and Bob receives the updates, 
we have to set `innerHTML` on **Bob's** block which resets his cursor.

### Possible solution
What we should be doing here is on every update (that triggers setting `innerHTML`), is that we should save the cursor position and restore it right after.
But that approach has an issue, which is that we don't want to save/restore the cursor position for updates coming from the store due to our actions, 
because there are situations where we update the content of a block and set the cursor position manually (eg: creating links) in `BlocksStore`, so saving/restoring the cursor
position when setting `innerHTML` will override that position update.

I think what we need to do here is differentiate between updates coming from our store and updates coming from somewhere else.
- If an update is coming from our store we don't save/restore our cursor position.
- If an update is coming from somewhere else we have to save/restore our cursor position.