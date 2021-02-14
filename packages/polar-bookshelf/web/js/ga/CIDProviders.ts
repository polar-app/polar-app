import {CIDProvider} from './CIDProvider';
import {Optional} from 'polar-shared/src/util/ts/Optional';

/**
 * @ElectronRendererContext
 */
export class CIDProviders {

    public static getInstance(): CIDProvider | null {
        return Optional.of(window.localStorage.getItem('cidProvider'))
            .map(value => new CIDProvider(value))
            .getOrNull();

    }

    public static setInstance(provider: CIDProvider) {

        const value = provider.get();

        if (value) {
            window.localStorage.setItem('cidProvider', value);
        }

    }

}
