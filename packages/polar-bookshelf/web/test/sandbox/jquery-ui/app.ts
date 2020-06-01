import {SpectronRenderer} from '../../../js/test/SpectronRenderer';
import {assert} from 'chai';
import {RendererTestResultWriter} from '../../../js/test/results/writer/RendererTestResultWriter';
import {Dialog} from '../../../js/ui/dialog/Dialog';

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    assert.notEqual($("h1"), null);

    let testResultWriter = new RendererTestResultWriter();

    new Dialog("#myDialog").show();

    // now make sure the DOM is updated
    assert.notEqual($(".ui-dialog"), null);

    testResultWriter.write(true);

});
