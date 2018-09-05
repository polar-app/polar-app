import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {RepositoryApp} from '../../js/apps/repository/RepositoryApp';

import {wait} from 'dom-testing-library';

SpectronRenderer.run(async (state) => {

    await new RepositoryApp().start();

    console.log("Running within SpectronRenderer now.");

    await wait(() => {
        // now wait for the page to be rendered with documents
        return document.querySelectorAll("#doc-table .rt-tr-group").length > 0;
    });

    await state.testResultWriter.write(true);

});

