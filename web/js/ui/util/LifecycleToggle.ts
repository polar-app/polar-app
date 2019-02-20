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

    /**
     * The initial value is false, After that the value is true.
     */
    public static markOnceRequested(key: string) {

        const currentValue =
            Optional.of(window.localStorage.getItem(key)).getOrElse('false');

        const result = currentValue === 'true';

        this.markHandled(key);

        return result;

    }

    private static markHandled(key: string): void {
        window.localStorage.setItem(key, 'true');
    }

}
