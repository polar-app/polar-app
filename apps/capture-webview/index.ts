
import {SpectronMain} from '../../web/js/test/SpectronMain';

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/index.html');

    state.window.setProgressBar(0.5);

    await state.testResultWriter.write(true);

});
