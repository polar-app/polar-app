This is a client/service system that allows a Renderer to create a slaved
window.

The DialogWindowService runs in the main Electron process.

the DialogWindowClient is created in a renderer and then sends messages to the
DialogWindowService to create windows and send messages to them.

# TODO

- we could sue a DeserializerRegistry mapping the class name to the deserializer.

```
let deserializerRegistry = new DeserializerRegistry();
deserializerRegistry.register("Address", Address.create());

export interface Deserializer {
    <T> (obj: any): T;
}

```

- try to migrate to using annotations like Jax RS

Something like this:

```typescript

@Path("/api/dialog-window-service")
export class DialogWindowService {

    @Endpoint // exposed as /api/dialog-window-service/show
    show(dialogWindowReference: DialogWindowReference): void {

    }

}

- the IPC engine would need a way to get back all the @Path entries as well as
  the annotation on these endpoints.  We could just add metadata to the object
  about the paths, and parameters and return types.

- I should KEEP the names of the arguments and try to build clients based on
  interfaces. If I can take the interface, parse out the annotations, I can then
  build an automatically generated client that would work with Typescript.

- so an client interface would probably look like this...

@Path("/api/dialog-window-service");
interface DialogWindowClient {

    @Endpoint
    show(): boolean;

}

- then we would create the interfaces like this:

- IPCClients.create(DialogWindowClient);

- ... but I don't think we can do this with TS directly?

-

```

- we can implement BOTH systems really quickly bu refactoring the Handler
  to work with a function, not a class.  I don't think we need classes any more.

  If we NEED classes we can pass an instance function, or wrap a function that
  calls an instance method.


