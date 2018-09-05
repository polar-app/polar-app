import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {RepositoryApp} from '../../js/apps/repository/RepositoryApp';

SpectronRenderer.run(async () => {
    await new RepositoryApp().start();

    console.log("Running within SpectronRenderer now.");
});

