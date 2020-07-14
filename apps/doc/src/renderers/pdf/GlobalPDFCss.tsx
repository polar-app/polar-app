import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import {usePrefs} from "../../../../repository/js/persistence_layer/UserTagsProvider2";

export const GlobalPDFCssDarkStyles = withStyles((theme) => {

    return {

        '@global': {

            ".page canvas": {
                filter: "invert(0.85)"
            },

            ".pdfViewer .page": {
                backgroundColor: `${theme.palette.background.default} !important`
            },

            ".pdfViewer .highlight": {
                backgroundColor: 'rgba(255, 255, 0, 1) !important'
            }

        },

    }

});

export const GlobalCssDark = GlobalPDFCssDarkStyles(() => null);

export const GlobalPDFCss = () => {

    const theme = useTheme();
    const prefs = usePrefs();

    return (
        <>

            {theme.palette.type === 'dark' &&
                <GlobalCssDark/>}

        </>
    );

};

