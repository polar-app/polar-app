import Avatar from "@material-ui/core/Avatar";
import React from "react";
import {URLStr} from "polar-shared/src/util/Strings";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEqual from "react-fast-compare";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from 'clsx';
import { IconButton } from "@material-ui/core";

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
    readonly onClick?: () => void;
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
            <IconButton onClick={props?.onClick} style={props.style} className={className}>
                <Avatar src={props.photoURL}> 
                </Avatar>
            </IconButton>
        );

    } else if (displayName !== '') {

        // Revert to letter avatars...

        const letter = displayName[0].toUpperCase();

        return (
            <IconButton style={props.style} className={className} onClick={props?.onClick}>
                <Avatar>
                    {letter}
                </Avatar>
            </IconButton>
        );

    } else {
        // else use a blank account image
        return (
            <IconButton className={className} style={props.style} onClick={props?.onClick}>
                <Avatar>
                    <AccountCircleIcon/>
                </Avatar>
            </IconButton>
        );
    }

}, isEqual);
