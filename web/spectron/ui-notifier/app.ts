import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {UINotifiers} from '../../js/electron/ui_notifier/UINotifiers';

SpectronRenderer.run(async () => {
    UINotifiers.dispatchEvent('hello', 'world');
});
