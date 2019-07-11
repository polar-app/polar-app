import {SpectronMain2} from '../../js/test/SpectronMain2';
import {MainDatastore} from '../../js/datastore/MainDatastore';

SpectronMain2.create().run(async state => {

    MainDatastore.create();

    await state.window.loadURL(`file://${__dirname}/app.html`);

});
