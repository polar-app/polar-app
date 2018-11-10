import {SpectronRenderer} from "../../js/test/SpectronRenderer";

SpectronRenderer.run(async (state) => {

    console.log("Running within SpectronRenderer now.");

    history.pushState({}, "Home", "http://localapp.getpolarized.io/");

    state.testResultWriter.write(document.location!.href === "http://localapp.getpolarized.io/");

});


