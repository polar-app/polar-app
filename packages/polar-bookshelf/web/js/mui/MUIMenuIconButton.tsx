import * as React from 'react';
import {MUIMenu} from "./menu/MUIMenu";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import {PopperPlacementType} from "@material-ui/core/Popper";

interface IProps {
    readonly id?: string;
    readonly className?: string;
    readonly style?: React.CSSProperties;

    readonly disabled?: boolean;
    readonly size?: 'small' | 'medium';
    readonly placement?: PopperPlacementType;

    readonly children: React.ReactElement;
}

export const MUIMenuIconButton = (props: IProps) => {

    const size = props.size || 'small';
    const placement = props.placement || 'bottom-end';

    return (

        <MUIMenu button={{
                     icon: <MoreVertIcon/>,
                     disabled: props.disabled,
                     size
                 }}
                 disabled={props.disabled}
                 placement={placement}>
            {props.children}
        </MUIMenu>

    );
};
