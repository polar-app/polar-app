
import {app} from 'electron';
import path from 'path';
import fs from 'fs';
import process from 'process';

/**
 * Given a relative path, return a full path to a local app resource.
 *
 * Each module has a unique __dirname so with this mechanism we can find an
 * path to a file as if we were int he root.
 *
 */
export class AppPaths {

    public static relative(relativePath: string) {

        // TODO: sometimes appPath is an ASAR file and that really confuses
        // us and we're going to need a strategy to handle that situation.

        let baseDir = AppPaths.getBaseDir()

        let absolutePath = path.resolve(baseDir, relativePath);

        if(! fs.existsSync(absolutePath)) {
            throw new Error("Absolute path does not exist: " + absolutePath);
        }
        return absolutePath;

    }

    protected static getBaseDir() {
        let baseDir = app.getAppPath();

        if(! baseDir.indexOf(".asar")) {
            return baseDir;
        } else {
            return process.cwd();
        }

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
            relativePath = relativeURI.substring(0, relativeURI.indexOf("?") -1);
            queryData = relativeURI.substring(relativeURI.indexOf("?"));
        }

        let path = AppPaths.relative(relativePath);

        return 'file://' + path + queryData;

    }

}
