import {CreateFlashcardApp} from '../../js/apps/card_creator/CreateFlashcardApp';
import {SpectronRenderer} from '../../js/test/SpectronRenderer';

SpectronRenderer.run(async () => {

    await new CreateFlashcardApp().start();

});
