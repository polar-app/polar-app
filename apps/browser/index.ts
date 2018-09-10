
import {SpectronMain} from '../../web/js/test/SpectronMain';

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/index.html');

    await state.testResultWriter.write(true);

});

