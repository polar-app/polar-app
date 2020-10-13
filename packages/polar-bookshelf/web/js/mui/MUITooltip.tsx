import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

interface IProps {
    /**
     * If the tooltip isn't specified we don't use a tooltip.
     */
    readonly title?: string;
    readonly children: React.ReactElement;
}

export const MUITooltip = React.memo((props: IProps) => {

    if (props.title === undefined) {
        return props.children;
    }

    return (
        <Tooltip title={props.title}
                 enterDelay={750}
                 leaveDelay={200}>
            {props.children}
        </Tooltip>
    );

});