import {webContents, webFrame} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {
    console.log("This is from the iframe");

    console.log("FIXME: webFrame iframe: " , webFrame);

});


