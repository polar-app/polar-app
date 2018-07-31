import {MockChannels} from '../channels/MockChannels';
import {IPCRegistry} from './IPCRegistry';
import {IPCHandler} from './IPCHandler';
import {IPCMessage} from '../../util/IPCMessage';
import {Objects} from '../../util/Objects';
import {IPCEngine} from './IPCEngine';
import {assertJSON} from '../../test/Assertions';
import {TypedChannel} from '../channels/TypedChannel';
import {Channel} from '../channels/Channel';
import {IPCChannel} from './IPCChannel';

describe('IPCTest', function() {

    it("Test proper handling of messages", async function () {

        class Person {

            private readonly name: string;

            constructor(name: string) {
                this.name = name;
            }

            public static create(obj: any): Person {
                return Objects.createInstance(Person.prototype, obj);
            }

        }

        class PersonEvent {

        }

        let greetings: Person[] = [];

        class HelloHandler extends IPCHandler<PersonEvent, Person> {

            protected createValue(ipcMessage: IPCMessage<Person>): Person {
                return Person.create(ipcMessage.value);
            }

            protected getType(): string {
                return 'hello';
            }

            protected handleIPC(event: PersonEvent, person: Person): void {
                console.log("say hello to: ", person);
                greetings.push(person)
            }

        }

        let mockChannels: MockChannels<PersonEvent, any> = MockChannels.create();

        // now convert our types for us...

        let ipcChannel = new IPCChannel<PersonEvent>(mockChannels.left);

        let ipcRegistry = new IPCRegistry<Person>();

        ipcRegistry.register('hello', new HelloHandler());

        let ipcEngine = new IPCEngine(ipcChannel, 'school', ipcRegistry);

        ipcEngine.start();

        mockChannels.right.write('school', new IPCMessage('hello', new Person('Alice')));

        let expected = [
            {
                "name": "Alice"
            }
        ];

        assertJSON(greetings, expected);

    });

});
