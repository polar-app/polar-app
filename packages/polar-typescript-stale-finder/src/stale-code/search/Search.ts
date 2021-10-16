import * as libpath from "path";
import * as fs from "fs";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {PathStr} from "polar-shared/src/util/Strings";

export class Search {
    public static findFilesRecursively(dir: string, opts: Opts = new DefaultOpts()): ReadonlyArray<IFile> {
        const files = fs.readdirSync(dir);

        const result: IFile[] = [];

        for (const name of files) {

            const path = libpath.join(dir, name);
            const stat = fs.statSync(path);

            const createType = (): FileType | undefined => {
                if (stat.isDirectory()) {
                    return 'directory';
                }

                if (stat.isFile()) {
                    return 'file';
                }
                return undefined;
            };
            const type = createType();
            if (! type) {
                continue;
            }
            const createRecord = (): IFile => {
                return {type, name, path};
            };

            const file = createRecord();

            /**
             * Return true if we should accept the file.
             */
            const acceptFile = () => {
                const acceptExtension = () => {
                    if (! opts.extensions) {
                        return true;
                    }
                    const ext = FilePaths.toExtension(path).getOrUndefined();
                    return ext && opts.extensions.includes(ext);
                };
                const acceptType = () => {
                    if (! opts.types) {
                        return true;
                    }
                    return opts.types.includes(type);
                };
                return acceptExtension() && acceptType();
            };
            if (acceptFile()) {
                result.push(file);
            }
            if (opts.recurse && type === 'directory') {
                result.push(...this.findFilesRecursively(path, opts));
            }
        }
        return result;
    }
}

/// the file type that is compatibale
export type FileType = 'file' | 'directory';
/// A file extension without the '.' prefix.  Example: jpg, jpeg, txt
export type FileExt = string;

export class DefaultOpts implements Opts {
    public readonly recurse = true;
    public readonly types: ReadonlyArray<FileType> = ['file'];
}

export interface Opts {
    readonly recurse?: boolean;
    /// Only accept the given file types.  By default all types are accepted.
    readonly types?: ReadonlyArray<FileType>;
    /// Only accept the given extensions. By default all extension are accepted.
    readonly extensions?: ReadonlyArray<FileExt>;
}

export interface IFile {
    readonly name: string;
    readonly path: PathStr; /// the entire path of the file
    readonly type: FileType; /// what type the file is
}

/**
 * all the functions needed for the main to figure out the stale code
 */
export class Stale {
    /**
     * gets the extension of the filename
     * @param filename
     */
    public static getExtension (filename : string) : string | undefined {
        var extension;
        if (filename.includes('.')) {
            extension = filename.split('.').pop();
        }
        else {
            extension = undefined;
        }
        return extension;
    }

    /**
     * iterates through each file in the directory and adds to the map
     * @param data
     * @param currMap
     */
    public static initializeTypescriptMapFiles (data : ReadonlyArray<IFile>, currMap : Map<string,number>) : Map<string,number> {
        for (var k = 0; k < data.length; k++) {
            if (currMap.has(data[k].path) == false) {
                if (data[k].name.includes('test.ts')  || data[k].name.includes('.d.ts')) {
                    continue;
                }
                /// checks to make sure that the file type is either .ts or .tsx
                else if (data[k].name.split('.').pop() === 'ts' || data[k].name.split('.').pop() === 'tsx') {
                    /// initializes hitMap
                    currMap.set(data[k].path, 0);
                }
            }
        }
        return currMap;
    }

    /**
     * updates the value of the file in the hitMap
     * @param currFullPath
     * @param currMap
     */
    public static updateHitMap (currFullPath : string, currMap : Map<string,number>) : Map<string,number> {
        if (currFullPath !== undefined) {
            /// checks to see if the hitmap already has that path
            if (currMap.has(currFullPath) === true) {
                /// if it does then increments the value of that file by 1
                var currVal = currMap.get(currFullPath);
                if (currVal !== undefined) {
                    currMap.set(currFullPath, currVal + 1);
                }
            }
            /// if the hitmap does not have that path as a key already
            else {
                /// then sets that file path to have a value of 1
                currMap.set(currFullPath, 1);
            }
        }
        return currMap;
    }

    /**
     * checks to make sure that the path exists
     * @param finalPath
     */
    public static checkFullPath (finalPath : string) : string {
        if (fs.existsSync(finalPath) === false) {
            finalPath = finalPath + 'x';
            if (fs.existsSync(finalPath) === false) {
                finalPath = finalPath.replace(finalPath.substring(finalPath.length-3), "");
                finalPath = finalPath + 'd.ts';
                if (finalPath.includes('utils.js.d.ts')) {
                    finalPath = finalPath.replace(finalPath.substring(finalPath.length-7), "");
                    finalPath = finalPath + 'ts';
                }
                if (fs.existsSync(finalPath) === false) {
                    console.warn("File does not exist: " + finalPath);
                }
            }
        }
        return finalPath;
    }

    /**
     * converts that file path into a full file path
     * @param currPath
     */
    public static expandPath (currPath : string) : string {
        /// fixes the punctuation of the file path of the import
        currPath = currPath.replace(/['"]+/g, '');
        if (currPath.includes('.ts') === false) {
            currPath = currPath.replace(currPath.substring(currPath.length-1), "");
            currPath = currPath + '.ts';
        }
        return currPath;
    }

    /**
     * Sorts the map in order based on the hit values
     * @param currMap
     */
    public static sortMap(currMap : Map<string,number>) : Map<string,number> {
        currMap[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
        }
        return currMap;
    }

    /**
     * swaps the key and the value of the map, so the number of hits is formatted to the left of the full file path
     * @param currMap
     */
    public static swapMapValues(currMap : any[][]) : any[][] {
        var finalHitMap = [];
        for (var index = 0; index < currMap.length; index++) {
            var currentArray = currMap[index];
            var key = currentArray[0];
            var value = currentArray[1];
            if (value == 0) {
                finalHitMap[index] = [value, key];
            }

        }
        return finalHitMap;
    }

    /**
     * prints out the final Map
     * @param finalMap
     */
    public static printMap(finalMap : any[][]) {

        for (var j = 0; j < finalMap.length; j++) {
            var curr = finalMap[j];
            // if (curr[1].includes('Test') === false && curr[1].includes('test') === false) {
            //     console.log(curr[0], ' ', curr[1]);
            // }

            // console.log(curr[0], ' ', curr[1]);

        }
    }

    /**
     * Checks to see if the file is Stale based on the "NotStale" tag
     * Removes that file from final if it does include the not stale annotation
     * @param data
     */
    public static isNotStale(finalArray : any[][]) : any[][] {
        var result = [];
        var indexVal = 0
        for (var n = 0; n < finalArray.length; n++) {
            var currArray = finalArray[n];
            var currFile = currArray[1];
            const data = fs.readFileSync(currFile,'utf8');
            if (data.includes('@NotStale')) {
                continue;
            }
            else {
                result[indexVal] = currArray;
                indexVal = indexVal + 1;
            }
        }
        return result;
    }

    /**
     * parses the imports and stores all the imports of the file from the array
     * @param data
     */
    public static parseImports(data : string) : any{
        const re = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w_-]+)["'\s].*;$/gm;
        var result = data.match(re);
        if (result != null) {
            return result;
        }
    }
}
