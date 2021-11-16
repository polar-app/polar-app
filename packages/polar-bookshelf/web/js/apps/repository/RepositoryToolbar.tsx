import React from 'react';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly children?: JSX.Element | ReadonlyArray<JSX.Element>;
}

/**
 * A toolbar that looks like paper and has proper borders.
 */
export const RepositoryToolbar = (props: IProps) => {

    return (
        <Paper square
               style={props.style}
               className={props.className}>

            <Box style={{display: 'flex',alignItems: 'center', 
                    justifyContent: 'flex-end'}}>
                {props.children || null}
            </Box>
        </Paper>
    )
}
