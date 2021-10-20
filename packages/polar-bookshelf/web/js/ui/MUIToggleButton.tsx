import * as React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {DeviceRouters} from './DeviceRouter';
import isEqual from 'react-fast-compare';
import {MUITooltip} from "../mui/MUITooltip";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

        buttonActive: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.info.contrastText,
            "&:hover, &.Mui-focusVisible": {
                backgroundColor: theme.palette.primary.main,
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
    readonly label?: string;
    readonly icon?: JSX.Element;
    readonly onChange: (value: boolean) => void;
    readonly size?: 'small' | 'medium';
    readonly tooltip?: string;
    readonly iconOnly?: boolean;
    readonly className?: string;
}

export const MUIToggleButton = React.memo(function MUIToggleButton(props: IProps) {

    const classes = useStyles();

    const [active, setActive] = React.useState(props.initialValue);

    const handleToggle = () => {
        const newActive = ! active;
        setActive(newActive);
        setTimeout(() => props.onChange(newActive), 1);
    };

    const size = props.size || 'medium';
    const icon = props.icon || <CheckIcon/>;

    return (

        <MUITooltip title={props.tooltip}>
            {!props.iconOnly ? <Button id={props.id}
                    startIcon={icon}
                    className={active ? classes.buttonActive : classes.button}
                    onClick={handleToggle}
                    variant={active ? "contained" : "outlined"}
                    disableFocusRipple
                    disableRipple
                    size={size}>

                    <DeviceRouters.NotPhone>
                        <>
                            {props.label}
                        </>
                    </DeviceRouters.NotPhone>

            </Button>:
            <IconButton id={props.id}
                        disableFocusRipple
                        disableRipple
                        size={size}
                        onClick={handleToggle}
                        className={active ? classes.buttonActive : classes.button}
            >
                {icon}
            </IconButton>
            }
        </MUITooltip>

    );

}, isEqual);


