/// "@NotStale"
import * as fs from "fs";
import * as path from 'path';
import {DefaultOpts, Search, Stale} from "./Search";

export function main() {

    /// uses process.argv to see take in any number of directories in the command line
    /// example: node Search.js /Users/mihirmacpro13/Documents/GitHub/polar-bookshelf/web/js /Users/mihirmacpro13/Documents/GitHub/polar-bookshelf/apps
    var argument = process.argv;
    /// creates an empty map
    var hitMap = new Map();
    for (var x = 2; x < argument.length; x++) {
        const opts = new DefaultOpts();
        var myArgs = argument[x];
        /// returns an array with all the files in the directory
        var fileMap = Search.findFilesRecursively(myArgs, opts);
        /// iterates through each file in the directory and adds to the map
        hitMap = Stale.initializeTypescriptMapFiles(fileMap, hitMap);

        for (var i = 0; i < fileMap.length; i++) {
            /// map of the file type, name, path
            var file = fileMap[i];
            var initialFileName = file.name;
            var initialFilePath = file.path;
            var ext = Stale.getExtension(initialFileName);

            /// checks to see if the file name is test.ts
            /// if it is then continues to the next file
            if (file.name.includes('test.ts')  || file.name.includes('.d.ts')) {
                continue;
            }
            /// checks to make sure that the file type is either .ts or .tsx
            else if (ext != undefined && ['ts','tsx'].includes(ext)) {
                /// gets all the contents of the current file
                const data = fs.readFileSync(initialFilePath,'utf8');
                /// gets an array of all imports in the file
                const importArray = Stale.parseImports(data);
                /// makes sure that the importArray is not undefined or null
                if ([undefined, null].includes(importArray)) {
                    continue;
                }
                /// iterates through each import of the file which is stored in the array
                for (var val = 0; val < importArray.length; val++) {
                    var importLine = importArray[val];
                    /// splits the line based off spaces and gets only the file path
                    var filePath = importLine.split(' ').pop();
                    var fullPath;
                    /// converts that file path into a full file path
                    if (filePath != undefined) {
                        if (filePath.includes('./') || filePath.includes('../')) {
                            filePath = Stale.expandPath(filePath);
                            /// creates the full path with the proper directory name
                            var fullDirectory = path.dirname(initialFilePath);
                            fullPath = path.resolve(fullDirectory, filePath);
                            fullPath = Stale.checkFullPath(fullPath);
                        }
                    }
                    if (fullPath != undefined) {
                        /// updates the value of the file in the hitMap
                        hitMap = Stale.updateHitMap(fullPath, hitMap);
                    }
                };
            }
        }
    }
    /// sorts the map based on values
    hitMap = Stale.sortMap(hitMap);
    /// makes the map into a table type format with a nested array
    var updatedHitMap = [...hitMap];
    /// swaps the key and value
    var finalMap = Stale.swapMapValues(updatedHitMap);
    /// removes files that contain not stale tag from the final result
    var finalArray = Stale.isNotStale(finalMap);
    /// prints the map out in table format (format: hitValue ... [tab] ... Path)
    Stale.printMap(finalArray);
}

/// runs the main function and prints out the table with the number of hits as the key and the path as the value
main();
