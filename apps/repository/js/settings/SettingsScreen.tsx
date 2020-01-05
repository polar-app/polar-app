import * as React from 'react';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {SwitchButton} from "../../../../web/js/ui/SwitchButton";
import {PersistentPrefs} from "../../../../web/js/util/prefs/Prefs";
import {NullCollapse} from "../../../../web/js/ui/null_collapse/NullCollapse";
import {Devices} from "../../../../web/js/util/Devices";
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";
import {Logger} from "polar-shared/src/logger/Logger";
import {DefaultPageLayout} from "../page_layout/DefaultPageLayout";

const log = Logger.create();

interface SettingEntryProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly prefs: PersistentPrefs | undefined;
    readonly preview?: boolean;
    readonly defaultValue?: boolean;
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

    const {prefs, name, defaultValue} = props;

    if (! prefs) {
        return null;
    }

    const value = prefs.isMarked(name, defaultValue);

    const onChange = (value: boolean) => {
        console.log("Setting " + name);
        FeatureToggles.set(name, value);
        prefs.mark(name, value);

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
                    <b>{props.title}</b>
                </div>

                <div className="mt-auto mb-auto">
                    <SwitchButton size="lg"
                                  onChange={value => onChange(value)} initialValue={value}/>
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

    const prefs = getPrefs();

    return (

        <DefaultPageLayout {...props}>
            <div className="">
                <h2>General</h2>

                <p>
                    General settings. Note that some of these may require you to reload.
                </p>

                <SettingEntry title="Automatically resume reading position"
                              description="This feature restores the document reading position using pagemarks when reopening a document."
                              name="settings-auto-resume"
                              defaultValue={true}
                              prefs={prefs}/>

                <SettingEntry title="Enable groups"
                              description="Enables the new groups functionality for sharing documents with other users."
                              name="groups"
                              prefs={prefs}
                              preview={true}/>

                <NullCollapse open={ ! Devices.isDesktop()}>
                    <SettingEntry title="Table and phone reading"
                                  description="Enabled document reading on tablet and phone devices.  This is currently under development and probably will not work."
                                  name="mobile-reading"
                                  prefs={prefs}
                                  preview={true}/>
                </NullCollapse>

                <SettingEntry title="Development"
                              description="Enables general development features for software engineers working on Polar."
                              name="dev"
                              prefs={prefs}
                              preview={true}/>

            </div>

        </DefaultPageLayout>
    );
};

