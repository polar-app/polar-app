import {FixedNav} from "../FixedNav";
import * as React from "react";
import {AppBar, Box, Toolbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {useHistory} from "react-router-dom";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";

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

                            {! props.noBack && (
                                <IconButton onClick={()=>history.goBack()}>
                                    <ArrowBackIcon/>
                                </IconButton>
                            )}
                            {props.title}
                        </Toolbar>
                    </AppBar>
                </>

            </DeviceRouter.Handheld>

            <FixedNav.Body>

                <Box ml="auto" mr="auto"
                     style={{
                         maxWidth: props.fullWidth ? undefined : '700px',
                         overflow: 'auto',
                         flexGrow: 1,
                     }}>

                    {props.children}

                </Box>

            </FixedNav.Body>

        </FixedNav>
    );

});
