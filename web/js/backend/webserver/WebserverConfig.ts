import {Preconditions} from '../../Preconditions';

export class WebserverConfig {

    public readonly dir: string;
    public readonly port: number;

    constructor(dir: string, port: number) {
        this.dir = Preconditions.assertNotNull(dir, "dir");
        this.port = Preconditions.assertNotNull(port, "port");
    }

}
