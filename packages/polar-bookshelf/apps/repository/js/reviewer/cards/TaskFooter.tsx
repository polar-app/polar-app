import * as React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import {AppBar} from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: 'auto',
        bottom: 0,
    },
}));

interface IProps {
    readonly children: JSX.Element;
}

export const TaskFooter = (props: IProps) => {

    const classes = useStyles();

    // return (
    //     <div>
    //
    //         <Divider/>
    //
    //         <div className="text-center p-1">
    //             {props.children}
    //         </div>
    //
    //     </div>
    // );
    //
    return (
        <AppBar position="fixed" color="inherit" className={classes.appBar}>
            <Toolbar>
                <Box flexGrow={1}>
                     {props.children}
                </Box>
            </Toolbar>
        </AppBar>
    );

};
