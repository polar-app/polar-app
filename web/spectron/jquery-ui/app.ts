import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {assert} from 'chai';
import {RendererTestResultWriter} from '../../js/test/results/writer/RendererTestResultWriter';

declare var global: any;
global.$ = global.jQuery = require("jquery");
require("jquery-ui-bundle");

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    assert.notEqual($("h1"), null);

    let testResultWriter = new RendererTestResultWriter();

    $( function() {
        $( "#myDialog" ).dialog({
            width: 250,
            height: 250
        });
    } );

    // now make sure the DOM is updated
    assert.notEqual($(".ui-dialog"), null);

    testResultWriter.write(true);

});
