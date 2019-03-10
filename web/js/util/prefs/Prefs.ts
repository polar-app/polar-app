import {Optional} from "../ts/Optional";

export abstract class Prefs {

    public mark(key: string, value: boolean = true): void {

        if (value) {
            this.set(key, 'true');
        } else {
            this.set(key, 'false');
        }

    }

    public toggle(key: string, value: boolean = false) {
        this.mark(key, ! this.isMarked(key, value));
    }

    public isMarked(key: string, defaultValue: boolean = false) {

        const currentValue =
            this.get(key).getOrElse(`${defaultValue}`);

        return currentValue === 'true';

    }

    /**
     * Return true if the given pref is defined.
     */
    public defined(key: string) {
        return this.get(key).isPresent();
    }

    public abstract get(key: string): Optional<string>;

    public abstract set(key: string, value: string): void;

}

/**
 * Prefs object just backed by a local dictionary.
 */
export class DictionaryPrefs extends Prefs {

    public delegate: StringToStringDict = {};

    constructor(delegate: StringToStringDict = {}) {
        super();
        this.delegate = delegate;
    }

    public get(key: string): Optional<string> {
        return Optional.of(this.delegate[key]);
    }

    public set(key: string, value: string): void {
        this.delegate[key] = value;
    }

    public toDict(): StringToStringDict {
        return {...this.delegate};
    }

}

/**
 * Designed to be used in browsers.
 */
export class LocalStoragePrefs extends Prefs {

    public get(key: string): Optional<string> {
        return Optional.of(window.localStorage.getItem(key));
    }

    public set(key: string, value: string): void {
        window.localStorage.setItem(key, value);
    }

}

export interface StringToStringDict {
    [key: string]: string;
}
