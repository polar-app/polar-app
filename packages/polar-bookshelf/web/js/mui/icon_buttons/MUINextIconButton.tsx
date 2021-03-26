import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface IProps {
    readonly color?: 'primary' | 'secondary';
    readonly onClick: () => void;
}

export const MUINextIconButton = React.memo(function MUINextIconButton(props: IProps) {
    return (
        <IconButton color={props.color}
                    onClick={props.onClick}>
            <ExpandMoreIcon/>
        </IconButton>
    )
});
