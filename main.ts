import {app} from 'electron';
import {Logger} from './web/js/logger/Logger';
import {MainApp} from './web/js/apps/main/MainApp';
import {Cmdline} from './web/js/electron/Cmdline';
import {Logging} from './web/js/logger/Logging';
import {Datastores} from './web/js/datastore/Datastores';

const log = Logger.create();

let hasSingleInstanceLock = app.requestSingleInstanceLock();

if( ! hasSingleInstanceLock) {
    log.info("Quiting.  App is single instance.");
    app.quit();
}

app.on('ready', async () => {

    let datastore = Datastores.create();

    await datastore.init();

    await Logging.init();

    let mainApp = new MainApp(datastore);
    let {mainAppController} = await mainApp.start();

    let fileArg = Cmdline.getDocArg(process.argv);

    if(fileArg) {
        log.info("Opening file given on the command line: " + fileArg);
        await mainAppController.handleLoadDoc(fileArg);
    }

});
