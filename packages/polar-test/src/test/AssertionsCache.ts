import {Files} from "polar-shared/src/util/Files";
import {IDStr} from "polar-shared/src/util/Strings";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Assertions, toJSON} from "./Assertions";

export namespace AssertionsCache {

    /**
     * Return true if we should write through the assertion cache and write the
     * output to disk.
     */
    function isWriteThrough() {
        return process.env.POLAR_ASSERTION_CACHE_MODE === 'write-through';
    }

    export async function _computePath(key: IDStr) {

        await Files.createDirAsync('test')
        await Files.createDirAsync(FilePaths.join('test', 'assertion-cache'))

        return FilePaths.join(`test`, `assertion-cache`, `${key}.json`);

    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export async function assertJSON(actual: any, key: IDStr) {

        const path = await _computePath(key);

        if (isWriteThrough()) {
            console.log("AssertionCache is in write-through mode as set by POLAR_ASSERTION_CACHE_MODE");
            await Files.writeFileAsync(path, toJSON(actual));
        }

        async function readExpectedJSON() {
            const buff = await Files.readFileAsync(path)
            return buff.toString('utf-8');
        }

        console.log("AssertionCache is in write-through mode as set by POLAR_ASSERTION_CACHE_MODE");

        const expected = await readExpectedJSON();

        Assertions.assertJSON(actual, expected);

    }

}
