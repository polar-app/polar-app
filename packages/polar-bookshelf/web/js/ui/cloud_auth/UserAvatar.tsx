import Avatar from "@material-ui/core/Avatar";
import React from "react";
import {URLStr} from "polar-shared/src/util/Strings";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEqual from "react-fast-compare";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from 'clsx';

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

interface IProps {
    readonly photoURL: URLStr | undefined;
    readonly displayName: string | undefined;
    readonly size?: 'small' | 'medium' | 'large' | 'xlarge';
    readonly style?: React.CSSProperties;
    readonly className?: string;

}

export const UserAvatar = React.memo(function UserAvatar(props: IProps) {

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

        return (
            <Avatar src={props.photoURL}
                    className={className}
                    style={props.style}>
            </Avatar>
        );

    } else if (displayName !== '') {

        // Revert to letter avatars...

        const letter = displayName[0].toUpperCase();

        return (
            <Avatar className={className}
                    style={props.style}>
                {letter}
            </Avatar>
        );

    } else {
        // else use a blank account image
        return (
            <Avatar className={className}
                    style={props.style}>
                <AccountCircleIcon/>
            </Avatar>
        );
    }

}, isEqual);
