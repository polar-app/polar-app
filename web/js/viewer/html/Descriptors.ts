import {notNull} from '../../Preconditions';
import {PHZMetadata} from '../../phz/PHZMetadata';
import {Logger} from '../../logger/Logger';
import {IDimensions} from '../../util/Dimensions';

const log = Logger.create();

export class Descriptors {

    public static calculateDocDimensions(descriptor?: PHZMetadata): DocDimensions {

        // the default width
        let width = 800;
        let minHeight = 1100;

        if(! descriptor) {
            return {width, minHeight};
        }

        if(descriptor.browser) {

            // use the screen width from the emulated device
            width = descriptor.browser.deviceEmulation.screenSize.width;

            log.info("Setting width from device emulation: " + width);

        }

        if( "scroll" in descriptor &&
            typeof descriptor.scroll.width === "number" &&
            descriptor.scroll.width > width ) {

            // we have a document that isn't mobile aware and hard coded to a
            // specific width greater than our default width.  This is a new
            // setting so we have to make sure the key is in the descriptor.

            width = descriptor.scroll.width;

            log.info("Setting width from scroll settings: " + width);

        }

        // page height size should be a function of 8.5x11

        minHeight = (11/8.5) * width;

        return {width, minHeight};

    }

}

export interface DocDimensions {
    width: number;
    minHeight: number;

}
