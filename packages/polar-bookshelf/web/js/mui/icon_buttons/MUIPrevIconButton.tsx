import React from 'react';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import IconButton from '@material-ui/core/IconButton';

interface IProps {
    readonly color?: 'primary' | 'secondary';
    readonly onClick: () => void;
}

export const MUIPrevIconButton = React.memo(function MUIPrevIconButton(props: IProps) {
    return (
        <IconButton color={props.color}
                    onClick={props.onClick}>
            <ExpandLessIcon/>
        </IconButton>
    )
});
