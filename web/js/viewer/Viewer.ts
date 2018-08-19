import {DocDetails} from '../metadata/DocDetails';

export class Viewer {

    start() {

    }

    changeScale(scale: number) {
        throw new Error("Not supported by this viewer.")
    }

    docDetails(): DocDetails {
        return {}
    }

}
