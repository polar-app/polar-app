# How selected color is computed

https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/TableRow/TableRow.js

```typescript jsx
fade(theme.palette.secondary.main, theme.palette.action.selectedOpacity)
```

# Styles 

```typescript jsx
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
        },
    }),
);
```

# Adding style to sub-elements

# hover
```typescript jsx
const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '&:hover': {
                background: theme.palette.action.hover
            },
        },
    }),
);
```


```typescript jsx
const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            "& a:link": {
                color: blue[300],
            },
            "& a:visited": {
                color: blue[600],
            },
            "& a:hover": {
                color: blue[400],
            },
            "& a:active": {
                color: blue[500],
            },
        },
    }),
);

```
