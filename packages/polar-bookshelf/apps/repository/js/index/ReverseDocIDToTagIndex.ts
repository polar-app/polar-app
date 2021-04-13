import {SparseDict} from "./SparseDict";
import {KeyMemberSet} from "./KeyMemberSet";
import {IDStr} from "polar-shared/src/util/Strings";

const toKey = (key: IDStr): IDStr => {
    return key;
};

const newValue = (key: IDStr): KeyMemberSet<IDStr, string> => {
    return new KeyMemberSet(key);
};

export class ReverseDocIDToTagIndex extends SparseDict<IDStr, KeyMemberSet<IDStr, string>> {

    constructor() {
        super(toKey, newValue);
    }

}
