import {SpectronMain2} from '../../js/test/SpectronMain2';
import {CaptureController} from '../../js/capture/controller/CaptureController';
import {CacheRegistry} from '../../js/backend/proxyserver/CacheRegistry';
import {ProxyServerConfig} from '../../js/backend/proxyserver/ProxyServerConfig';
import {AppPaths} from '../../js/electron/webresource/AppPaths';

SpectronMain2.create().run(async state => {

    const proxyServerConfig = new ProxyServerConfig();
    const cacheRegistry = new CacheRegistry(proxyServerConfig);

    const captureController = new CaptureController(cacheRegistry);

    captureController.start();

    const appPath = AppPaths.resource("./apps/browser/index.html");

    console.log("Loading app: " + appPath);

    state.window.loadURL(appPath);

    await state.testResultWriter.write(true);

});
