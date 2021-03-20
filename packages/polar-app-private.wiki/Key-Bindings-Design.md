# Overview 

# Global Key Bindings

Most of the time we want to use global key bindings.  

The pattern we're using here is to just create one component and place it in the
DOM as a sibling rather than a parent.

Here's a quick example:

```text

const globalKeyMap = {
    FIND: ['command+f', 'control+f']
};

export const DocRepoKeyBindings = React.memo(() => {

    const callbacks = useDocViewerCallbacks();

    const globalKeyHandlers = Callbacks.callbacksWithTimeout({
        FIND: () => callbacks.setFindActive(true),
    });

    return (

        <GlobalHotKeys allowChanges={true}
                       keyMap={globalKeyMap}
                       handlers={globalKeyHandlers}/>

    );
});
```

# Input Completion

The react-hotkeys package we use seems to have a bug where it will swallow 
input from components when within a <input> item.

On one hand this is the best initial behavior because if you type 'f' while 
replying to a comment you don't want it to trigger a keyboard action.

However, the behavior can't be disabled.  There's an official way for it to be
disabled BUT it doesn't actually work.

## Solution

We've built an ```InputCompleteListener``` that solves this with an onComplete
callback for 'control+enter' and 'command+enter'.

Use this instead of a key binding to complete the input.

# Input Escape

```InputEscapeListener``` does the same thing but also has a global key binding
so that we handle Escape at the global level BUT through the <input> element 
too.
