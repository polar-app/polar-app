import {Karma} from "./Karma";
import {Mocha} from "./Mocha";

export namespace Testing {

    export function isTestingRuntime() {
        return Karma.isKarma() || Mocha.isMocha();
    }

    export function isProductionRuntime() {
        return ! isTestingRuntime();
    }

}
