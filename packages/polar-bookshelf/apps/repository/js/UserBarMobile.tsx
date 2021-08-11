import {createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {UserAvatar} from "../../../web/js/ui/cloud_auth/UserAvatar";
import {useUserInfoContext} from "../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {PolarSVGIcon} from "../../../web/js/ui/svg_icons/PolarSVGIcon";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 16px',
        },
        workspace: {
            textTransform: 'capitalize',
            fontSize: '1rem',
        },
    }),
);

export const UserBarMobile: React.FC = () => {
    const classes = useStyles();
    // TODO: this will be replaced with the namespace later
    const userInfo = useUserInfoContext()!.userInfo!;

    return (
        <div className={classes.root}>
            <PolarSVGIcon width={50} height={40} />
            <h2 className={classes.workspace}>{userInfo.displayName}'s Workspace</h2>
            <UserAvatar style={{ width: 40, height: 40 }}
                        displayName={userInfo.displayName}
                        photoURL={userInfo.photoURL}/>
        </div>
    );
};
