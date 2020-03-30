import React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly checked: boolean;
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    readonly onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;

}

const Icon = (props: IProps) => {

    if (props.checked) {
        return <i className="fas fa-check-square"/>;
    } else {
        return <i className="far fa-square"/>;
    }

};

export const Checkbox = (props: IProps) => {

    const onClick = props.onClick || NULL_FUNCTION;
    const onContextMenu = props.onContextMenu || NULL_FUNCTION;

    return (
        <span style={props.style || {}}
              className={props.className || ""}
              onContextMenu={(event) => onContextMenu(event)}
              onClick={(event) => onClick(event)}>

            <Icon {...props}/>

        </span>
    );

};
