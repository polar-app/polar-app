import * as React from 'react';
import {RepoNavbar} from "../RepoNavbar";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {NavIcon} from "../nav/NavIcon";
import {Button} from "reactstrap";
import {Link} from "react-router-dom";
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";
import {CloudAuthButton2} from "../../../../web/js/ui/cloud_auth/CloudAuthButton2";

const PhoneAndTablet = () => {

    return (

        <MUIPaperToolbar borderBottom
                         padding={1}>

            <div style={{display: 'flex'}}
                 className="border-bottom p-1 mt-1">

                <div className="mr-1"
                     style={{
                         flexGrow: 1,
                         display: 'flex'
                     }}>

                    <div className="mr-1">
                        <NavIcon/>
                    </div>

                </div>

                <div className="mt-auto mb-auto"
                     style={{
                         display: 'flex'
                     }}>

                    <Link to={{hash: 'account'}}>
                        <Button size="md" color="clear" className="btn-no-outline">
                            <i className="fas fa-user"/>
                        </Button>
                    </Link>

                    {/*<CloudAuthButton persistenceLayerController={this.props.persistenceLayerController} />*/}

                </div>

            </div>
        </MUIPaperToolbar>
    );

}

const Desktop = () => {

    const Settings = () => {

        return (
            <Link to="/settings">
                <IconButton>
                    <SettingsIcon
                        // size="md"
                        //         className="border ml-1 text-muted"
                        //             color="clear"
                    >
                    </SettingsIcon>
                </IconButton>
            </Link>
        );

    };

    return (

        <MUIPaperToolbar borderBottom
                         padding={1}>

            <div className=""
                 style={{
                     display: 'flex'
                 }}>

                <div>
                    <RepoNavbar/>
                </div>

                <div style={{
                    flexGrow: 1,
                    display: 'flex'
                }}>


                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        justify="flex-end"
                        alignItems="center">

                        <Grid item>
                            <CloudAuthButton2/>
                        </Grid>

                        {/*<Grid item>*/}
                        {/*    <HelpDropdown/>*/}
                        {/*</Grid>*/}

                        <Grid item>
                            <Settings/>
                        </Grid>

                    </Grid>


                    {/*<ChromeExtensionInstallButton/>*/}

                    {/*<Notifications persistenceLayerProvider={this.props.persistenceLayerProvider}/>*/}

                    {/*<LinkDropdown hidden={! isDesktop}/>*/}

                </div>

            </div>

        </MUIPaperToolbar>

    );
}

/**
 * Simple header for the repository which supports arbitrary children.
 */
export const RepoHeader2 = React.memo(() => {

    const desktop = <Desktop/>;
    const phoneAndTablet = <PhoneAndTablet />;

    return <DeviceRouter phone={phoneAndTablet} tablet={phoneAndTablet} desktop={desktop}/>;

})
