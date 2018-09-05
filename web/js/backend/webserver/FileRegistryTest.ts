import {WebserverConfig} from './WebserverConfig';

import {assert} from 'chai';
import {FileRegistry} from './FileRegistry';
import {assertJSON} from '../../test/Assertions';
import {Files} from '../../util/Files';
import {FilePaths} from '../../util/FilePaths';

const webserverConfig = new WebserverConfig(".", 8080);

describe('FileRegistry', function() {

    describe('create', function() {

        it("basic", async function () {

            let fileRegistry = new FileRegistry(webserverConfig);

            assert.equal(fileRegistry.hasKey("0x0001"), false);

            let path = FilePaths.tmpfile('file-registry.html');
            await Files.writeFileAsync(path, 'hello world');

            let registerData = fileRegistry.register("0x0001", path);

            let expected = {
                "key": "0x0001",
                "filename": path,
                "url": "http://127.0.0.1:8080/files/0x0001"
            };

            assertJSON(registerData, expected);

            assert.equal(fileRegistry.hasKey("0x0001"), true);

        });

        it("registerFile", async function () {


        });

    });

});
