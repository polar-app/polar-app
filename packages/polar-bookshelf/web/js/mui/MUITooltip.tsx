import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export const TOOLTIP_LEAVE_DELAY = 750;

export const TOOLTIP_ENTER_DELAY = 200;

interface IProps {

    readonly children: React.ReactElement;

    /**
     * If the tooltip isn't specified we don't use a tooltip.
     */
    readonly title?: string;

    // readonly disabled?: boolean;
    //
    // /**
    //  * Do not respond to focus events.
    //  */
    // readonly disableFocusListener?: boolean;
    //
    // /**
    //  * Do not respond to hover events.
    //  */
    // readonly disableHoverListener?: boolean;
    //
    // /**
    //  * Do not respond to long press touch events.
    //  */
    // readonly disableTouchListener?: boolean;

}

export const MUITooltip = React.memo((props: IProps) => {

    if (props.title === undefined) {
        return props.children;
    }

    return (
        <Tooltip title={props.title}
                 arrow={true}
                 // disableFocusListener={props.disableFocusListener || props.disabled}
                 // disableHoverListener={props.disableHoverListener || props.disabled}
                 // disableTouchListener={props.disableTouchListener || props.disabled}
                 enterDelay={TOOLTIP_ENTER_DELAY}
                 leaveDelay={TOOLTIP_ENTER_DELAY}>
            {props.children}
        </Tooltip>
    );

});