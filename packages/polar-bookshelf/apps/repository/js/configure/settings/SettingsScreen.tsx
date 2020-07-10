import * as React from 'react';
import {useContext} from 'react';
import {PersistenceLayerController} from '../../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerProvider} from "../../../../../web/js/datastore/PersistenceLayer";
import {SwitchButton} from "../../../../../web/js/ui/SwitchButton";
import {PersistentPrefs} from "../../../../../web/js/util/prefs/Prefs";
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";
import {DefaultPageLayout} from "../../page_layout/DefaultPageLayout";
import {KnownPrefs} from "../../../../../web/js/util/prefs/KnownPrefs";
import {ConfigureNavbar} from '../ConfigureNavbar';
import {ConfigureBody} from "../ConfigureBody";
import {MUIThemeTypeContext} from "../../../../../web/js/mui/context/MUIThemeTypeContext";
import {useLogger} from "../../../../../web/js/mui/MUILogger";
import Divider from '@material-ui/core/Divider';
import {useHistory} from "react-router-dom";
import Button from '@material-ui/core/Button';

interface SettingEntryProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly prefs: PersistentPrefs | undefined;
    readonly preview?: boolean;
    readonly defaultValue?: boolean;

    /**
     * Optional callback to listen to settings.
     */
    readonly onChange?: (value: boolean) => void;
}

const PreviewWarning = (props: SettingEntryProps) => {

    if (props.preview) {
        return (
            <div className="text-danger text-sm">
                <p style={{fontSize: '1em'}}>
                    <b>Preview: </b> This is currently a preview feature and not yet ready for general use.
                    {/*Abandon hope all ye who enter here.*/}
                </p>
            </div>
        );
    } else {
        return null;
    }

};

const SettingEntry = (props: SettingEntryProps) => {

    const log = useLogger();

    const {prefs, name, defaultValue} = props;

    if (! prefs) {
        return null;
    }

    const value = prefs.isMarked(name, defaultValue);

    const onChange = (value: boolean) => {
        console.log("Setting " + name);
        FeatureToggles.set(name, value);
        prefs.mark(name, value);

        if (props.onChange) {
            props.onChange(value);
        }

        const doCommit = async () => {
            await prefs.commit();
            console.log("Prefs written");
        };

        doCommit()
            .catch(err => log.error("Could not write prefs: ", err));
    };

    return (
        <div>
            <div style={{display: 'flex'}}>

                <div className="mt-auto mb-auto"
                     style={{flexGrow: 1}}>
                    <h2><b>{props.title}</b></h2>
                </div>

                <div className="mt-auto mb-auto">
                    <SwitchButton size="medium"
                                  initialValue={value}
                                  onChange={value => onChange(value)} />
                </div>

            </div>

            <div>
                <p>
                    {props.description}
                </p>
            </div>

            <PreviewWarning {...props}/>

        </div>
    );

};


const ViewDeviceInfoButton = () => {

    const history = useHistory();

    return (
        <Button variant="contained" onClick={() => history.push("/device")}>
            View Device Info
        </Button>
    );

}

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
}

export const SettingsScreen = (props: IProps) => {

    const getPrefs = (): PersistentPrefs | undefined => {
        const persistenceLayer = props.persistenceLayerProvider();

        if (! persistenceLayer || ! persistenceLayer.datastore) {
            return undefined;
        }

        return persistenceLayer.datastore.getPrefs().get();
    };

    const {theme, setTheme} = useContext(MUIThemeTypeContext);

    const handleDarkModeToggle = (enabled: boolean) => {

        const theme = enabled ? 'dark' : 'light';

        setTimeout(() => setTheme(theme), 1);

    };

    const prefs = getPrefs();

    return (

        <DefaultPageLayout>
            <ConfigureBody>
                <ConfigureNavbar/>

                <div className="">
                    <h1>General</h1>

                    <p>
                        General settings. Note that some of
                        these may require you to reload.
                    </p>

                    <SettingEntry title="Dark Mode"
                                  description="Enable dark mode"
                                  name="dark-mode"
                                  defaultValue={theme === 'dark'}
                                  prefs={prefs}
                                  onChange={handleDarkModeToggle}
                    />

                    <SettingEntry
                        title="Automatically resume reading position"
                        description="This feature restores the document reading position using pagemarks when reopening a document."
                        name="settings-auto-resume"
                        defaultValue={true}
                        prefs={prefs}/>

                    {/*<SettingEntry title="Enable groups"*/}
                    {/*              description="Enables the new groups functionality for sharing documents with other users."*/}
                    {/*              name="groups"*/}
                    {/*              prefs={prefs}*/}
                    {/*              preview={true}/>*/}

                    <SettingEntry title="Automatic pagemarks"
                                  description="Enables auto pagemark creation as you scroll and read a document.  ONLY usable for the PDF documents."
                                  name={KnownPrefs.AUTO_PAGEMARKS}
                                  prefs={prefs}
                                  preview={true}/>

                    {/*<DeviceRouters.Desktop>*/}
                    {/*    <SettingEntry*/}
                    {/*        title="Table and phone reading"*/}
                    {/*        description="Enabled document reading on tablet and phone devices.  This is currently under development and probably will not work."*/}
                    {/*        name="mobile-reading"*/}
                    {/*        prefs={prefs}*/}
                    {/*        preview={true}/>*/}
                    {/*</DeviceRouters.Desktop>*/}

                    <SettingEntry title="Development"
                                  description="Enables general development features for software engineers working on Polar."
                                  name="dev"
                                  prefs={prefs}
                                  preview={true}/>

                    <Divider/>

                    <p>
                        <ViewDeviceInfoButton/>
                    </p>

                </div>

            </ConfigureBody>

        </DefaultPageLayout>
    );
};

