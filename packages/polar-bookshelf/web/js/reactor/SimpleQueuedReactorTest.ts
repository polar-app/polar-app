import {assert} from "chai";
import {QueuedReactor} from './QueuedReactor';
import {assertJSON} from '../test/Assertions';
import {SimpleReactor} from './SimpleReactor';

describe('SimpleQueuedReactor', function() {

    it("With queued messages", function() {

        const reactor = new SimpleReactor<string>(new QueuedReactor());

        assert.equal(reactor.getEventListeners().length, 0);

        reactor.dispatchEvent('hello');
        reactor.dispatchEvent('world');

        const messages: string[] = [];

        reactor.addEventListener((message) => {
            messages.push(message);
        });

        const expected: string[] = ["hello", "world"];

        assertJSON(messages, expected);

        // now make sure nothing is stored in the reactor

        assertJSON((<any> reactor).delegate.queue, {});

    });


    it("once", async function() {

        const queuedReactor = new QueuedReactor<string>();
        const reactor = new SimpleReactor<string>(queuedReactor);

        assert.equal((<any> reactor).delegate, queuedReactor);

        assert.equal(reactor.getEventListeners().length, 0);

        reactor.dispatchEvent('hello');
        reactor.dispatchEvent('world');

        const messagePromise = reactor.once();

        const message = await messagePromise;

        assert.equal(message, 'hello');

        assert.equal(reactor.getEventListeners().length, 0);

    });

});
