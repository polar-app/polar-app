
import path from 'path';

/**
 * Given a relative path, return a full path to a local app resource.
 *
 * Each module has a unique __dirname so with this mechanism we can find an
 * path to a file as if we were int he root.
 *
 */
export class AppPaths {

    static createFromRelative(relative: string): string {
        return path.resolve(process.cwd(), relative);
    }

}
