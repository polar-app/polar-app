import {Reactor} from './Reactor';
import assert from 'assert';
import {Message} from 'js-sha3';
import {assertJSON} from '../test/Assertions';

describe('Reactor', function() {

    it("With multiple args", function () {

        let reactor = new Reactor<MessageEvent>();

        let messageEvent: MessageEvent = {
            message: 'hello world'
        }

        let events: MessageEvent[] = [];

        assert.notEqual(reactor.registerEvent("hello"), undefined);

        reactor.addEventListener("hello", (messageEvent) => {
            events.push(messageEvent);
        });

        reactor.dispatchEvent("hello", messageEvent);

        assertJSON(events, [
            {
                "message": "hello world"
            }
        ])

    });

});

interface MessageEvent {
    readonly message: string;
}
