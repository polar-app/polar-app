import React from 'react';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {createStyles, makeStyles} from '@material-ui/core/styles';

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly children?: JSX.Element | ReadonlyArray<JSX.Element>;
}

const useStyles = makeStyles((theme) => {
    return createStyles({
        root:{
            width: '100%'
        }
    })
});
/**
 * A toolbar that looks like paper and has proper borders.
 */
export const RepositoryToolbar = (props: IProps) => {
    const classes = useStyles();
    return (
        <Paper square 
               style={props.style}
               className={[classes.root, props.className].join(' ')}>

            <Box style={{display: 'contents'}}>
                {props.children || null}
            </Box>
        </Paper>
    )
}
