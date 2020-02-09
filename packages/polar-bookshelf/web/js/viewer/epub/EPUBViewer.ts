import {Viewer} from "../Viewer";
import {DocDetail} from "../../metadata/DocDetail";
import {Model} from "../../model/Model";
import ePub from 'epubjs';

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

        const book = ePub("file:///Users/burton/Downloads/pg61335-images.epub");

        const pageElement = document.querySelector(".page")!;

        // const rendition = book.renderTo(pageElement, { flow: "scrolled-doc"});
        // const rendition = book.renderTo(pageElement, { flow: "continuous", width: '100%', height: '100%'});
        const rendition = book.renderTo(pageElement, { flow: "scrolled-doc", width: '100%', height: '100%'});

        const displayed = rendition.display();

    }

}
