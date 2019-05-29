import * as React from 'react';
import {Logging} from '../../../web/js/logger/Logging';
import {Logger} from '../../../web/js/logger/Logger';
import * as ReactDOM from 'react-dom';
import App from './App';

const log = Logger.create();

async function start() {

    await Logging.init();

    ReactDOM.render(
        <App/>,
        document.getElementById('root') as HTMLElement
    );
}

start().catch(err => log.error("Could not start app: ", err));
