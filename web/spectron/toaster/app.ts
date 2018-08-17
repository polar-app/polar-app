import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {Toaster} from '../../js/toaster/Toaster';

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    Toaster.success('hello', 'world');

});
