import {remote} from 'electron';
import {CIDProvider} from './CIDProvider';
import {Logger} from '../logger/Logger';
import {isPresent, Preconditions} from '../Preconditions';

const log = Logger.create();

/**
 * @ElectronRendererContext
 */
export class CIDProviders {

    public static getInstance(): CIDProvider | null {
        return remote.getGlobal('cidProvider');
    }

    public static setInstance(provider: CIDProvider) {

        Preconditions.assertPresent(provider, "provider");

        if (! isPresent(remote.getGlobal('cidProvider'))) {
            log.warn("No global cid provider in remote");
            // note that we can't track anything at this point but we might be
            // in a testing framework which hasn't defined the variable we need
            // within main.
            return;
        }

        remote.getGlobal('cidProvider').value = provider.get();

        // log.debug("value is now: " + JSON.stringify(this.getInstance()));

    }

}
