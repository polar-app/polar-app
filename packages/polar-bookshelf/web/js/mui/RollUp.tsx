import {ButtonBase, createStyles, darken, makeStyles} from "@material-ui/core";
import {Devices} from "polar-shared/src/util/Devices";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React from "react";
import {useHistory} from "react-router";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            position: 'absolute',
            top: '100%',
            left: 0,
            background: theme.palette.background.default,
            width: '100%',
            height: '100%',
            zIndex: 1000,
            boxShadow: theme.shadows[5],
            animation: '$rollin 300ms ease-in-out forwards',
            overflowY: 'auto',
        },
        topBar: {
            display: 'flex',
            padding: '12px',
            background: darken(theme.palette.background.default, 0.15),
            position: 'sticky',
            top: 0,
            zIndex: 100,
        },
        title: {
            margin: 0,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 20,
        },
        "@keyframes rollin": {
            "0%": {
                top: "100%",
            },
            "100%": {
                top: "0%",
            }
        },
    }),
);


export const rollUp = <T, >(Component: React.FC<T> | React.ComponentClass<T>, title?: string): React.FC<T> | React.ComponentClass<T> => {
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
                <div className={classes.topBar}>
                    <ButtonBase onClick={handleGoBack} style={{ borderRadius: '50%', padding: 4 }}>
                        <ArrowBackIcon />
                        {title && <h2 className={classes.title}>{ title }</h2>}
                    </ButtonBase>
                </div>
                <Component {...props} />
            </div>
        );
    }
};
