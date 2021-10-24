import Avatar from "@material-ui/core/Avatar";
import React from "react";
import {URLStr} from "polar-shared/src/util/Strings";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from 'clsx';
import {useUserInfoContext} from "../../apps/repository/auth_handler/UserInfoProvider";

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

export interface UserAvatarControlledProps {

    readonly photoURL: URLStr | undefined;
    readonly displayName: string | undefined;

    readonly size?: 'small' | 'medium' | 'large' | 'xlarge';
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly onClick?: () => void;

}

export const UserAvatarControlled = React.memo(function UserAvatar(props: UserAvatarControlledProps) {

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

});

export interface UserAvatarProps extends Pick<UserAvatarControlledProps, 'onClick' | 'size' | 'className' | 'style'> {

}

export const UserAvatar = React.memo(function UserAvatar(props: UserAvatarProps) {

    const userInfoContext = useUserInfoContext();
    return (
        <UserAvatarControlled {...props}
                              photoURL={userInfoContext?.userInfo?.photoURL}
                              displayName={userInfoContext?.userInfo?.displayName}/>
    )

});

