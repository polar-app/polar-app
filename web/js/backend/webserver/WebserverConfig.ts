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

    public static create(config: IWebserverConfig): WebserverConfig {
        return Object.assign({}, config);
    }

}

export interface SSLConfig {
    key: string | Buffer;
    cert: string | Buffer;
}

export interface IWebserverConfig {

    readonly dir: string;

    readonly port: number;

    /**
     * When true, use SSL. Otherwise just use HTTP.
     */
    readonly useSSL?: boolean;

    readonly ssl?: SSLConfig;

}
