import {ButtonBase, createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {MUIIconText} from "../../../../../web/js/mui/MUIIconText";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: '0 16px',
            width: '100%',
            height: 48,
            alignItems: 'center',
            justifyContent: 'flex-start',
            color: theme.palette.text.primary,
        },
    }),
);

interface IFullWidthButtonProps {
    readonly onClick?: React.MouseEventHandler;
    readonly icon?: JSX.Element;
}

export const FullWidthButton: React.FC<IFullWidthButtonProps> = (props) => {
    const classes = useStyles();
    const { onClick, icon, children } = props;

    return (
        <ButtonBase className={classes.root} onClick={onClick}>
            <MUIIconText icon={icon}>
                <h4>{children}</h4>
            </MUIIconText>
        </ButtonBase>
    );
};
