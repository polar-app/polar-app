import {Button} from "gatsby-material-ui-components";
import * as React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles({

    buttonAccount: {
        textTransform: "none",
        marginTop: "10px",
        marginBottom: "10px",
        width: "200px",
        backgroundColor: "#6754D6",
    },
});

interface IProps {
    readonly size?: 'small' | 'medium' | 'large';
}

export const CreateAccountButton = (props: IProps) => {

    const classes = useStyles();

    const size = props.size || 'large'

    const fontSize = size === 'large' ? '20px' : '15px';

    return (
        <Button className={classes.buttonAccount}
                variant="contained"
                size={size}
                color="primary"
                style={{fontSize}}
                href="https://app.getpolarized.io/create-account">
            Sign Up for Free
        </Button>
    );

}
