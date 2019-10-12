import {Optional} from "polar-shared/src/util/ts/Optional";
import {DurationStr} from 'polar-shared/src/util/TimeDurations';
import {TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {Preconditions} from "polar-shared/src/Preconditions";

export abstract class Prefs {

    // TODO: migrate to using KeyValueStore

    /**
     * A marked pref is a pref that is boolean true or false
     */
    public mark(key: string, value: boolean = true): void {

        if (value) {
            this.set(key, 'true');
        } else {
            this.set(key, 'false');
        }

    }

    public toggleMarked(key: string, value: boolean = false) {
        this.mark(key, !this.isMarked(key, value));
    }

    public isMarked(key: string, defaultValue: boolean = false) {

        const currentValue =
            this.get(key).getOrElse(`${defaultValue}`);

        return currentValue === 'true';

    }

    public markDelayed(key: string, duration: DurationStr = "1w") {

        const durationMS = TimeDurations.toMillis(duration);
        const after = Date.now() + durationMS;
        this.set(key, `${after}`);

    }

    public isMarkedDelayed(key: string): boolean {

        const val = this.get(key).getOrElse('');

        if (val.match(/[0-9]+/)) {
            return Date.now() < parseInt(val);
        }

        return false;

    }

    /**
     * Return true if the given pref is defined.
     */
    public defined(key: string) {
        return this.get(key).isPresent();
    }

    /**
     * Get a current pref value.
     */
    public abstract get(key: string): Optional<string>;

    /**
     * Set a current pref value.
     */
    public abstract set(key: string, value: string): void;

    public abstract toDict(): StringToStringDict;

}

/**
 * A prefs object that can be persisted to disk
 */
export interface PersistentPrefs extends Prefs {

    /**
     * Commit this prefs.
     */
    commit(): Promise<void>;

}

/**
 * Prefs object just backed by a local dictionary.
 */
export class DictionaryPrefs extends Prefs {

    protected delegate: StringToStringDict = {};

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

export class CompositePrefs implements PersistentPrefs {

    /**
     * The primary delegate
     */
    private delegate: PersistentPrefs;

    private delegates: ReadonlyArray<PersistentPrefs>;

    constructor(delegates: ReadonlyArray<PersistentPrefs>) {
        this.delegate = Preconditions.assertPresent(delegates[0], 'delegate');
        this.delegates = delegates;
    }

    public defined(key: string): boolean {
        return this.delegate.defined(key);
    }

    public get(key: string): Optional<string> {
        return this.delegate.get(key);
    }

    public isMarked(key: string, defaultValue?: boolean): boolean {
        return this.delegate.isMarked(key, defaultValue);
    }

    public isMarkedDelayed(key: string): boolean {
        return this.delegate.isMarkedDelayed(key);
    }

    public mark(key: string, value?: boolean): void {
        return this.delegate.mark(key, value);
    }

    public markDelayed(key: string, duration?: string): void {
        return this.delegate.markDelayed(key, duration);
    }

    public toDict(): StringToStringDict {
        return this.delegate.toDict();
    }

    public toggleMarked(key: string, value?: boolean): void {
        return this.toggleMarked(key, value);
    }

    public async commit(): Promise<void> {

        for (const delegate of this.delegates) {
            await this.delegate.commit();
        }

    }

    public set(key: string, value: string): void {

        for (const delegate of this.delegates) {
            this.delegate.set(key, value);
        }

    }

}

export class NonPersistentPrefs extends DictionaryPrefs implements PersistentPrefs {

    public async commit(): Promise<void> {

    }

}

export interface StringToStringDict {
    [key: string]: string;
}
