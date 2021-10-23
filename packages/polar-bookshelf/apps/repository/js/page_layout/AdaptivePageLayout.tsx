import {FixedNav} from "../FixedNav";
import * as React from "react";
import {AppBar, Box, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {useHistory} from "react-router-dom";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {UserAvatarIconButton} from "../../../../web/js/ui/cloud_auth/UserAvatarIconButton";

interface IProps {
    readonly title: string;
    readonly children: JSX.Element;
    readonly noBack?: boolean;
    readonly fullWidth?: boolean;
}

/**
 * Layout that is for pages that need to adapt across mobile, desktop+tablet and
 * optionally have a navbar.
 */
export const AdaptivePageLayout = React.memo(function AdaptivePageLayout(props: IProps) {

    const history = useHistory();

    return (
        <FixedNav className="AdaptivePageLayout">

            <DeviceRouter.Handheld>

                <>
                    <AppBar position="static">
                        <Toolbar>

                            <div>

                                {! props.noBack && (
                                    <IconButton onClick={() => history.goBack()}>
                                        <ArrowBackIcon/>
                                    </IconButton>
                                )}

                                {props.title}
                            </div>

                            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexGrow: 1}}>
                                <UserAvatarIconButton onClick={() => history.push('/account')}/>
                            </div>

                        </Toolbar>
                    </AppBar>
                </>

            </DeviceRouter.Handheld>

            <FixedNav.Body>

                <div style={{
                         overflow: 'auto',
                         flexGrow: 1
                     }}>

                    <Box ml="auto" mr="auto"
                         style={{
                             maxWidth: props.fullWidth ? undefined : '700px',
                         }}>

                        {props.children}

                    </Box>

                </div>

            </FixedNav.Body>

        </FixedNav>
    );

});
