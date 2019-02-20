import {Optional} from '../../util/ts/Optional';

export class LifecycleToggle {

    public static toggle(key: string, handler: () => void): void {

        const currentValue =
            Optional.of(window.localStorage.getItem(key)).getOrElse('false');

        if (currentValue === 'true') {
            return;
        }

        handler();

        this.mark(key);

    }

    /**
     * The initial value is false, After that the value is true.
     */
    public static markOnceRequested(key: string) {

        const result = this.isMarked(key);

        this.mark(key);

        return result;

    }

    public static isMarked(key: string) {

        const currentValue =
            Optional.of(window.localStorage.getItem(key)).getOrElse('false');

        return currentValue === 'true';

    }

    public static mark(key: string): void {
        this.set(key, 'true');
    }

    public static get(key: string): Optional<string> {
        return Optional.of(window.localStorage.getItem(key));
    }

    public static set(key: string, value: string): void {
        window.localStorage.setItem(key, value);
    }

}
