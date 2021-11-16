import {AppRuntime} from "polar-shared/src/util/AppRuntime";

export namespace DevBuild {

    export function isDevBuild() {

        if (AppRuntime.isNode()) {
            return false;
        }

        if (typeof document === 'undefined') {
            return false;
        }

        return ['localhost', '127.0.0.1'].includes(document.location.hostname);

    }

}
