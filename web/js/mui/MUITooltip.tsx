import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

interface IProps {
    readonly title: string;
    readonly children: React.ReactElement;
}

export const MUITooltip = React.memo((props: IProps) => {
    return (
        <Tooltip title={props.title}
                 enterDelay={500}
                 leaveDelay={200}>
            {props.children}
        </Tooltip>
    )
})