import {SyncEngine} from './SyncEngine';

export class SyncEngineRegistry {

    private readonly engines: {[id: string]: SyncEngine} = {}

    public register(engine: SyncEngine) {
        this.engines[engine.descriptor.id] = engine;
    }

    public get(id: string): SyncEngine {

        if(! this.engines[id]) {
            throw new Error("No sync engine with ID: " + id);
        }

        return this.engines[id];

    }

}
