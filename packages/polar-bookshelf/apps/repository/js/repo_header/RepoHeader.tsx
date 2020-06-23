import * as React from 'react';
import {AccountAuthButton} from '../../../../web/js/ui/cloud_auth/AccountAuthButton';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoNavbar} from "../RepoNavbar";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {NavIcon} from "../nav/NavIcon";
import {Link} from "react-router-dom";
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import {MUIPaperToolbar} from "../../../../web/js/mui/MUIPaperToolbar";

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoHeader extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const desktop = <RepoHeader.Desktop {...this.props}/>;
        const phoneAndTablet = <RepoHeader.PhoneAndTablet {...this.props}/>;

        return <DeviceRouter phone={phoneAndTablet} tablet={phoneAndTablet} desktop={desktop}/>;

    }

    public static PhoneAndTablet = class extends RepoHeader {

        public render() {

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

                            {this.props.toggle || null}

                            <div className="mr-1">
                                <NavIcon/>
                            </div>

                            {this.props.left}

                        </div>

                        <div className="mt-auto mb-auto"
                             style={{
                                 display: 'flex'
                             }}>

                            {this.props.right}

                            <Link to={{hash: 'account'}}>
                                {/*<CloudAuthButton persistenceLayerController={this.props.persistenceLayerController} />*/}
                            </Link>

                            {/*<CloudAuthButton persistenceLayerController={this.props.persistenceLayerController} />*/}

                        </div>

                    </div>
                </MUIPaperToolbar>
            );

        }

    };

    public static Desktop = class extends RepoHeader {

        public render() {

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
                            {this.props.left}
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
                                    {this.props.right}
                                </Grid>

                                <Grid item>
                                    <AccountAuthButton/>
                                </Grid>

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

    };

}

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
    readonly toggle?: React.ReactElement;
    readonly left?: React.ReactElement;
    readonly right?: React.ReactElement;
}

interface IState {

}
