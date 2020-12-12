import * as React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

const CKEditor5NotesGlobalCSSStyles = withStyles((theme) => {

    return {

        "a::before": {
            content: "[[",
            color: theme.palette.text.disabled,
            textDecoration: 'none'
        }

    };

});

export const CKEditor5NotesGlobalCSS = CKEditor5NotesGlobalCSSStyles(() => null);
