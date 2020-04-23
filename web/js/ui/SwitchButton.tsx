import * as React from 'react';
import Switch from "@material-ui/core/Switch";
import {useState} from "react";

interface IProps {
    readonly id?: string;
    readonly initialValue?: boolean;
    readonly onChange: (value: boolean) => void;
    readonly color?: 'default' | 'primary' | 'secondary';
    readonly size?: 'small' | 'medium';
}

export const SwitchButton = (props: IProps) => {

    const [checked, setChecked] = useState(props.initialValue);

    const handleChecked = () => {

        const newChecked = ! checked;

        setChecked(newChecked);
        props.onChange(newChecked);

    };

    return (
        <Switch id={props.id}
                size={props.size}
                checked={checked}
                onClick={handleChecked}/>
    );


};

