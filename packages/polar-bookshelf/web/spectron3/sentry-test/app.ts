import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {SentryBrowserLogger} from '../../js/logger/SentryBrowserLogger';

SpectronRenderer.run(async (state) => {
    console.log("Running within SpectronRenderer now.");

    const sentryBrowserLogger = new SentryBrowserLogger();
    sentryBrowserLogger.error("This is a false error from renderer: ", new Error("Fake error from renderer"));

    await state.testResultWriter.write(true);
});
