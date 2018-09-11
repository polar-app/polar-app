import {assert} from 'chai';
import {webFrame} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async (state) => {

    console.log("Running within SpectronRenderer now.");

    try {
        const webView = webFrame.findFrameByName('content');


    } catch (e) {
        console.log("FIXME: ", e);
    }
    //
    // assert.ok(webView);
    //
    // await state.testResultWriter.write(true);

});



