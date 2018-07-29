import {SpectronMain, SpectronMainOptions, WindowFactory} from '../../js/test/SpectronMain';
import {
    DialogWindow,
    DialogWindowOptions,
    Resource, ResourceType
} from '../../js/ui/dialog_window/DialogWindow';

let windowFactory: WindowFactory = async () => {

    let resource = new Resource(ResourceType.FILE, __dirname + "/app.html");
    let dialogWindow = await DialogWindow.create(new DialogWindowOptions(resource));
    dialogWindow.window.webContents.toggleDevTools();
    return dialogWindow.window;
};

let options = new SpectronMainOptions(windowFactory);

SpectronMain.run(async state => {

    await state.testResultWriter.write(true);

}, options);
