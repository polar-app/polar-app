import {SpectronMain} from '../../js/test/SpectronMain';
import {DialogWindowService} from '../../js/ui/dialog_window/DialogWindowService';

SpectronMain.run(async state => {

    let dialogWindowService = new DialogWindowService();
    dialogWindowService.start();

    state.window.loadFile(__dirname + '/app.html');
    
});
