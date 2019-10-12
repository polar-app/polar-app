import {IPCRegistry} from './IPCRegistry';
import {IPCHandler} from './IPCHandler';
import {IPCMessage} from './IPCMessage';
import {IPCEngine} from './IPCEngine';
import {assertJSON} from '../../test/Assertions';
import {IPCPipe} from './IPCPipe';
import {IPCEvent} from './IPCEvent';
import {Pipe, PipeNotification} from '../pipes/Pipe';
import {MockPipes} from '../pipes/MockPipes';
import {IPCClient} from './IPCClient';
import {Objects} from "polar-shared/src/util/Objects";

let mockChannels: MockPipes<PersonEvent, any>;

let leftIpcPipe: HelloIPCPipe;

let rightIpcPipe: HelloIPCPipe;

let ipcRegistry: IPCRegistry;

let helloHandler: HelloHandler;

let ipcEngine: IPCEngine<IPCEvent>;

describe('IPCTest', function() {

    xit("Test proper handling of messages", async function () {

        let icpClient = new IPCClient(rightIpcPipe);

        let response: any = await icpClient.execute('/test/school/hello', new Person('Alice'));

        response._nonce = 10101;

        assertJSON(response, {
            "_type": "result",
            "_value": {
                "person": {
                    "name": "Alice"
                }
            },
            "_nonce": 10101
        });

        let expectedPeople = [
            {
                "name": "Alice"
            }
        ];

        assertJSON(helloHandler.people, expectedPeople);

        let expectedGreetings = [
                {
                    "person": {
                        "name": "Alice"
                    }
                }
            ]
        ;

        assertJSON(helloHandler.greetings, expectedGreetings);

    });

    beforeEach(function () {

        mockChannels = MockPipes.create();

        leftIpcPipe = new HelloIPCPipe(mockChannels.left);

        rightIpcPipe = new HelloIPCPipe(mockChannels.right);

        ipcRegistry = new IPCRegistry();

        helloHandler = new HelloHandler();

        ipcRegistry.registerPath('/test/school/hello', helloHandler);

        ipcEngine = new IPCEngine(leftIpcPipe, ipcRegistry);

        ipcEngine.start();

    });

});

class HelloIPCPipe extends IPCPipe<IPCEvent> {

    public readonly responses: IPCMessage<any>[] = [];

    constructor(pipe: Pipe<any,any>) {
        super(pipe);
    }

    convertEvent(pipeNotification: PipeNotification<any, any>): IPCEvent {
        return new IPCEvent(this.pipe, IPCMessage.create(pipeNotification.message));
    }

}

class HelloHandler extends IPCHandler<Person> {

    public readonly people: Person[] = [];

    public readonly greetings: Hello[] = [];

    protected createValue(ipcMessage: IPCMessage<Person>): Person {
        return Person.create(ipcMessage.value);
    }

    protected async handleIPC(event: IPCEvent, person: Person): Promise<Hello> {
        this.people.push(person);
        this.greetings.push(new Hello(person));

        return new Hello(person);
    }

}

class Greeting {
    public readonly message: string;

    constructor(message: string) {
        this.message = message;
    }

}

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
