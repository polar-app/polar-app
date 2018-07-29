import {Entry} from '../../js/apps/card_creator/Entry';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {

    await new Entry().start();

});
