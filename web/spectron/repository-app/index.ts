import {SpectronMain2} from '../../js/test/SpectronMain2';

SpectronMain2.create().run(async state => {

    state.window.loadURL(`file://${__dirname}/app.html`);

});
