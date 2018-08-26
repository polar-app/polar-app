import {Screenshots} from '../../js/screenshots/Screenshots';

Screenshots.capture({x: 0, y: 0, width: 100, height: 100})
    .then(screenshot => {
        console.log("Got screenshot: ", screenshot);
    });
