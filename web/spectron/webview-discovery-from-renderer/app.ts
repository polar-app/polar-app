import {assert} from 'chai';
import {webFrame} from 'electron';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async (state) => {

    const content = <Electron.WebviewTag> document.querySelector("#content")!;

    assert.ok(content);

    content.addEventListener('dom-ready', async () => {

        const webContents = content.getWebContents();

        assert.ok(webContents);

        assert.ok(webContents.id);

        assert.ok(typeof webContents.id === 'number');

        await state.testResultWriter.write(true);

    });


});



