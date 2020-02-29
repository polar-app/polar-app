import {Tag} from "polar-shared/src/tags/Tags";
import {SparseDict} from "./SparseDict";
import {KeyMemberSet} from "./KeyMemberSet";

const toKey = (key: Tag): string => {
    return key.id;
};

const newValue = (key: Tag): KeyMemberSet<Tag, string> => {
    return new KeyMemberSet(key);
};

export class ForwardTagToDocIDIndex extends SparseDict<Tag, KeyMemberSet<Tag, string>> {

    constructor() {
        super(toKey, newValue);
    }

}
