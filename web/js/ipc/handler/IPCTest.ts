import {IPCRegistry} from './IPCRegistry';
import {IPCHandler} from './IPCHandler';
import {IPCMessage} from './IPCMessage';
import {Objects} from '../../util/Objects';
import {IPCEngine} from './IPCEngine';
import {assertJSON} from '../../test/Assertions';
import {IPCPipe} from './IPCPipe';
import {IPCEvent} from './IPCEvent';
import {PipeNotification, WritablePipes} from '../pipes/Pipe';
import {MockPipes} from '../pipes/MockPipes';

describe('IPCTest', function() {

    it("Test proper handling of messages", async function () {

        let people: Person[] = [];

        let greetings: Hello[] = [];

        class Hello {

            public readonly person: Person;

            constructor(person: Person) {
                this.person = person;
            }

        }

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

        class HelloHandler extends IPCHandler<Person> {

            protected createValue(ipcMessage: IPCMessage<Person>): Person {
                return Person.create(ipcMessage.value);
            }

            public getType(): string {
                return 'hello';
            }

            protected handleIPC(event: IPCEvent, person: Person): void {
                console.log("say hello to: ", person);
                people.push(person);
                greetings.push(new Hello(person));
            }

        }

        let responses: IPCMessage<any>[] = [];

        class HelloIPCPipe extends IPCPipe<IPCEvent> {

            convertEvent(pipeNotification: PipeNotification<any, any>): IPCEvent {

                let writablePipe = WritablePipes.create((channel: string, event: IPCMessage<any>) => responses.push(event));

                return new IPCEvent(writablePipe, IPCMessage.create(pipeNotification.message));

            }

        }

        let mockChannels: MockPipes<PersonEvent, any> = MockPipes.create();

        // now convert our types for us...

        let ipcChannel = new HelloIPCPipe(mockChannels.left);

        let ipcRegistry = new IPCRegistry();

        ipcRegistry.registerPath('/test/school/hello', new HelloHandler());

        let ipcEngine = new IPCEngine(ipcChannel, ipcRegistry);

        ipcEngine.start();

        mockChannels.right.write('/test/school/hello', new IPCMessage('hello', new Person('Alice')));

        let expectedPeople = [
            {
                "name": "Alice"
            }
        ];

        assertJSON(people, expectedPeople);

        let expectedGreetings = [
                {
                    "person": {
                        "name": "Alice"
                    }
                }
            ]
        ;

        assertJSON(greetings, expectedGreetings);

    });

});
