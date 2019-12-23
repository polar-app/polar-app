import * as React from 'react';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {LinkDropdown} from './LinkDropdown';
import {HelpDropdown} from './HelpDropdown';
import {SettingsDropdown} from './SettingsDropdown';
import {Prefs} from '../../../../web/js/util/prefs/Prefs';
import {ChromeExtensionInstallButton} from '../ChromeExtensionInstallButton';
import {Notifications} from '../../../../web/js/ui/notifications/Notifications';
import {Platforms} from "polar-shared/src/util/Platforms";
import {RepoNavbar} from "../RepoNavbar";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {HolidayPromotionButton} from "./HolidayPromotionButton";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {NavIcon} from "../nav/NavIcon";

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
                <div style={{display: 'flex'}} className="border-bottom">

                    <div className="ml-1 mr-1 mt-1"
                         style={{
                             flexGrow: 1
                         }}>
                        <div className="mr-1">
                            <NavIcon/>
                        </div>

                        {this.props.left}

                    </div>

                    <div>
                        {this.props.right}
                    </div>

                </div>
            );

        }

    };

    public static Desktop = class extends RepoHeader {

        public render() {

            const Settings = () => {

                const prefs = (): Prefs | undefined => {

                    const persistenceLayer = this.props.persistenceLayerProvider();

                    if (! persistenceLayer) {
                        return undefined;
                    }

                    return persistenceLayer.datastore.getPrefs().get();

                };

                return ( <SettingsDropdown prefs={prefs} hidden={Platforms.isMobile()}/> );

            };

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

                                <HolidayPromotionButton/>

                                <ChromeExtensionInstallButton/>

                                <Notifications persistenceLayerProvider={this.props.persistenceLayerProvider}/>

                                <CloudAuthButton persistenceLayerController={this.props.persistenceLayerController} />

                                <LinkDropdown hidden={Platforms.isMobile()}/>

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
    readonly left?: React.ReactElement;
    readonly right?: React.ReactElement;
}

interface IState {

}
