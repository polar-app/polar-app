import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import LogsContent from './LogsContent';
import CopyLogsToClipboardButton from './CopyLogsToClipboardButton';
import ClearLogsButton from './ClearLogsButton';
import {FixedNav, FixedNavBody} from '../FixedNav';

const log = Logger.create();

export default class LogsApp extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        return (

            <FixedNav id="doc-repository">

                <header>

                    <RepoSidebar/>

                    <div style={{display: 'flex'}}>

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

                            <div className="mb-2 pl-1 pr-1">
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

}

export interface IState {

}
