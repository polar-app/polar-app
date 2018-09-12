import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Capture} from '../../js/capture/Capture';
import {BrowserProfiles} from '../../js/capture/BrowserProfiles';
import BrowserRegistry from '../../js/capture/BrowserRegistry';
import {DefaultLinkProvider} from '../../js/capture/link_provider/DefaultLinkProvider';
import {ResolveableLinkProvider} from '../../js/capture/link_provider/ResolveableLinkProvider';

SpectronMain2.create().run(async state => {

    const browser = BrowserRegistry.DEFAULT;

    const linkProvider = new ResolveableLinkProvider()

    const browserProfile = BrowserProfiles.toBrowserProfile(browser, 'DEFAULT', linkProvider);

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
