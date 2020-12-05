import * as React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

const CKEditor5NotesGlobalCSS = withStyles((theme) => {

    return {

        // force tables to not be centered
        ".ck-content p": {
            margin: 0,
            padding: 0
        }

    };

});

