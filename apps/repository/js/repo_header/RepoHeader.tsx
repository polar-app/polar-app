import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {
    PersistenceLayerController,
    PersistenceLayerManager
} from '../../../../web/js/datastore/PersistenceLayerManager';
import {LinkDropdown} from './LinkDropdown';
import {HelpDropdown} from './HelpDropdown';
import {SettingsDropdown} from './SettingsDropdown';
import {Prefs} from '../../../../web/js/util/prefs/Prefs';
import {ChromeExtensionInstallButton} from '../ChromeExtensionInstallButton';
import {Notifications} from '../../../../web/js/ui/notifications/Notifications';
import {Platforms} from "polar-shared/src/util/Platforms";
import {RepoNavbar} from "../RepoNavbar";
import {UpgradeAccountButton} from "./UpgradeAccountButton";
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";

/**
 * Simple header for the repository which supports arbitrary children.
 */
export class RepoHeader extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const Settings = () => {

            const prefs = (): Prefs | undefined => {

                const persistenceLayer = this.props.persistenceLayerProvider();

                if (! persistenceLayer) {
                    return undefined;
                }

                return persistenceLayer.datastore.getPrefs().get().prefs;

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
                    </div>

                    <div style={{
                            flexGrow: 1,
                            display: 'flex'
                         }}>

                        <div className="ml-auto mt-auto mb-auto"
                             style={{display: 'flex'}}>

                            <UpgradeAccountButton/>

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

}

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
}

interface IState {

}
