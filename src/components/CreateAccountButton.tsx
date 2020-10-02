import {Button} from "gatsby-material-ui-components";
import * as React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({

    buttonAccount: {
        textTransform: "none",
        marginTop: "10px",
        marginBottom: "10px",
        width: "183px",
        backgroundColor: "#6754D6",
    },
});

interface IProps {
    readonly size?: 'small' | 'medium' | 'large';
}


export const CreateAccountButton = (props: IProps) => {

    const classes = useStyles();

    return (
        <Button className={classes.buttonAccount}
                variant="contained"
                size={props.size || 'large'}
                color="primary"
                href="https://app.getpolarized.io">
            Create Account
        </Button>
    );

}