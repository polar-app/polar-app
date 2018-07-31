import {IPCRegistry} from './IPCRegistry';
import {IPCHandler} from './IPCHandler';
import {IPCMessage} from './IPCMessage';
import {Objects} from '../../util/Objects';
import {IPCEngine} from './IPCEngine';
import {assertJSON} from '../../test/Assertions';
import {MockPipes} from '../channels/MockPipes';
import {IPCPipe} from './IPCPipe';

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

            public getType(): string {
                return 'hello';
            }

            protected handleIPC(event: PersonEvent, person: Person): void {
                console.log("say hello to: ", person);
                greetings.push(person)
            }

        }

        let mockChannels: MockPipes<PersonEvent, any> = MockPipes.create();

        // now convert our types for us...

        let ipcChannel = new IPCPipe<PersonEvent>(mockChannels.left);

        let ipcRegistry = new IPCRegistry<Person>();

        ipcRegistry.register(new HelloHandler());

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
