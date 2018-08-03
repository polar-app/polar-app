import {CardCreatorApp} from '../../js/apps/card_creator/CardCreatorApp';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {

    await new CardCreatorApp().start();

});
