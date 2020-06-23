import React from 'react';
import isEqual from 'react-fast-compare';
import Button from "@material-ui/core/Button";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import IconButton from "@material-ui/core/IconButton";

export interface IButtonProps {
    readonly onClick?: () => void;
    readonly icon?: JSX.Element;
    readonly text?: string;
    readonly color?: 'primary' | 'secondary' | 'default'
    readonly size?: 'small' | 'medium';
    readonly ref?: React.RefObject<HTMLButtonElement>;
}

export const MUIDropdownButton = React.memo((props: IButtonProps) => {

    const buttonProps = {
        onClick: props.onClick || NULL_FUNCTION,
        color: props.color,
        size: props.size,
        ref: props.ref,
    };

    if (props.text && props.icon) {
        return (
            <Button {...buttonProps}>
                {props.icon} {props.text}
            </Button>
        );
    }

    if (props.icon) {
        return (
            <IconButton {...buttonProps}>
                {props.icon}
            </IconButton>
        );
    }

    return (
        <Button {...buttonProps}>
            {props.text}
        </Button>
    );

}, isEqual);
