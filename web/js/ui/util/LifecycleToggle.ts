import {Optional} from '../../util/ts/Optional';
import {LocalPref} from './LocalPref';

export class LifecycleToggle extends LocalPref {

    public static toggle(key: string, handler: () => void): void {

        const currentValue =
            Optional.of(window.localStorage.getItem(key)).getOrElse('false');

        if (currentValue === 'true') {
            return;
        }

        handler();

        this.mark(key);

    }

}
