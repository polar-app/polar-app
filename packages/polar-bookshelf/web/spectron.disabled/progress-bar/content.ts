import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {

    const intervals = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    let remaining = Object.assign([], intervals);

    const timeout = 500;

    function updateProgress() {

        if (remaining.length === 0) {
            remaining = Object.assign([], intervals);
        }

        setTimeout(updateProgress, 500);

    }

    setTimeout(updateProgress, 500);

});




