import * as React from 'react';
import { ListItem, ListItemIcon, ListItemProps, ListItemText } from '@material-ui/core';

interface ListItemLinkButtonProps {
    icon?: JSX.Element;
    text: string;
    href: string;
}

export const ListItemLinkButton = React.memo(function ListItemLinkButton(props: ListItemLinkButtonProps) {

    return (
        <ListItemLink href={props.href}>
            {props.icon && <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
            }
            <ListItemText primary={props.text}/>
        </ListItemLink>
    );
});

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
    return <ListItem button component="a" {...props} />;
}