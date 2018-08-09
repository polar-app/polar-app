
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

    // /opt/Polar\ Bookshelf/resources/app ... FIXME: I think I have to use
    // the logic from loader here...

    static createFromRelative(relative: string): string {

        let baseDir = app.getAppPath();;
        //let baseDir = process.cwd();

        let absolutePath = path.resolve(baseDir, relative);
        if(! fs.existsSync(absolutePath)) {
            throw new Error("Absolute path does not exist: " + absolutePath);
        }
        return absolutePath;
    }

}
