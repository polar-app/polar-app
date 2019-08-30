import {Rewrite} from "./Rewrites";
import {RegExps} from "../../util/RegExps";

export class DefaultRewrites {

    public static create(): ReadonlyArray<Rewrite> {

        // TODO: for now the source is a regular expression.  Make it into
        // the same slug format that ReactRouter uses in the future.

        return [
            {
                "source": "/",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/index.html",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/group/:group/highlights",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/group/:group",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/groups",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/groups/create",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/user/:user",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/login.html",
                "destination": "/apps/repository/login.html"
            },

            {
                "source": "/pdfjsWorker-bundle.js",
                "destination": "/web/dist/pdfjsWorker-bundle.js"
            }
        ];

    }

}

export class RewriteURLs {

    // TODO: migrate to using: path-to-regexp as this is what react-router is
    // using internally.
    //
    // https://github.com/pillarjs/path-to-regexp/tree/v1.7.0

    public static slugToRegex(pattern: string) {

        pattern = RegExps.escape(pattern);

        return pattern.replace(/(\/)(:[^/]+)/g, (subst, ...args: any[]): string => {
            return args[0] + "[^/]+";
        });

    }

}

