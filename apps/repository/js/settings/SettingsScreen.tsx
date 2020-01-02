import * as React from 'react';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {SwitchButton} from "../../../../web/js/ui/SwitchButton";
import {Prefs} from "../../../../web/js/util/prefs/Prefs";
import {RepoFooter} from "../repo_footer/RepoFooter";

interface SettingEntryProps {
    readonly title: string;
    readonly description: string;
    readonly name: string;
    readonly prefs: Prefs | undefined;
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
        prefs.mark(name, value);
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

export class SettingsScreen extends React.Component<IProps> {

    public render() {

        const getPrefs = (): Prefs | undefined => {
            const persistenceLayer = this.props.persistenceLayerProvider();

            if (! persistenceLayer || ! persistenceLayer.datastore) {
                return undefined;
            }

            return persistenceLayer.datastore.getPrefs().get();
        };

        const prefs = getPrefs();

        return (

            <FixedNav id="doc-repository" className="statistics-view">

                <header>

                    <RepoHeader persistenceLayerProvider={this.props.persistenceLayerProvider}
                                persistenceLayerController={this.props.persistenceLayerController}/>

                </header>

                <FixedNav.Body>

                    <div className="container mt-3"
                         style={{maxWidth: '700px'}}>

                        <div className="row text-lg">

                            <div className="col">
                                <h2>General</h2>

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

                                <SettingEntry title="Development"
                                              description="Enables general development features for software engineers working on Polar."
                                              name="dev"
                                              prefs={prefs}
                                              preview={true}/>

                            </div>

                        </div>
                    </div>


                </FixedNav.Body>

                <FixedNav.Footer>
                    <RepoFooter/>
                </FixedNav.Footer>

            </FixedNav>

        );
    }

}

export interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
}

export interface IState {
}
