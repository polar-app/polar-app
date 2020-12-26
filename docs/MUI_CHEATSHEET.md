# How selected color is computed

https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/TableRow/TableRow.js

fade(theme.palette.secondary.main, theme.palette.action.selectedOpacity)

# Styles 

import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
        },
    }),
);

# Adding style to sub-elements
