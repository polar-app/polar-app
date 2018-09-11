import {assert, expect} from 'chai';
import {webContents} from "electron";
import {SpectronMain} from '../../js/test/SpectronMain';
import waitForExpect from 'wait-for-expect';

SpectronMain.run(async state => {

    state.window.loadFile(__dirname + '/app.html');

    // the only other way to get the WebContents from a Webview
    // is from the renderer via
    //
    // let webView = webFrame.getFrameForSelector('webview');

    await waitForExpect(() => {
        assert.equal(webContents.getAllWebContents().length, 2);
    });

    const allWebContents = webContents.getAllWebContents();

    assert.ok(webContents.fromId(allWebContents[0].id));
    assert.ok(webContents.fromId(allWebContents[1].id));

    await waitForExpect(() => {
        expect(allWebContents[0].getURL())
            .to.satisfy((current: string) => current.endsWith('webview-discovery/example.html'));
    });

    await waitForExpect(() => {
        expect(allWebContents[1].getURL())
            .to.satisfy((current: string) => current.endsWith('webview-discovery/app.html'));
    });

    await state.testResultWriter.write(true);

});

