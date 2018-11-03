import {Preconditions} from '../../Preconditions';

export class WebserverConfig {

    public readonly dir: string;

    public readonly port: number;

    /**
     * When true, use SSL. Otherwise just use HTTP.
     */
    public readonly useSSL?: boolean;

    public readonly ssl?: SSLConfig;

    constructor(dir: string, port: number) {
        this.dir = Preconditions.assertNotNull(dir, "dir");
        this.port = Preconditions.assertNotNull(port, "port");
    }

}

export interface SSLConfig {
    key: string | Buffer;
    cert: string | Buffer;
}
