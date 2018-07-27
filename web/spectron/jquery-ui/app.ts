import {SpectronRenderer} from '../../js/test/SpectronRenderer';
import {assert} from 'chai';
import {RendererTestResultWriter} from '../../js/test/results/writer/RendererTestResultWriter';

declare var global: any;
global.$ = global.jQuery = require("jquery");
// require("jqueryui");

SpectronRenderer.run(async () => {
    console.log("Running within SpectronRenderer now.");

    assert.notEqual($("h1"), null);

    let testResultWriter = new RendererTestResultWriter();
    testResultWriter.write(true);

    // $( function() {
    //     $( ".myDialog" ).dialog({
    //         width: 800,
    //         height: 800
    //     });
    // } );

});
