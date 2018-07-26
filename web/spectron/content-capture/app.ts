import {ContentCaptureApp} from '../../js/capture/renderer/ContentCaptureApp';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.setup();

let contentCaptureApp = new ContentCaptureApp();

contentCaptureApp.start();

console.log("App loaded now!!");

// now request that the
