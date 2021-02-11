import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

interface IProps {

    readonly selected: boolean;
    readonly onClick: () => void;
    readonly children: JSX.Element | string;

}

export const AnnotationTypeMenuItem = (props: IProps) => {

    const {selected} = props;

    return (
        <MenuItem onClick={() => props.onClick()}
                  className={selected ? 'font-weight-bold' : undefined}>
            <Checkbox checked={selected}/> {props.children}
        </MenuItem>
    );

}
