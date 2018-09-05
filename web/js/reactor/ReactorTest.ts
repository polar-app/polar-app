import {Reactor} from './Reactor';
import {assert} from 'chai';
import {assertJSON} from '../test/Assertions';

describe('Reactor', function() {

    it("With multiple args", function () {

        let reactor = new Reactor<MessageEvent>();

        let messageEvent: MessageEvent = {
            message: 'hello world'
        };

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

    it("ordering", function () {

        let reactor = new Reactor<String>();

        let sources: string[] = [];

        assert.notEqual(reactor.registerEvent("messages"), undefined);

        reactor.addEventListener("messages", (messageEvent) => {
            console.log('first');
        });

        reactor.addEventListener("messages", (messageEvent) => {
            console.log('second');
        });

        reactor.dispatchEvent("messages", 'hello');

    });


});

interface MessageEvent {
    readonly message: string;
}
