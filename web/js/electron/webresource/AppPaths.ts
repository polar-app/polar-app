
import {app} from 'electron';
import path from 'path';
import fs from 'fs';

/**
 * Given a relative path, return a full path to a local app resource.
 *
 * Each module has a unique __dirname so with this mechanism we can find an
 * path to a file as if we were int he root.
 *
 */
export class AppPaths {

    static relative(relativePath: string) {

        let baseDir = app.getAppPath();;

        let absolutePath = path.resolve(baseDir, relativePath);
        if(! fs.existsSync(absolutePath)) {
            throw new Error("Absolute path does not exist: " + absolutePath);
        }
        return absolutePath;

    }

    /**
     *
     * @deprecated Use relative() instead.
     */
    static createFromRelative(relativePath: string): string {
        return AppPaths.relative(relativePath);
    }

}
