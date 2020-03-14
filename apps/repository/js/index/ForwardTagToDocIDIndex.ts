import {Tag} from "polar-shared/src/tags/Tags";
import {SparseDict} from "./SparseDict";
import {KeyMemberSet} from "./KeyMemberSet";

const toKey = (key: Tag): string => {
    return key.id;
};

const newValue = (key: Tag): KeyMemberSet<Tag, string> => {
    return new KeyMemberSet(key);
};

export class ForwardTagToDocIDIndex {

    private backing: SparseDict<Tag, KeyMemberSet<Tag, string>>;

    constructor() {
        this.backing = new SparseDict(toKey, newValue);
    }

    public get(key: Tag): KeyMemberSet<Tag, string> {
        return this.backing.get(key);
    }

    public keys(): ReadonlyArray<string> {
        return this.backing.keys();
    }

    public values(): ReadonlyArray<KeyMemberSet<Tag, string>> {
        return this.backing.values();
    }

    public delete(key: string) {
        this.backing.delete(key);
    }

    public purge(predicate: (value: KeyMemberSet<Tag, string>) => boolean) {
        this.backing.purge(predicate);
    }

    public getWithKey(k: string): KeyMemberSet<Tag, string> | undefined {
        return this.backing.getWithKey(k);
    }
}
