import {RegExps} from "../../../polar-shared/src/util/RegExps";

export class PathToRegexps {

    // TODO: migrate to using: path-to-regexp as this is what react-router is
    // using internally.
    //
    // https://github.com/pillarjs/path-to-regexp/tree/v1.7.0
    //
    // WARNING: I tried but the typescript bindings aren't functional

    public static pathToRegexp(pattern: string) {

        pattern = RegExps.escape(pattern);

        return pattern.replace(/(\/)(:[^/]+)/g, (subst, ...args: any[]): string => {
            return args[0] + "([^/]+)";
        });

    }

}
