import assert from 'assert';
import {JSDOM} from 'jsdom';
import {WindowMessagePipe} from './WindowMessagePipe';
import {assertJSON} from '../../test/Assertions';

declare var global: any;

describe('WindowMessagePipe', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("Basic post message", async function () {

        let dom = new JSDOM("<html></html>");

        global.window = dom.window;

        assert.notEqual(global.window, null);

        let windowMessagePipe = new WindowMessagePipe();

        let messagePromise = windowMessagePipe.when('/hello');

        let message = {
            channel: '/hello',
            message: 'hello world'
        };

        window.postMessage(message, '*');

        let pipeNotification = await messagePromise;
        assertJSON(pipeNotification.channel, '/hello');
        assertJSON(pipeNotification.message, 'hello world');

    });

});
