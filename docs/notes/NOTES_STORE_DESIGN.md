##### [ᐊ Go Home](./NOTES.md#table-of-contents)

<div align="center">

# Notes Store

This section contains info about **BlocksStore** which uses **mobx**

</div>

## Table of Contents
1. [Overview](#overview)
2. [Keeping Track of Multiple Roots](#keeping-track-of-multiple-roots)
3. [TODO](#todo)

## Overview
*BlocksStore* is the center of everything in notes.

It keeps track of the following:
1. [All the blocks that a user has access to.](#tobeadded)
2. [The references between blocks (aka Wiki links).](#tobeadded)
3. [The expansion state of blocks.](#tobeadded)
4. [The currently active block.](#tobeadded)
5. [Interstitials, which are blocks that have data associated with them that is currently being uploaded (eg: images).](#tobeadded)
6. [The currently selected blocks.](#tobeadded)
7. [Blocks that are currently being dragged.](#tobeadded)

It also manages all the operations that are performed on blocks:
1. [Indenting/unindenting blocks.](#tobeadded)
2. [Adding/removing interstitials.](#tobeadded)
3. [Moving blocks within the same parent.](#tobeadded)
4. [Updating the content of a block.](#tobeadded)
5. [Splitting/Merging blocks.](#tobeadded)
6. [Deleting blocks.](#tobeadded)
7. [Creating blocks.](#tobeadded)

TODO: Write separate sections for each item in the previous 2 lists and link them properly.

It also integrates with our blocks undo/redo system by pushing entries to it when an operation is performed.


## Keeping Track of Multiple Roots

Keeping track of the root block (that is currently shown on screen) is necessary to perform actions like unindenting, splitting or merging blocks.

For example let say we have the following note structure

```
- Mouse
    - Mice eat cheese
        - Cheese has holes
```

As you can see in the above example `Mouse` is the root block, and there can only be one **root** block in a **note**.
Lets say we want to *unindent* the `Mice eat cheese` block, well we can't because where would it be transffered to.
The `Mouse` block doesn't have a parent (which is one way of knowing that its children cannot be unindented).

Our notes system however also supports viewing parts of a note, aside from viewing entire notes.
This is where one issue arises. Lets say we have the following (which is a part of the previous note)

```
- Mice eat cheese
    - Cheese has holes
```

Right here it's technically possible and okay to unindent the `Cheese has holes` block because it would become a child of the `Mouse` block if we did. But that's not good in terms of UX because the block would simply disappear (since we're only viewing the `Mice eat cheese` tree).

That's why we need to keep track of the currently visible root, so we can prevent the user from unindenting its children, or even creating sibling blocks (Because they wouldn't be visible on screen).

**Solutions**
In the first version the way this issue was solved is by adding a `root` *observable* property to `BlocksStore* which stores the *ID* of the root block that is currently visible on the screen.

I'm pretty sure you've already spotted a problem with this approach. What if we want to show multiple roots on screen at the same time, which is the case.

In our single note viewer we have to show the the note including its references which are separate root blocks, another example is our daily notes page.

So this is where we had to completely remove the `root` property and instead pass a custom root to the methods that require a root block in order to do their job (eg: unindenting, splitting & merging).

As an example, this is the function definition of the `unIndentBlock` method in `BlocksStore` which does exactly what the name implies.
```ts
public unIndentBlock(root: BlockIDStr, id: BlockIDStr): ReadonlyArray<DoUnIndentResult>;
```
As you can see it accepts a root block.

This particular solution was fine at first but it was kind of ugly, because now you have to pass a `root` argument to most *methods* in `BlocksStore`.

Meet `BlocksTreeStore` which is a wrapper of `BlocksStore` that provides the root automatically for us.
One catch though. You still have to give it a root when initializing it, which is currently being done in a hook `useBlocksTreeStore` that gets the root through **React's** *context* api.

Example:
Lets say we want to render our `Mice eat cheese` subtree.
Now we can do something like this.

```ts
const blocksStore = useBlocksStore();
const blocksTreeStore = React.memo(() => new BlocksTreeStore(root, blocksStore), [blocksStore]);

<BlocksTreeContext.Provider>
    {
        /**
         * Render the blocks here which will use
         * BlocksTreeContext version of blocksStore to perform operations
         */
    }
</BlocksTreeContext.Provider>

// Now block components can do something like this.

const blocksTreeStore = React.useContext(BlocksTreeContext);

const onUnindent = React.useCallback(() => {
    blocksTreeStore.unIndentBlock(props.id); // Notice that we don't have to pass the root anymore
}, [blocksTreeStore, props.id]);

// Rest of the component....

```

**Note:** Check `BlocksTree.tsx` & `BlocksTreeStore.tsx` for more info.


## Undo
WIP

## Persistence
WIP


## TODO
- do we do a diff approach and also implement undo/redo that way? It wouldn't be very slow I think... 

- the reverse index also needs to be updated/mutated... 
