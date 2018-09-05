import {FilePaths} from "../../util/FilePaths";
import {Files} from "../../util/Files";
import {WebserverConfig} from './WebserverConfig';
import {FileRegistry} from './FileRegistry';
import {Webserver} from './Webserver';
import {Hashcodes} from '../../Hashcodes';
import {assertJSON} from '../../test/Assertions';
import {Http} from '../../util/Http';
import {assert} from 'chai';


describe('Webserver', function() {

    describe('create', function() {

        it("basic", function () {

            let webserverConfig = new WebserverConfig("..", 8085);
            let fileRegistry = new FileRegistry(webserverConfig);

            let webserver = new Webserver(webserverConfig, fileRegistry);
            webserver.start();
            webserver.stop();

        });

        it("registerFile", async function () {

            let webserverConfig = new WebserverConfig("..", 8095);
            let fileRegistry = new FileRegistry(webserverConfig);
            let webserver = new Webserver(webserverConfig, fileRegistry);

            webserver.start();

            let path = FilePaths.tmpfile('file-registry.html');
            await Files.writeFileAsync(path, 'hello world');

            let fileMeta = fileRegistry.register("0x000", path);

            assert.ok(fileMeta.url !== undefined);

            let buffer = await Files.readFileAsync(path);

            let hashcode = Hashcodes.create(buffer.toString('utf-8'));

            let expected = {
                "key": "0x000",
                "filename": path,
                "url": "http://127.0.0.1:8095/files/0x000"
            };

            assertJSON(fileMeta, expected);

            let response = await Http.execute(fileMeta.url);

            assertJSON(hashcode, Hashcodes.create(response.data.toString('utf8')));

            webserver.stop();

        });

    });

});

