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
import {IPCClient} from './IPCClient';

describe('IPCTest', function() {

    it("Test proper handling of messages", async function () {

        // the pipe needs to be the riht.
        let icpClient = new IPCClient(rightIpcPipe);

        await icpClient.execute('/test/school/hello', new IPCMessage('hello', new Person('Alice')));

        //. FIXME: make a REST IPC call..

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

    let mockChannels: MockPipes<PersonEvent, any>;

    let leftIpcPipe: HelloIPCPipe;

    let rightIpcPipe: HelloIPCPipe;

    let ipcRegistry: IPCRegistry;

    let helloHandler: HelloHandler;

    let ipcEngine: IPCEngine<IPCEvent, Hello>;

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

    convertEvent(pipeNotification: PipeNotification<any, any>): IPCEvent {

        let writablePipe = WritablePipes.create((channel: string, event: IPCMessage<any>) => this.responses.push(event));

        return new IPCEvent(writablePipe, IPCMessage.create(pipeNotification.message));

    }

}

class HelloHandler extends IPCHandler<Person> {

    public readonly people: Person[] = [];

    public readonly greetings: Hello[] = [];

    protected createValue(ipcMessage: IPCMessage<Person>): Person {
        return Person.create(ipcMessage.value);
    }

    protected handleIPC(event: IPCEvent, person: Person): void {
        this.people.push(person);
        this.greetings.push(new Hello(person));
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
