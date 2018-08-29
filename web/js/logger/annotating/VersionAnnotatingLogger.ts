/**
 * Simple logger that just writes to the console.
 */
import {ILogger} from '../ILogger';
import {PackageManifest} from '../../util/PackageManifest';

/**
 * Annotates logs by including the version
 */
export class VersionAnnotatingLogger implements ILogger {

    public readonly name: string;
    private readonly delegate: ILogger;

    private readonly versionAnnotation: string;

    constructor(delegate: ILogger) {
        this.delegate = delegate;
        this.name = `version-annotating-logger -> ${delegate.name}`;
        let packageManifest = new PackageManifest();
        //this.versionAnnotation = `[${packageManifest.name()}-${packageManifest.version()}]`;
        this.versionAnnotation = `[${packageManifest.version()}]`;

    }

    info(msg: string, ...args: any[]) {
        this.delegate.info(this.versionAnnotation + ` ${msg}`, ...args);
    }

    warn(msg: string, ...args: any[]) {
        this.delegate.warn(this.versionAnnotation + ` ${msg}`, ...args);
    }

    error(msg: string, ...args: any[]) {
        this.delegate.error(this.versionAnnotation + ` ${msg}`, ...args);
    }

    verbose(msg: string, ...args: any[]) {
        this.delegate.verbose(this.versionAnnotation + ` ${msg}`, ...args);
    }

    debug(msg: string, ...args: any[]) {
        this.delegate.debug(this.versionAnnotation + ` ${msg}`, ...args);
    }

}
