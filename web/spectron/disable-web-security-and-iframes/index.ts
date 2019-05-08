import {SpectronMain2} from '../../js/test/SpectronMain2';

SpectronMain2.create().run(async state => {

    await state.window.loadURL(`https://kyso.io/KyleOS/nbestimate`, {extraHeaders: "Content-Security-Policy: '*'"});


    // await state.window.loadURL(`https://getpolarized.io/capture-debug/iframe-1.html`, {extraHeaders: "Content-Security-Policy: '*'"});
    //

    await state.testResultWriter.write(true);

});

