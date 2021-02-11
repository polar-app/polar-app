import {Optional} from "polar-shared/src/util/ts/Optional";
import {DurationStr, TimeDurations} from 'polar-shared/src/util/TimeDurations';
import {Preconditions} from "polar-shared/src/Preconditions";
import {
    ISODateTimeString,
    ISODateTimeStrings
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {
    PersistentPrefsUpdatedCallback,
    PrefsProvider
} from "../../datastore/Datastore";
import {
    OnErrorCallback,
    SnapshotUnsubscriber
} from "polar-shared/src/util/Snapshots";

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

        Preconditions.assertPresent(key, "key");

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

    public abstract toPrefDict(): StringToPrefDict;

}

export interface Pref {

    /**
     * The key for this pref
     */
    readonly key: string;

    /**
     * The value of this pref.
     */
    readonly value: string;

    /**
     * The time this pref was written.
     */
    readonly written: ISODateTimeString;
}

/**
 *
 * A prefs object that can be persisted to disk
 */
export interface IPersistentPrefs extends Prefs {

    /**
     * Update the current prefs with the source and return true
     * if any changes were made.
     */
    update(source: StringToPrefDict): boolean;

    fetch(key: string): Pref | undefined;

    /**
     * Get all the prefs.
     */
    prefs(): ReadonlyArray<Pref>;

    /**
     * Commit this prefs.
     */
    commit(): Promise<void>;

}

export interface InterceptedPersistentPrefs extends IPersistentPrefs {
    readonly __intercepted: true;
}

export type CommitCallback = (persistentPrefs: IPersistentPrefs) => Promise<void>;

export class InterceptedPrefsProvider {

    constructor(private readonly delegate: PrefsProvider,
                private readonly onCommit: CommitCallback) {

    }

    public get(): IPersistentPrefs {
        return this.intercept(this.delegate.get())!;
    }

    public subscribe(onNext: PersistentPrefsUpdatedCallback, onError: OnErrorCallback): SnapshotUnsubscriber {

        const handleOnNext = (persistentPrefs: IPersistentPrefs | undefined) => {
            onNext(this.intercept(persistentPrefs));
        };

        return this.delegate.subscribe(handleOnNext, onError);
    }

    private intercept(persistentPrefs: IPersistentPrefs | undefined): IPersistentPrefs | undefined {

        if (persistentPrefs) {
            return InterceptedPersistentPrefsFactory.create(persistentPrefs, this.onCommit);
        } else {
            return undefined;
        }

    }

}

export class InterceptedPersistentPrefsFactory {

    public static create(persistentPrefs: IPersistentPrefs, onCommit: CommitCallback): InterceptedPersistentPrefs {

        const commit = async () => {

            // notify the listener
            await onCommit(persistentPrefs);

            // do the commit
            await persistentPrefs.commit();

        };

        return {
            ...persistentPrefs,
            update: persistentPrefs.update,
            fetch: persistentPrefs.fetch,
            prefs: persistentPrefs.prefs,
            mark: persistentPrefs.mark,
            isMarkedDelayed: persistentPrefs.isMarkedDelayed,
            toggleMarked: persistentPrefs.toggleMarked,
            isMarked: persistentPrefs.isMarked,
            markDelayed: persistentPrefs.markDelayed,
            get: persistentPrefs.get,
            set: persistentPrefs.set,
            toDict: persistentPrefs.toDict,
            toPrefDict: persistentPrefs.toPrefDict,
            defined: persistentPrefs.defined,
            __intercepted: true,
            commit
        };

    }
}

/**
 * Prefs object just backed by a local dictionary.
 */
export class DictionaryPrefs extends Prefs {

    protected delegate: StringToPrefDict = {};

    constructor(delegate: StringToPrefDict = {}) {
        super();
        this.update(delegate);
    }

    public update(dict: StringToPrefDict = {}): boolean {

        if (! dict) {
            return false;
        }

        const isInvalid = (pref: Pref | string): boolean => {
            // this is a legacy pref and should be ignored
            return typeof pref === 'string';
        };

        const needsUpdate = (curr: Pref | undefined, next: Pref) => {

            if (curr) {

                if (ISODateTimeStrings.compare(curr.written, next.written) >= 0) {
                    return false;
                }

            }

            return true;

        };

        let updated: boolean = false;

        for (const pref of Object.values(dict)) {

            if (isInvalid(pref)) {
                continue;
            }

            const curr = this.fetch(pref.key);

            if (needsUpdate(curr, pref)) {
                this.delegate[pref.key] = pref;
                updated = true;
            }

        }

        return updated;

    }

    public get(key: string): Optional<string> {

        const pref = this.delegate[key];

        if (pref) {
            return Optional.of(pref.value);
        }

        return Optional.empty();
    }

    public set(key: string, value: string): void {

        const written = ISODateTimeStrings.create();

        this.delegate[key] = {
            key,
            value,
            written
        };
    }

    public toDict(): StringToStringDict {

        const result: StringToStringDict = {};

        for (const current of Object.values(this.delegate)) {
            result[current.key] = current.value;
        }

        return result;

    }

    public toPrefDict(): StringToPrefDict {
        return {...this.delegate};
    }


    public fetch(key: string): Pref | undefined {
        return Optional.of(this.delegate[key]).getOrUndefined();
    }

    public prefs(): ReadonlyArray<Pref> {
        return Object.values(this.delegate);
    }

}

export class CompositePrefs implements IPersistentPrefs {

    /**
     * The primary delegate
     */
    private delegate: IPersistentPrefs;

    private delegates: ReadonlyArray<IPersistentPrefs>;

    constructor(delegates: ReadonlyArray<IPersistentPrefs>) {
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

    public toPrefDict(): StringToPrefDict {
        return this.delegate.toPrefDict();
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

    public fetch(key: string): Pref | undefined {
        return this.delegate.fetch(key);
    }

    public prefs(): ReadonlyArray<Pref> {
        return this.delegate.prefs();
    }

    public update(dict: StringToPrefDict): boolean {
        return this.delegate.update(dict);
    }


}

export class NonPersistentPrefs extends DictionaryPrefs implements IPersistentPrefs {

    // tslint:disable-next-line:no-empty
    public async commit(): Promise<void> {

    }

}

export class ListenablePersistentPrefs extends CompositePrefs implements IPersistentPrefs {

    public constructor(private readonly backing: IPersistentPrefs,
                       private readonly onUpdated: (prefs: IPersistentPrefs) => void) {
        super([backing]);
    }

    public async commit(): Promise<void> {
        this.onUpdated(this);
        return super.commit();
    }

}

export interface StringToStringDict {
    [key: string]: string;
}

export interface StringToPrefDict {
    [key: string]: Pref;
}
