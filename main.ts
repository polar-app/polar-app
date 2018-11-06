
import process from 'process';

process.on('uncaughtException', err => {
    console.log("FIXME");
});

process.on('unhandledRejection', err => {
    console.log("FIXME2");
});

import {app} from 'electron';
import {Logger} from './web/js/logger/Logger';
import {MainApp} from './web/js/apps/main/MainApp';
import {Cmdline} from './web/js/electron/Cmdline';
import {Logging} from './web/js/logger/Logging';
import {Datastores} from './web/js/datastore/Datastores';





console.log("FIXME: ", process.listeners);

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
    console.error("Quiting.  App is single instance.");
    app.quit();
}

async function launch() {

    const log = Logger.create();

    const datastore = Datastores.create();

    await datastore.init();

    await Logging.init();

    const mainApp = new MainApp(datastore);
    const {mainAppController} = await mainApp.start();

    const fileArg = Cmdline.getDocArg(process.argv);

    if (fileArg) {
        log.info("Opening file given on the command line: " + fileArg);
        await mainAppController.handleLoadDoc(fileArg);
    }

}

app.on('ready', async () => {

    launch().catch(err => console.error("Unable to launch app: ", err));

});
