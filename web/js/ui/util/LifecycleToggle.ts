import {Optional} from '../../util/ts/Optional';

export class LifecycleToggle {

    public static toggle(key: string, handler: () => void): void {

        const currentValue =
            Optional.of(window.localStorage.getItem(key)).getOrElse('false');

        if (currentValue === 'true') {
            return;
        }

        handler();

        this.markHandled(key);

    }

    private static markHandled(key: string): void {

        window.localStorage.setItem(key, 'true');

    }

}
