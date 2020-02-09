import {Viewer} from "../Viewer";
import {DocDetail} from "../../metadata/DocDetail";
import {Model} from "../../model/Model";
import ePub from 'epubjs';
import { Logger } from "polar-shared/src/logger/Logger";

const log = Logger.create();

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
        // const book = ePub("file:///Users/burton/Downloads/package.opf");

        const pageElement = document.querySelector(".page")!;

        // const rendition = book.renderTo(pageElement, { flow: "scrolled-doc"});
        // const rendition = book.renderTo(pageElement, { flow: "continuous", width: '100%', height: '100%'});
        const rendition = book.renderTo(pageElement, { flow: "scrolled-doc", width: '100%', height: '100%'});

        const handle = async () => {
            await rendition.display();
            await rendition.next();

            const metadata = await book.loaded.metadata;

            console.log({metadata});

            const navigation = await book.loaded.navigation;

            console.log("toc: ", navigation.toc);

            const pageList = await book.loaded.pageList;

            console.log("pageList: ", pageList);

        };

        handle()
            .catch(err => log.error(err));

        //
        // const next = document.getElementById("next")!;
        // next.addEventListener("click", function(e) {
        //     rendition.next();
        //     e.preventDefault();
        // }, false);
        //
        // const prev = document.getElementById("prev")!;
        // prev.addEventListener("click", function(e) {
        //     rendition.prev();
        //     e.preventDefault();
        // }, false);
        //
        // rendition.on("relocated", function(location: any) {
        //     console.log(location);
        // });

        rendition.on("rendered", function(section: any) {
            //
            // const nextSection = section.next();
            // const prevSection = section.prev();
            //
            // if (nextSection) {
            //
            //     const nextNav = book.navigation.get(nextSection.href);
            //
            //     if (nextNav) {
            //         nextLabel = nextNav.label;
            //     } else {
            //         nextLabel = "next";
            //     }
            //
            //     next.textContent = nextLabel + " »";
            // } else {
            //     next.textContent = "";
            // }
            //
            // if (prevSection) {
            //     prevNav = book.navigation.get(prevSection.href);
            //
            //     if(prevNav) {
            //         prevLabel = prevNav.label;
            //     } else {
            //         prevLabel = "previous";
            //     }
            //
            //     prev.textContent = "« " + prevLabel;
            // } else {
            //     prev.textContent = "";
            // }

        });


    }

}
