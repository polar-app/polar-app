import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import Split from 'split.js';

SpectronRenderer.run(async () => {


    // Split(['#a', '#b'], {
    //     gutterSize: 4,
    //     cursor: 'col-resize'
    // });
    Split(['#c', '#d'], {
        direction: 'horizontal',
        sizes: [25, 75],
        gutterSize: 4,
        cursor: 'row-resize'
    });
    // Split(['#e', '#f'], {
    //     direction: 'vertical',
    //     sizes: [25, 75],
    //     gutterSize: 4,
    //     cursor: 'row-resize'
    // });

});

