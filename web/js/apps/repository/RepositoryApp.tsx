import * as ReactDOM from 'react-dom';
import App from '../../../../apps/repository/js/App';
import * as React from 'react';

export class RepositoryApp {

    public async start() {

        ReactDOM.render(
            <App />,
            document.getElementById('root') as HTMLElement
        );

    }

}
