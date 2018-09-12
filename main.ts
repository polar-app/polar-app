import {app, crashReporter} from 'electron';
import {Logger} from './web/js/logger/Logger';
import {MainApp} from './web/js/apps/main/MainApp';
import {Cmdline} from './web/js/electron/Cmdline';
import {Logging} from './web/js/logger/Logging';
import {Datastores} from './web/js/datastore/Datastores';

const log = Logger.create();

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if( ! hasSingleInstanceLock) {
    log.info("Quiting.  App is single instance.");
    app.quit();
}

async function launch() {

    const datastore = Datastores.create();

    await datastore.init();

    await Logging.init();

    const mainApp = new MainApp(datastore);
    const {mainAppController} = await mainApp.start();

    const fileArg = Cmdline.getDocArg(process.argv);

    if(fileArg) {
        log.info("Opening file given on the command line: " + fileArg);
        await mainAppController.handleLoadDoc(fileArg);
    }

}

app.on('ready', async () => {

    launch().catch(err => log.error("Unable to launch app: ", err));

});
