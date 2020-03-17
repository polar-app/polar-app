import * as React from 'react';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {LinkDropdown} from './LinkDropdown';
import {HelpDropdown} from './HelpDropdown';
import {ChromeExtensionInstallButton} from '../ChromeExtensionInstallButton';
import {Notifications} from '../../../../web/js/ui/notifications/Notifications';
import {RepoNavbar} from "../RepoNavbar";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {NavIcon} from "../nav/NavIcon";
import {Button} from "reactstrap";
import {Link} from "react-router-dom";
import {Devices} from "polar-shared/src/util/Devices";

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
                            <Button size="md" color="clear" className="btn-no-outline">
                                <i className="fas fa-user"/>
                            </Button>
                        </Link>

                        {/*<CloudAuthButton persistenceLayerController={this.props.persistenceLayerController} />*/}

                    </div>

                </div>
            );

        }

    };

    public static Desktop = class extends RepoHeader {

        public render() {

            const Settings = () => {

                return (
                    <Link to="/settings">
                        <Button size="md"
                                className="border ml-1 text-muted"
                                color="clear">
                            <i className="fas fa-cog" style={{fontSize: '17px'}}/>
                        </Button>
                    </Link>
                );

            };

            const isDesktop = Devices.isDesktop();

            return (

                <div className="border-bottom">

                    <div className="ml-1 mr-1 mt-1"
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

                            <div className="ml-auto mt-auto mb-auto"
                                 style={{display: 'flex'}}>

                                {this.props.right}

                                <ChromeExtensionInstallButton/>

                                <Notifications persistenceLayerProvider={this.props.persistenceLayerProvider}/>

                                <CloudAuthButton persistenceLayerController={this.props.persistenceLayerController} />

                                <LinkDropdown hidden={! isDesktop}/>

                                <HelpDropdown/>

                                <Settings/>

                            </div>

                        </div>

                    </div>

                </div>

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
