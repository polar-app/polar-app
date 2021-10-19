import {Files} from "polar-shared/src/util/Files";
import {IDStr} from "polar-shared/src/util/Strings";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Assertions, toJSON} from "polar-test/src/test/Assertions";
import {assert} from 'chai';

export namespace AssertionsCache {

    /**
     * Return true if we should write through the assertion cache and write the
     * output to disk.
     */
    function isWriteThrough() {
        return process.env.POLAR_ASSERTION_CACHE_MODE === 'write-through';
    }

    export type CacheExt = 'json' | 'txt';

    export async function _computePath(key: IDStr, ext: CacheExt) {

        await Files.createDirAsync('test')
        await Files.createDirAsync(FilePaths.join('test', 'assertion-cache'))

        return FilePaths.join(`test`, `assertion-cache`, `${key}.${ext}`);

    }

    export async function writeToCache(actual: any, key: IDStr, ext: 'json' | 'txt') {
        const path = await _computePath(key, ext);
        await Files.writeFileAsync(path, actual);
    }

    export namespace ConsoleMessages {
        export function writeThroughModeEnabled() {
            console.log("AssertionCache is in write-through mode as set by POLAR_ASSERTION_CACHE_MODE");
        }

        export function writeThroughModeDisabled() {
            console.log("AssertionCache is in assertion mode and will NOT update test.  Set POLAR_ASSERTION_CACHE_MODE=write-through to update.");
        }

    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export async function assertJSON(actual: any, key: IDStr) {

        const path = await _computePath(key, 'json');

        if (isWriteThrough()) {
            ConsoleMessages.writeThroughModeEnabled()
            await writeToCache(toJSON(actual), key, 'json');
        }

        async function readExpected() {
            const buff = await Files.readFileAsync(path)
            return buff.toString('utf-8');
        }

        ConsoleMessages.writeThroughModeDisabled();

        const expected = await readExpected();

        Assertions.assertJSON(actual, expected);

    }

    export async function assertTEXT(actual: string, key: IDStr) {

        const path = await _computePath(key, 'txt');

        if (isWriteThrough()) {
            ConsoleMessages.writeThroughModeEnabled()
            await writeToCache(actual, key, 'txt');
        }

        async function readExpected() {
            const buff = await Files.readFileAsync(path)
            return buff.toString('utf-8');
        }

        ConsoleMessages.writeThroughModeDisabled();

        const expected = await readExpected();

        assert.equal(actual, expected)

    }


}
