/**
 * Lightweight document descriptor representing documents easily without having
 * to pass around the full document.
 */
export class DocDescriptor {

    /**
     * The fingerprint representing the document we're working with.
     */
    public readonly fingerprint: string;

    public constructor(obj: any) {
        this.fingerprint = obj.fingerprint;
    }

}
