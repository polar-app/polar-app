import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {DialogWindowClient} from '../../js/ui/dialog_window/DialogWindowClient';
import {
    DialogWindowOptions,
    Resource,
    ResourceType
} from '../../js/ui/dialog_window/DialogWindow';

SpectronRenderer.run(async () => {

    console.log("Going to create dialog");

    let appPath = __dirname + "/dialog.html";
    let resource = new Resource(ResourceType.FILE, appPath);
    let dialogWindowOptions = new DialogWindowOptions(resource);

    let dialogWindowClient = new DialogWindowClient();

    dialogWindowClient.create(dialogWindowOptions);

    console.log("Running within SpectronRenderer now.");

});
