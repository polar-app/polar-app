##### [ᐊ Go Home](./NOTES.md#table-of-contents)

<div align="center">

# Notes ContentEditable

This section contains info on the notes block editor.

</div>

## Table of Contents
1. [Overview](#overview)
2. [Wiki Links](#wiki-links)
3. [Setting innerHTML](#setting-innerhtml)
4. [Multiline Blocks](#multiline-blocks)

## Overview

The notes block editor is basically a div with `contenteditable` set to `true`.
**Note:** For more details be sure to check `CursorPositions.ts`, `ContentEditables.ts`, `BlockEditor` & `BlockContentEditable`.

## Wiki Links

Wiki links have `contentEditable` set to `false` this is because we wanna deal with them as one entity so we know when they're deleted (because we need to update the links index and do other stuff).

**Issues**

This approach has many issues that occur when trying to update the position of the cursor because most of the time when trying to put the cursor inside of a `contenteditable=false` element the cursor disappears.

**Solution**

The way we currently handle this issue is that when trying to put the cursor within a `contenteditable=false`
element, we would create an empty text node right after the element and focus that instead.


## Setting innerHTML
Every time we set `innerHTML` on a `contentEditable` element the cursor gets reset to the start.

This becomes an issue when dealing with collaboration because 2 users might edit the same block at the same time.

**Example**

When 2 users are trying to edit the same block, let's say *Bob* has his cursor in the *middle* of a *block*, after that, *Alice* tries to edit the *same block* which causes *Bob's* cursor to *jump* to the start.

This happens because when **Alice** *changes* the content of that *block* and Bob receives the change, we have to set `innerHTML` on *Bob's* with the new content which in turn resets his cursor.


**Solution**

What we're currently doing as a solution to this issue is that right before setting `innerHTML` of a block we would do the following.
1. Save the *current position* of the *cursor*.
2. Update the block's content by setting `innerHTML`.
3. *Restore* the old *position* of the *cursor* that we *saved* earlier.

## Multiline Blocks

In general, we didn't want to support multi-line blocks, mainly because we had a different idea on how we want to implement them, the idea being that we would use a different kind of block content which would contain a nested block structure where users can add multiple nested blocks instead of actual lines.

We still had one issue though, and that is blocks with really long text content that ends up wrapping into multiple lines.
In situations like this, we have no way of allowing users to navigate between the lines of a single block. because up & down arrow keys always navigate between separate blocks, so we needed
a way to get the current position of the cursor and see whether it is on the first/last line of the content and only then we would navigate to a separate block.

**Example**

Let's say we have a block with the following content that takes up 4 lines.
```
Hello world
My name is 
Potato
Goodbye
```

We have 3 situations for handling cursor movement, those being the following.
1. The cursor being on the first line "Hello world". In this case, we have to handle the 2 following paths
   1. The *arrow up* key being pressed. and in that situation (since we're on the first line), we would navigate the cursor to the block that's above this one.
   2. The *arrow down* key being pressed. Here we would just let the browser handle the cursor movement, which ends up moving the cursor to the second line "My name is"
2. The cursor being on the second or third lines. In this case, we can just let the browser handle the movement.
3. The cursor being on the last line "Goodbye". In this case we would have to handle the same situation we were in when we were working with the first line.

**Getting the position of the caret**

At first we tried getting the active selection range by using `document.getSelection().getRangeAt(0)` and then doing a `getBoundingClientRect` on the range,
but for some reason sometimes it returns zeroes for all the values when you have the cursor in specific places, so as you can see it's very unreliable.

So we ended up inserting a `<span />` element that contains a *single whitespace* character at the position of the caret and calling `getBoundingClientRect` on the span instead.