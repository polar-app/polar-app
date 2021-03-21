import {SpectronMain2} from '../../js/test/SpectronMain2';
import {SentryNodeLogger} from '../../js/logger/SentryNodeLogger';

SpectronMain2.create().run(async state => {

    const sentryLogger = new SentryNodeLogger();
    sentryLogger.error("This is a false error from main: ", new Error("Fake error from main"));

    await state.window.loadURL(`file://${__dirname}/app.html`);

});
