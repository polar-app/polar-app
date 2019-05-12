import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {IStyleMap} from '../../../../web/js/react/IStyleMap';
import {CloudAuthButton} from '../../../../web/js/ui/cloud_auth/CloudAuthButton';
import {PersistenceLayerManager} from '../../../../web/js/datastore/PersistenceLayerManager';
import {RepoSidebar} from '../RepoSidebar';
import {SplitBar, SplitBarLeft, SplitBarRight} from '../SplitBar';
import {LinkDropdown} from './LinkDropdown';
import {HelpDropdown} from './HelpDropdown';
import {SettingsDropdown} from './SettingsDropdown';
import {Providers} from '../../../../web/js/util/Providers';
import {Prefs} from '../../../../web/js/util/prefs/Prefs';
import {ChromeExtensionInstallButton} from '../ChromeExtensionInstallButton';

const log = Logger.create();

const Styles: IStyleMap = {

};

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

                const persistenceLayer = this.props.persistenceLayerManager.get();

                if (! persistenceLayer) {
                    return undefined;
                }

                return persistenceLayer.datastore.getPrefs().get();

            };

            return ( <SettingsDropdown prefs={prefs}/> );

        };

        return (

            <div className="border-bottom">
                <SplitBar>

                    <SplitBarLeft>
                        <RepoSidebar/>
                    </SplitBarLeft>

                    <SplitBarRight>

                        <ChromeExtensionInstallButton/>

                        <CloudAuthButton persistenceLayerManager={this.props.persistenceLayerManager} />

                        <LinkDropdown/>

                        <HelpDropdown/>

                        <Settings/>

                    </SplitBarRight>

                </SplitBar>
            </div>

        );

    }

}

interface IProps {
    readonly persistenceLayerManager: PersistenceLayerManager;
}

interface IState {

}
