import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {LogsContent} from './LogsContent';
import CopyLogsToClipboardButton from './CopyLogsToClipboardButton';
import ClearLogsButton from './ClearLogsButton';
import {FixedNav, FixedNavBody} from '../FixedNav';
import {RepoHeader} from '../repo_header/RepoHeader';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";

const log = Logger.create();

export default class LogsScreen extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoHeader persistenceLayerProvider={this.props.persistenceLayerProvider}
                                persistenceLayerController={this.props.persistenceLayerController}/>

                    <div style={{display: 'flex'}} className="p-1">

                        <div className="mb-1">
                            <CopyLogsToClipboardButton/>
                        </div>

                        <div className="ml-1 mb-1">
                            <ClearLogsButton/>
                        </div>

                    </div>

                </header>

                <FixedNavBody className="container-fluid">

                    <div className="row">

                        <div className="col-lg-12">

                            <div className="mb-2 p-1">
                                <LogsContent/>
                            </div>

                        </div>

                    </div>

                </FixedNavBody>

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
