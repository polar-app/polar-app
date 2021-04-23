import React from 'react';
import {deepMemo} from "../../react/ReactUtils";
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {

            width: '5px',
            minWidth: '5px',
            maxWidth: '5px',
            cursor: 'col-resize',
            // backgroundColor: active ?
            //     // TODO darken doesn't work but both paper and default are white
            //     // on light mode
            //     theme.palette.background.default :
            //     theme.palette.background.paper,
            // backgroundColor: grey[500],
            // TODO maybe use the divider color?
            // backgroundColor: grey[600],
            backgroundColor: theme.palette.background.paper,
            // backgroundColor: 'inherit',
            minHeight: 0,

            '&:hover': {
                // background: theme.palette.divider
                backgroundColor: grey[500],
            },

        },
    }),
);


interface IProps {
    readonly onMouseDown: () => void;
}

export const DockSplitter = deepMemo(function DockSplitter(props: IProps) {

    const classes = useStyles();

    return (
        <div draggable={false}
             className={classes.root}
             onMouseDown={() => props.onMouseDown()}>

        </div>
    );
})
