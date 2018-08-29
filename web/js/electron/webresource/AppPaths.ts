
import {app, remote} from 'electron';
import path from 'path';
import fs from 'fs';
import {isPresent} from '../../Preconditions';


/**
 * Given a relative path, return a full path to a local app resource.
 *
 * Each module has a unique __dirname so with this mechanism we can reliably
 * find an path to a file as if we were in the root of the webapp.
 *
 */
export class AppPaths {

    public static relative(relativePath: string) {

        // TODO: sometimes appPath is an ASAR file and that really confuses
        // us and we're going to need a strategy to handle that situation.

        let baseDirs = AppPaths.getBaseDirs();

        for (let i = 0; i < baseDirs.length; i++) {
            const baseDir = baseDirs[i];

            let absolutePath = path.resolve(baseDir, relativePath);

            try {

                // We use readFileSync here because we need to we need to peek into
                // .asar files which do not support exists but DO support reading
                // the file.  If this fails we will get an exception about not
                // finding the file.

                fs.readFileSync(absolutePath);
                return absolutePath;

            } catch( e ) {

            }

        }

        throw new Error("No path found in baseDirs: " + JSON.stringify(baseDirs));

    }

    /**
     * Get the basedir of the current webapp.
     */
    protected static getBaseDirs(): string[] {

        let baseDirs: string[] = [];

        if(! isPresent(app)) {
            baseDirs.push(remote.app.getAppPath());
        } else {
            baseDirs.push(app.getAppPath());
        }

        baseDirs.push(process.cwd());

        return baseDirs;

    }

    /**
     * Build a full resource URL from a given relative URL.
     *
     * @param relativeURI
     */
    static resource(relativeURI: string): string {

        let relativePath = relativeURI;
        let queryData = "";

        if(relativeURI.indexOf("?") !== -1) {
            relativePath = relativeURI.substring(0, relativeURI.indexOf("?"));
            queryData = relativeURI.substring(relativeURI.indexOf("?"));
        }

        let path = AppPaths.relative(relativePath);

        return 'file://' + path + queryData;

    }

}

export class AppPathException extends Error {

}
