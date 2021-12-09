import * as React from 'react';
import {useState} from 'react';
import Switch from "@material-ui/core/Switch";

interface IProps {
    readonly id?: string;
    readonly checked?: boolean;
    readonly onChange: (value: boolean) => void;
    readonly color?: 'default' | 'primary' | 'secondary';
    readonly size?: 'small' | 'medium';
}

export const SwitchButton = (props: IProps) => {

    const {checked} = props;

    const handleChecked = () => {

        const newChecked = ! checked;
        props.onChange(newChecked);

    };

    return (
        <Switch id={props.id}
                size={props.size}
                checked={checked}
                onClick={handleChecked}/>
    );


};

