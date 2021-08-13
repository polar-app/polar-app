import {ButtonBase, createStyles, darken, makeStyles} from "@material-ui/core";
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
        topBar: {
            display: 'flex',
            padding: '12px',
            background: darken(theme.palette.background.default, 0.15),
            position: 'sticky',
            alignItems: 'center',
            top: 0,
            zIndex: 100,
        },
        title: {
            margin: 0,
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 20,
        },
        content: {
            minHeight: 0,
            flex: 1,
            overflowY: 'auto',
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
                <div className={classes.topBar}>
                    <ButtonBase onClick={handleGoBack} style={{ borderRadius: '50%', padding: 4 }}>
                        <ArrowBackIcon />
                    </ButtonBase>
                    {title && <h2 className={classes.title}>{ title }</h2>}
                </div>
                <div className={classes.content}>
                    <Component {...props} />
                </div>
            </div>
        );
    }
};
