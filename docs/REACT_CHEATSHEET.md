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
        <AuthButtonMobile {...props}
                          style={{width: '95vw', margin: '10px', textAlign: 'center'}}/>
    );
}
```
