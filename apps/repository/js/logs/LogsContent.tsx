import * as React from 'react';
import {Logger} from '../../../../web/js/logger/Logger';
import {RepoSidebar} from '../RepoSidebar';
import {WhatsNewContent} from '../splash/splashes/whats_new/WhatsNewContent';
import {LogMessage} from '../../../../web/js/logger/Logging';
import {ILogMessage} from 'electron-log';

const log = Logger.create();

export default class LogsContent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
            messages: []
        };

    }

    public render() {

        return (

            <div>

                Logs

            </div>

        );

    }

}

export interface IProps {

}

export interface IState {
    messages: ReadonlyArray<LogMessage>;
}
