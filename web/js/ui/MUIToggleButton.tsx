import * as React from 'react';
import Button from '@material-ui/core/Button';
import CheckIcon from '@material-ui/icons/Check';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

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
        button: {
            color: theme.palette.text.secondary,
        }

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
        setTimeout(() => props.onChange(newActive), 1);
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
                className={active ? classes.buttonActive : classes.button}
                onClick={handleToggle}
                variant={active ? "contained" : "outlined"}
                disableFocusRipple
                disableRipple
                size={size}>

            {props.label}

        </Button>

    );

}


