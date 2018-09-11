import {assert} from 'chai';
import {SpectronMain2} from '../../js/test/SpectronMain2';
import {UINotifier} from '../../js/electron/ui_notifier/UINotifier';
import {MainIPCEvent} from '../../js/electron/framework/IPCMainPromises';

SpectronMain2.create().run(async state => {

    const helloPromise: Promise<MainIPCEvent<string>>
        = UINotifier.once(state.window.webContents, 'hello');

    state.window.loadURL(`file://${__dirname}/app.html`);

    const mainIPCEvent = await helloPromise;

    assert.equal(mainIPCEvent.message, 'world');

    await state.testResultWriter.write(true);

});
