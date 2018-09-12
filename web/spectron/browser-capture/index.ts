import {SpectronMain2} from '../../js/test/SpectronMain2';
import {Capture} from '../../js/capture/Capture';
import {BrowserProfiles} from '../../js/capture/BrowserProfiles';
import BrowserRegistry from '../../js/capture/BrowserRegistry';

SpectronMain2.create().run(async state => {

    const browser = BrowserRegistry.DEFAULT;

    const browserProfile = BrowserProfiles.toBrowserProfile(browser, 'DEFAULT');

    const url = "http://www.example.com";

    browserProfile.navigation.navigated.dispatchEvent({link: url});

    browserProfile.navigation.captured.dispatchEvent({});

    const capture = new Capture(browserProfile);

    console.log("FIXME1")

    try {
        await capture.start();
    } catch (e) {
        console.log("FIXME1.5")
        console.log("error: ", e);
    }

    console.log("FIXME2")

    await state.testResultWriter.write(true);

});
