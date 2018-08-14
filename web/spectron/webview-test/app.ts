import {webContents, webFrame} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Promises} from '../../js/util/Promises';

function traceWebFrames(wf: Electron.WebFrame) {

    if(wf == null) {
        return;
    }

}

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    console.log("FIXME: webContents: " , webContents);
    console.log("FIXME: webFrame: " , webFrame);

    //console.log("FIXME: webFrame findFrameByName('foo'): " , webFrame.findFrameByName('foo'));
    //console.log("FIXME: webFrame findFrameByName('foo2'): " , webFrame.findFrameByName('foo2'));

    // FIXME this works!!!! but it doesn't seem like I can communicat ewith it.
    let iframeWebFrame = webFrame.getFrameForSelector('iframe');

    console.log("FIXME: iframeWebFrame", iframeWebFrame)
    console.log("FIXME iframeWebFrame location: ", await iframeWebFrame.executeJavaScript('document.location.href;'));

    // setZoomLevel on teh iframe seems to change the root webFrame

});


