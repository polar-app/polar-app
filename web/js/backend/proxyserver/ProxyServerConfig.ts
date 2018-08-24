import {Preconditions} from '../../Preconditions';

export class ProxyServerConfig {

    public readonly port: number;

    constructor(port: number) {
        this.port = Preconditions.assertNotNull(port, "port");
    }

}
