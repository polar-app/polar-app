export class CaptureResult {

    /**
     * The path to the resulting PHZ file.
     */
    public readonly path: string;

    constructor(opts: any = {}) {

        this.path = opts.path;

        Object.assign(this, opts);

    }

}
