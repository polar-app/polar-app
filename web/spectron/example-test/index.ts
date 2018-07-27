import {SpectronMain} from '../../js/test/SpectronMain';

SpectronMain.run(state => {
    
    
    state.window.loadFile(__dirname + '/app.html');

    state.testResultWriter.write(true);

});
