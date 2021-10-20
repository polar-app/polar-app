import {AppBar, Box, ButtonBase, createStyles, darken, IconButton, makeStyles, Toolbar} from "@material-ui/core";
import {Devices} from "polar-shared/src/util/Devices";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React from "react";
import {useHistory} from "react-router";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            background: theme.palette.background.default,
            boxShadow: theme.shadows[5],
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
        },
        content: {
            minHeight: 0,
            flex: 1,
            overflowY: 'auto',
        },
    }),
);


export const withMobilePopup = <T, >(Component: React.FC<T> | React.ComponentClass<T>, title?: string): React.FC<T> | React.ComponentClass<T> => {

    if (Devices.isDesktop()) {
        return Component;
    }

    return (props) => {
        const classes = useStyles();
        const history = useHistory();

        const handleGoBack = React.useCallback(() => {
            history.goBack();
        }, [history]);

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>

                        <IconButton onClick={handleGoBack}>
                            <ArrowBackIcon />
                        </IconButton>

                        <span>{title}</span>

                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    <Box pt={1}>
                        <Component {...props} />
                    </Box>
                </div>
            </div>
        );
    }
};
