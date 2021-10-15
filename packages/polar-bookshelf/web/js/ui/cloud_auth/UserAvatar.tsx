import Avatar from "@material-ui/core/Avatar";
import React from "react";
import {URLStr} from "polar-shared/src/util/Strings";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEqual from "react-fast-compare";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from 'clsx';
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        small: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        medium: {
            width: theme.spacing(5),
            height: theme.spacing(5),
        },
        large: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        },
        xlarge: {
            width: theme.spacing(9),
            height: theme.spacing(9),
        },
    }),
);

interface UserAvatarProps {
    readonly photoURL: URLStr | undefined;
    readonly displayName: string | undefined;
    readonly size?: 'small' | 'medium' | 'large' | 'xlarge';
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly onClick?: () => void;
}

export const UserAvatar = React.memo(function UserAvatar(props: UserAvatarProps) {

    const classes = useStyles();

    const size = props.size || 'small';

    const displayName = props.displayName ? props.displayName.trim() : "";

    const classNameMap = {
        small: classes.small,
        medium: undefined,
        large: classes.large,
        xlarge: classes.xlarge,
    };

    const className = clsx([classNameMap[size], props.className]);

    if (props.photoURL) {

        return <Avatar className={className} style={props.style} src={props.photoURL}/>;

    } else if (displayName !== '') {

        // Revert to letter avatars...

        const letter = displayName[0].toUpperCase();
        
        return <Avatar className={className} style={props.style}>{letter} </Avatar>;

    } else {

        return <Avatar className={className} style={props.style}>
            <AccountCircleIcon/>
        </Avatar>;
    }

}, isEqual);

interface UserAvatarIconButtonProps extends UserAvatarProps {
    readonly onClick?: () => void;
}

export const UserAvatarIconButton = React.memo(function UserAvatarIconButton(props: UserAvatarIconButtonProps) {

    return (
        <IconButton onClick={props.onClick} className={props.className} style={props.style}>
            <UserAvatar {...props}/>
        </IconButton>
    )

});