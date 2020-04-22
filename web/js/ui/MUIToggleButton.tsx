import * as React from 'react';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        buttonActive: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            "&:hover": {
                backgroundColor: theme.palette.info.main,
                color: theme.palette.info.contrastText,
            }
        },

    })
);

interface IProps {
    readonly id?: string;
    readonly initialValue?: boolean;
    readonly label: string;
    readonly icon?: JSX.Element;
    readonly onChange: (value: boolean) => void;
    readonly size?: 'small' | 'medium' | 'large';
}

export const MUIToggleButton = (props: IProps) => {

    const classes = useStyles();

    const [active, setActive] = React.useState(props.initialValue);

    const handleToggle = () => {
        const newActive = ! active;
        setActive(newActive);
        props.onChange(newActive);
    };

    const size = props.size || 'medium';
    const icon = props.icon || <CheckIcon/>;

    // return (
    //     <Chip id={props.id}
    //           variant={active ? 'default' : 'outlined'}
    //           color={active ? 'primary' : 'default'}
    //           onClick={handleToggle}
    //           label={props.label}
    //           icon={icon} />
    // );

    //
    return (

        <Button id={props.id}
                startIcon={icon}
                className={active ? classes.buttonActive : undefined}
                onClick={handleToggle}
                variant={active ? "contained" : "outlined"}
                disableFocusRipple
                disableRipple
                size={size}
        >
            {props.label}
        </Button>

    );

}


