import { Stale, Search } from "./find";
import { assert } from 'chai';
import {DefaultOpts, IFile} from "./find";
import * as path from 'path';
import * as fs from "fs";

/**
 * Tests to make sure that the extensions of the file name/path are properly found 
 */
describe ('GetExtension', function() {
    it ("Test 1", function() {
        assert.equal(Stale.getExtension("file.txt"), "txt");
    });
    it ("Test 2", function() {
        assert.equal(Stale.getExtension("file.name.with.dots.js"), "js");
    });
    it ("Test 3", function() {
        assert.equal(Stale.getExtension("file"), undefined);
    });
    it ("Test 4", function() {
        assert.equal(Stale.getExtension(" "), undefined);
    });
    it ("Test 5", function() {
        assert.equal(Stale.getExtension("currentfile/file.ts"), "ts");
    });
});

/**
 * Tests to make sure that the function is returning the proper array of files and is not returning an empty array
 */
describe ('FindFilesRecursively', function() {
    it ("Test 1", function() {
        var data = path.resolve();
        const opts = new DefaultOpts();
        assert.notEqual(Search.findFilesRecursively(data, opts), []);
    });
    it ("Test 2", function() {
        var data = path.resolve();
        const opts = new DefaultOpts();
        var searchArrayLength = (Search.findFilesRecursively(data, opts)).length;
        var emptyArrayLength = ([]).length;
        assert.notEqual(searchArrayLength, emptyArrayLength);
    });
});

/**
 * Tests to make sure that the files that fit the requirement are properly being added to the hitmap
 * Checks this by making sure that the length of the map matches or doesn'tt match the given length
 */
describe ('InitializeTypescriptMapFiles', function() {
    it ("Test 1", function() {
        const data : IFile[] = [];
        var currMap = new Map();
        var finalMap = Stale.initializeTypescriptMapFiles(data, currMap);
        var newMapLength = [ ...finalMap.keys() ].length;
        assert.equal(newMapLength, 0);
    });
    it ("Test 2", function() {
        var data = path.resolve();
        const opts = new DefaultOpts();
        var fileArray = Search.findFilesRecursively(data, opts);
        var currMap = new Map();
        var finalMap = Stale.initializeTypescriptMapFiles(fileArray, currMap);
        var mapLength = [ ...finalMap.keys() ].length;
        assert.notEqual(mapLength,0);
    });
});

/**
 * Tests to make sure that the hit values are properly being updated if the same file is found as an import
 */
describe ('UpdateHitMap', function() {
    it ("Test 1", function() {
        var data = path.resolve();
        var currMap = new Map();
        currMap.set('a', 1);
        assert.notEqual(Stale.updateHitMap(data, currMap), undefined);
    });
    it ("Test 2", function() {
        var data = path.resolve();
        var currMap = new Map();
        var final = [ ...Stale.updateHitMap(data, currMap) ].length;
        assert.notEqual(final, 0);
    });
    it ("Test 3", function() {
        var data = path.resolve();
        const opts = new DefaultOpts(); 
        var fileArray = Search.findFilesRecursively(data, opts);
        var currMap = new Map();
        var finalMap = Stale.initializeTypescriptMapFiles(fileArray, currMap);
        var mapLength = [ ...finalMap.keys() ].length;
        var newMapLength = [ ...Stale.updateHitMap(data, finalMap).keys() ].length;
        assert.notEqual(mapLength, newMapLength);
    });
});

/**
 * Tests to see if the path is properly formed and that it points to a proper file
 */
describe ('CheckFullPath', function() {
    it ("Test 1", function() {
        assert.equal(Stale.checkFullPath(path.resolve()), path.resolve());
    });
    it ("Test 2", function() {
        var currPath = "file.ts";
        assert.equal(Stale.checkFullPath(currPath), "file.d.ts");
    });
});

/**
 * Tests to see whether the file is being properly expanded and gives the path that we are looking for
 * Uses the 'Check full path' function afterwards to make sure that the path is correct and is acessible
 */
describe ('ExpandPath', function() {
    it ("Test 1", function() {
        var file = "./file;";
        assert.equal(Stale.expandPath(file), "./file.ts");
    });
    it ("Test 2", function() {
        var file = "./path/to/file.ts;";
        assert.equal(Stale.expandPath(file), "./path/to/file.ts;");
    });
    it ("Test 3", function() {
        var file = ";";
        assert.equal(Stale.expandPath(file), ".ts");
    });
});

