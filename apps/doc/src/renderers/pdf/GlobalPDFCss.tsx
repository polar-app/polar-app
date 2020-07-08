import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import useTheme from "@material-ui/core/styles/useTheme";

export const GlobalPDFCssDarkStyles = withStyles((theme) => {

    return {
        '@global': {

            ".page canvas": {
                filter: "invert(0.85)"
            },

            ".pdfViewer .page": {
                backgroundColor: `${theme.palette.background.default} !important`
            }

        },
    }

});

export const GlobalCssDark = GlobalPDFCssDarkStyles(() => null);

export const GlobalPDFCss = () => {

    const theme = useTheme();

    return (
        <>

            {theme.palette.type === 'dark' &&
                <GlobalCssDark/>}

        </>
    );

};

