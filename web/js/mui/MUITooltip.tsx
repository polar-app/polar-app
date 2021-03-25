import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export const TOOLTIP_LEAVE_DELAY = 0;

export const TOOLTIP_ENTER_DELAY = 500;

export const TOOLTIP_ENTER_NEXT_DELAY = 500;

interface IProps {

    readonly children: React.ReactElement;

    /**
     * If the tooltip isn't specified we don't use a tooltip.
     */
    readonly title?: string;

    readonly placement?:
        | 'bottom-end'
        | 'bottom-start'
        | 'bottom'
        | 'left-end'
        | 'left-start'
        | 'left'
        | 'right-end'
        | 'right-start'
        | 'right'
        | 'top-end'
        | 'top-start'
        | 'top';

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

export const MUITooltip = React.memo(function MUITooltip(props: IProps) {

    if (props.title === undefined) {
        return props.children;
    }

    return (
        <Tooltip title={props.title}
                 arrow={true}
                 placement={props.placement}
                 disableTouchListener={true}
                 disableFocusListener={true}
                 // disableFocusListener={props.disableFocusListener || props.disabled}
                 // disableHoverListener={props.disableHoverListener || props.disabled}
                 // disableTouchListener={props.disableTouchListener || props.disabled}
                 enterNextDelay={TOOLTIP_ENTER_NEXT_DELAY}
                 enterDelay={TOOLTIP_ENTER_DELAY}
                 leaveDelay={TOOLTIP_LEAVE_DELAY}>
            {props.children}
        </Tooltip>
    );

});
