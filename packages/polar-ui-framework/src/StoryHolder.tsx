import React from 'react';
import {Box, useTheme} from "@material-ui/core";
import {lighten} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

interface IProps {
    readonly children: JSX.Element;
}

/**
 * Hold a story and highlight it properly
 */
export const StoryHolder = (props: IProps) => {

    const theme = useTheme();

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            padding: theme.spacing(2),
            background: lighten(theme.palette.background.default, 0.1),
        }}>

            <Paper elevation={2}
                   style={{
                       background: lighten(theme.palette.background.default, 0.0),
                       margin: 'auto',
                       minWidth: '450px',
                       minHeight: '450px',
                       display: 'flex',
                       flexDirection: 'column',
                   }}>

                <Box p={2} m={2}>
                    {props.children}
                </Box>

            </Paper>

        </div>
    )

}
