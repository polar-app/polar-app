import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Capture} from '../../js/capture/Capture';
import {BrowserProfiles} from '../../js/capture/BrowserProfiles';
import BrowserRegistry from '../../js/capture/BrowserRegistry';

SpectronMain2.create().run(async state => {

    const browser = BrowserRegistry.DEFAULT;

    const browserProfile = BrowserProfiles.toBrowserProfile(browser, 'DEFAULT');

    const url = "http://www.example.com";

    browserProfile.navigation.navigated.dispatchEvent({link: url});

    browserProfile.navigation.captured.dispatchEvent({});

    const capture = new Capture(browserProfile);

    await capture.start();

    // const proxyServerConfig = new ProxyServerConfig();
    // const cacheRegistry = new CacheRegistry(proxyServerConfig);
    //
    // const captureController = new CaptureController(cacheRegistry);
    //
    // captureController.start();
    //
    // const appPath = AppPaths.resource("./apps/browser/index.html");
    //
    // console.log("Loading app: " + appPath);
    //
    // state.window.loadURL(appPath);

    await state.testResultWriter.write(true);

});
