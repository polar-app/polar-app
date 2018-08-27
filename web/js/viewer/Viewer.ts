import {DocDetail} from '../metadata/DocDetail';

export abstract class Viewer {

    public start() {

    }

    public changeScale(scale: number) {
        throw new Error("Not supported by this viewer.")
    }

    public abstract docDetail(): DocDetail;

}
