import {SpectronMain} from '../../../js/test/SpectronMain';

SpectronMain.run(async state => {

    state.window.loadURL( 'file:' +__dirname + '/app.html');

    await state.testResultWriter.write(true);

});
