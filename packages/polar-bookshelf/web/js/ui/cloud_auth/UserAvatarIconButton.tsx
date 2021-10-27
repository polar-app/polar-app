import React from "react";
import IconButton from "@material-ui/core/IconButton";
import {UserAvatar, UserAvatarProps} from "./UserAvatar";

interface UserAvatarIconButtonProps extends UserAvatarProps {
}

export const UserAvatarIconButton = React.memo(function UserAvatarIconButton(props: UserAvatarIconButtonProps) {

    return (
        <IconButton onClick={props.onClick} className={props.className} style={props.style}>
            <UserAvatar size={props.size} className={props.className} style={props.style}/>
        </IconButton>
    )

});
