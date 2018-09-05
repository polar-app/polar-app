import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Toaster} from '../../js/toaster/Toaster';

import {assert} from 'chai';
import {wait} from 'dom-testing-library';

SpectronRenderer.run(async (state) => {
    console.log("Running within SpectronRenderer now.");

    Toaster.success('hello', 'world');

    await wait(() => {
        return assert.notEqual(document.querySelector('#toast-container'), null);
    });


    await wait(() => {

        let toastTitle = document.querySelector('.toast-title');
        let toastMessage = document.querySelector('.toast-message');

        assert.notEqual(toastTitle, null);
        assert.notEqual(toastMessage, null);

        assert.equal(toastTitle!.textContent, 'world');
        assert.equal(toastMessage!.textContent, 'hello');

    });

    await state.testResultWriter.write(true);

});
