import {CapturedScreenshots} from '../../js/screenshots/CapturedScreenshots';

CapturedScreenshots.capture({x: 0, y: 0, width: 100, height: 100})
    .then(capturedScreenshot => {
        console.log("Got screenshot: ", capturedScreenshot);
    });
