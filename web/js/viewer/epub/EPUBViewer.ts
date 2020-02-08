import {Viewer} from "../Viewer";
import {DocDetail} from "../../metadata/DocDetail";
import {Model} from "../../model/Model";

export class EPUBViewer extends Viewer {

    constructor(private readonly model: Model) {
        super();
    }


    public docDetail(): DocDetail | undefined {
        return {
            fingerprint: '12345'
        };
    }

    public start(): void {
        console.log("Starting the epub viewer");
    }

}
