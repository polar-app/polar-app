import {remote} from 'electron';
import {CIDProvider} from './CIDProvider';
import {Logger} from '../logger/Logger';

const log = Logger.create();

/**
 * @ElectronRendererContext
 */
export class CIDProviders {

    public static getInstance(): CIDProvider {
        return remote.getGlobal('cidProvider');
    }

    public static setInstance(provider: CIDProvider) {
        remote.getGlobal('cidProvider').value = provider.get();
        log.debug("value is now: " + JSON.stringify(this.getInstance()));
    }

}
