import {assert} from 'chai';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

import {wait} from 'dom-testing-library';
import {PolarDataDir} from '../../js/test/PolarDataDir';
import {Repository} from "../../js/apps/repository/Repository";

SpectronRenderer.run(async (state) => {

    await PolarDataDir.useFreshDirectory('.test-repository-app');

    await new Repository().start();

    console.log("Running within SpectronRenderer now.");

    await wait(() => {
        console.log("Looking for elements...");

        // now wait for the page to be rendered with documents
        assert.ok(document.getElementById('doc-table'));
        return document.querySelectorAll("#doc-table .rt-tr-group").length >= 0;
    });

    await state.testResultWriter.write(true);

});

