
import {LegacyClass} from "./LegacyClass";

export class TSClass {

    private legacy: LegacyClass;

    constructor(legacy: LegacyClass) {
        this.legacy = legacy;
        legacy.myFunction();
    }

}


