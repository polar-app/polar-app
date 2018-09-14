import {SpectronMain2} from '../../js/test/SpectronMain2';
import {WebContentsPromises} from '../../js/electron/framework/WebContentsPromises';
import {Protocols} from '../../js/backend/interceptor/Protocols';
import {StreamInterceptors} from '../../js/backend/interceptor/StreamInterceptors';

SpectronMain2.create().run(async state => {


    for (const scheme of ['http', 'https']) {
        await Protocols.interceptStreamProtocol(scheme, (request, callback) => {

            setTimeout(() => {
                StreamInterceptors.handleWithNetRequest(request, callback);
            }, 0);

        });

    }

    // noinspection TsLint
    const url = "http://www.cnn.com";

    const didFinishLoadPromise = WebContentsPromises.once(state.window.webContents).didFinishLoad();

    state.window.loadURL(url);

    await didFinishLoadPromise;

    await state.testResultWriter.write(true);

    console.log("Wrote results to test writer!");

});