/**
 * Tests to see whether maps are properly being sorted when this function is called ... 
 * Both the value and key should move to the proper spot, not just one or the other
 */
describe ('SortMap', function() {
    it ("Test 1", function() {
        var currMap = new Map();
        currMap.set('a', 3);
        currMap.set('b', 6);
        currMap.set('d', 1);
        currMap.set('z', 0);
        var finalMap = Stale.sortMap(currMap);
        let map = new Map([
            [ "a", 0 ],
            [ "b", 1 ],
            [ "d", 3 ],
            [ "z", 6 ]
        ]);
        assert.notEqual(finalMap, map);
    });
    it ("Test 2", function() {
        var currMap = new Map();
        currMap.set('a', 10);
        currMap.set('b', 7);
        currMap.set('c', 1);
        currMap.set('d', 3);
        const finalMap = Stale.sortMap(currMap);
        let map = new Map([
            [ "c", 1 ],
            [ "d", 3 ],
            [ "b", 7 ],
            [ "a", 10 ]
        ]);
        assert.deepEqual(map, finalMap);
    });
});

/**
 * Tests to make sure that the key and value of the map are properly being swapped to match final formatting
 */
describe ('SwapMapValues', function() {
    it ("Test 1", function() {
        var currArray = [['a', 1], ['b', 2], ['c', 3]];
        assert.notEqual(Stale.swapMapValues(currArray), currArray);
    });
    it ("Test 2", function() {
        var currArray = [['a', 0], ['b', 2], ['c', 3]];
        var finalArray = [[0, 'a']];
        assert.deepEqual(Stale.swapMapValues(currArray), finalArray);
    });
});

/**
 * Tests to see that if there is a "@NotStale" string in a file, then that file is not added to the hitmap
 
describe ('IsNotStale', function() {
    it ("Test 1", function() {
        const data = fs.readFileSync("./src/stale-code/search/Search.ts",'utf8');
        assert.equal(Stale.isNotStale(data), true);
    });
    it ("Test 2", function() {
        const data = fs.readFileSync("./src/stale-code/search/find.ts", 'utf8');
        assert.equal(Stale.isNotStale(data), true);
    });
});
*/

/**
 * Tests to see that the parseImports function gets all types of imports in an array format
 */
describe ('ParseImports', function() {
    it ("Test 1", function() {
        const data = 
        `
        import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
        `;
        assert.equal(Stale.parseImports(data)[0], "import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';");
    });
    it ("Test 2", function() {
        const data = 
        `
        import {DocMetas} from "../metadata/DocMetas";
        import {
            BackendFileRefData,
            BinaryFileData,
            Datastore,
            DatastoreCapabilities,
            DatastoreInitOpts,
            DatastoreOverview,
            DeleteResult, DocMetaSnapshot,
            DocMetaSnapshotEventListener, DocMetaSnapshotOpts, DocMetaSnapshotResult,
            ErrorListener,
            GetFileOpts,
            GroupIDStr,
            SnapshotResult,
            WriteFileOpts
        } from './Datastore';
        import {Backend} from 'polar-shared/src/datastore/Backend';
        `
        const result = [
            'import {DocMetas} from "../metadata/DocMetas";',
            'import {\n' +
              '            BackendFileRefData,\n' +
              '            BinaryFileData,\n' +
              '            Datastore,\n' +
              '            DatastoreCapabilities,\n' +
              '            DatastoreInitOpts,\n' +
              '            DatastoreOverview,\n' +
              '            DeleteResult, DocMetaSnapshot,\n' +
              '            DocMetaSnapshotEventListener, DocMetaSnapshotOpts, DocMetaSnapshotResult,\n' +
              '            ErrorListener,\n' +
              '            GetFileOpts,\n' +
              '            GroupIDStr,\n' +
              '            SnapshotResult,\n' +
              '            WriteFileOpts\n' +
              "        } from './Datastore';",
            "import {Backend} from 'polar-shared/src/datastore/Backend';"
        ];
        assert.deepEqual(Stale.parseImports(data), result);    
    });
});