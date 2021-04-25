import * as React from "react";
import {Nav} from "../ui/util/Nav";
import {Analytics} from "../analytics/Analytics";
import {URLStr} from "polar-shared/src/util/Strings";
import {IEvent} from "../analytics/firestore/Events";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {

        },
        icon: {
            fontSize: '2.5rem',
            color: theme.palette.text.secondary
        }

    }),
);

interface IProps {
    readonly id?: string;
    readonly icon?: React.FunctionComponent<{className?: string}>;
    readonly text: string;

    readonly secondary?: string;

    readonly disabled?: boolean;

    readonly onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;

    /**
     * Load the given URL rather than handling the click handler
     */
    readonly link?: URLStr;

    /**
     * The event to emit when this link is interacted with.
     */
    readonly event?: string | IEvent;

}

export const SideNavQuestionMenuItem = React.forwardRef<HTMLLIElement, IProps>((props, ref) => {

    const classes = useStyles();

    const onClick = React.useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {

        if (props.onClick) {
            props.onClick(event);
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

    }, [props]);

    const Icon = props.icon;

    return (
        <MenuItem id={props.id}
                  ref={ref}
                  disabled={props.disabled}
                  onClick={onClick}>

            {Icon &&
                <ListItemIcon>
                    <Icon className={classes.icon}/>
                </ListItemIcon>}

            <ListItemText primary={
                              <span style={{
                                       fontSize: '1.3rem'
                                   }}>
                                  {props.text}
                              </span>
                          }
                          secondary={
                              <span style={{
                                       fontSize: '1.1rem'
                                   }}>
                                  {props.secondary}
                              </span>
                          }/>

        </MenuItem>
    );

});
