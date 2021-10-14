# Overview

A cheatsheet for React usage.

Also see [[MUI_CHEATSHEET.md]] too.

# Registering / unregistering global HTML event listeners

Hooks that use legacy HTML event listeners like ```window.addEventListener```
need a corresponding ```window.removeEventListener``` when the component is 
unmounted or the hook won't be removed and will still be called even for
unmounted components and will cause bugs.

```typescript jsx

export function useMouseDown() {
    
    const handler = React.useCallback((event: MouseEvent) => {
        // do something cool with window mousedown
    }, []);
    
    React.useEffect(() => {

        // this is called when the component mounts and/or the useEffect dependencies change.
        window.addEventListener('mousedown', handler);

        return () => {
            // we return a function that is called when the component unmounts and/or the 
            // useEffect dependencies change.
            window.removeEventListener('mousedown', handler);
        }
        
    }, []);
}

```

# Creating Hooks

Often it's nice to share the logic across components by creating hooks.

Hooks are really just magic functions that can reload when their dependencies change.

I will use something like:

```typescript jsx

export function useMutationHandler() {
    
    const firestore = useFirestore();
    
    return React.useCallback(() => {
        // do some mutation here
        
        // note that we have to add 'firestore' to the list of dependencies
        // which will cause our callback to be re-created when/if 'firestore' 
        // changes lower in the react tree.
        
    }, [firestore]);
    
}

export const MyMutationButton = () => {
    
    const mutationHandler = useMutationHandler();
    
    return (
        <Button onClick={() => mutationHandler()}>
            Do Mutation
        </Button>
    );
    
}
```


# Using multiple children instead of just one child.

You might have a component that only takes one child but you need to specify two or more children.

You can do this by wrapping the children with ```<>``` and ```</>```

For example:

```typescript jsx

<ParentComponent>
    <>
        <FirstChild/>
        <SecondChild/>
    </>
</ParentComponent>

```


# Re-use the logic of a component but change the style

Sometimes it's nice to create a new component but just change some of the CSS
properties for it, but you don't want to duplicate a lot of code:

```typescript jsx

interface IAuthButtonProps {
    readonly onClick: () => void;
    readonly style?: React.CSSProperties;
}

const AuthButton = (props: IAuthButtonProps) => {

    const classes = useStyles();

    const mode = React.useContext(AuthenticatorModeContext);

    const hint = mode === 'create-account' ? 'Continue' : 'Sign In'

    return (
        <>
            <Button variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={props.onClick}
                    startIcon={props.startIcon}
                    style={props.style}>

                {hint} with {props.strategy}

            </Button>

        </>
    );
}

const AuthButtonMobile = (props: IAuthButtonProps) => {
    return (
        <AuthButton {...props}
                    style={{width: '95vw', margin: '10px', textAlign: 'center'}}/>
    );
}
```
