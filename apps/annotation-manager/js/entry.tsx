import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {Logger} from '../../../web/js/logger/Logger';

const log = Logger.create();

try {

    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );

} catch (e) {
    log.error("Could not render app: ", e);
}
