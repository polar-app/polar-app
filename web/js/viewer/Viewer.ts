import {DocDetail} from '../metadata/DocDetail';
import {notNull} from '../Preconditions';

export abstract class Viewer {

    public start() {

    }

    public changeScale(scale: number) {
        throw new Error("Not supported by this viewer.")
    }

    public abstract docDetail(): DocDetail | undefined;

    protected getFilename(): string {
        const url = new URL(window.location.href);
        return notNull(url.searchParams.get("filename"));
    }

}
