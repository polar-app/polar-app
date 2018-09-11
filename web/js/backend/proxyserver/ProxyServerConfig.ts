import {Preconditions} from '../../Preconditions';

export class ProxyServerConfig {

    public readonly port: number;

    constructor(port: number = 8600) {
        this.port = Preconditions.assertNotNull(port, "port");
    }

}
