import {webContents, webFrame} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Promises} from '../../js/util/Promises';

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");
    // setZoomLevel on teh iframe seems to change the root webFrame

    console.log("FIXME: webContents: ", webContents);

    console.log("FIXME: webFrame: ", webFrame);

    let iframe = webFrame.findFrameByName('iframe');
    console.log("FIXME: webFrame by name: ", iframe);

    // TODO: now can I get webContents for it?

    //console.log("FIXME: webFrame by name: ", iframe);



});


