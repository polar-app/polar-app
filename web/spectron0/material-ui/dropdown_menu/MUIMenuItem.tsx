import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import * as React from "react";
import {URLStr} from "polar-shared/src/util/Strings";
import {Nav} from "../../../js/ui/util/Nav";
import {Analytics} from "../../../js/analytics/Analytics";

interface IEvent {
    readonly name: string;
    readonly data?: any;
}

interface IProps {
    readonly id?: string;
    readonly icon?: JSX.Element;
    readonly text: string;

    readonly onClick?: () => void;

    /**
     * Load the given URL rather than handling the click handler
     */
    readonly link?: URLStr;

    /**
     * The event to emit when this link is interacted with.
     */
    readonly event?: string | IEvent;

}

const onClick = (props: IProps) => {

    if (props.onClick) {
        props.onClick();
    } else if (props.link) {
        Nav.openLinkWithNewTab(props.link)
    }

    if (props.event) {
        if (typeof props.event === 'string') {
            Analytics.event2(props.event);
        } else {
            Analytics.event2(props.event.name, props.event.data);
        }
    }

};

export const MUIMenuItem = React.forwardRef((props: IProps, ref) => (

    <MenuItem id={props.id}
              onClick={() => onClick(props)}>

        {props.icon &&
            <ListItemIcon>
                {props.icon}
            </ListItemIcon>}

        <ListItemText primary={props.text} />

    </MenuItem>

));
