import {assert} from "chai";
import {QueuedReactor} from './QueuedReactor';
import {assertJSON} from '../test/Assertions';

describe('QueuedReactor', function() {

    it("With queued messages", function() {

        const reactor = new QueuedReactor<string>();

        const eventName = "messages";
        assert.notEqual(reactor.registerEvent(eventName), undefined);

        assert.equal(reactor.getEventListeners(eventName).length, 0);

        reactor.dispatchEvent(eventName, 'hello');
        reactor.dispatchEvent(eventName, 'world');

        const messages: string[] = [];

        reactor.addEventListener(eventName, (message) => {
            messages.push(message);
        });

        const expected: string[] = ["hello", "world"];

        assertJSON(messages, expected);

        // now make sure nothing is stored in the reactor

        assertJSON((<any> reactor).queue, {});

    });


    it("once", async function() {

        const reactor = new QueuedReactor<string>();

        const eventName = "messages";
        assert.notEqual(reactor.registerEvent(eventName), undefined);

        assert.equal(reactor.getEventListeners(eventName).length, 0);

        // nothing is listening now.
        reactor.dispatchEvent(eventName, 'hello');
        reactor.dispatchEvent(eventName, 'world');

        const messagePromise = reactor.once(eventName);

        const message = await messagePromise;

        assert.equal(message, 'hello');

        assert.equal(reactor.getEventListeners(eventName).length, 0);

    });


});
