import {Viewer} from "../Viewer";
import {DocDetail} from "../../metadata/DocDetail";
import {Model} from "../../model/Model";
import ePub from 'epubjs';
import {Logger} from "polar-shared/src/logger/Logger";
import Section from "epubjs/types/section";
import {DocFormatFactory} from "../../docformat/DocFormatFactory";

const log = Logger.create();

export class EPUBViewer extends Viewer {

    constructor(private readonly model: Model) {
        super();
    }


    public docDetail(): DocDetail | undefined {

        // TODO: get the document details

        // TODO: I think the epub DOES have a ID I can run with... and it's
        // based on the URL of the 'epub'...

        const docMeta = this.model.docMeta;

        return {
            fingerprint: docMeta.docInfo.fingerprint
        };

    }
    private dispatchPagesInit() {

        const event = new Event('pagesinit', {bubbles: true});

        // Dispatch the event.
        document.querySelector(".page")!.dispatchEvent(event);

    }

    public start(): void {

        console.log("Starting the epub viewer");

        const getURL = () => {

            // const docMeta = this.model.docMeta;
            // const persistenceLayer = this.model.persistenceLayerProvider();
            // const docMetaFileRef = DocMetaFileRefs.createFromDocInfo(docMeta.docInfo);
            // const docFileMeta = persistenceLayer.getFile(Backend.STASH, docMetaFileRef.docFile!);
            //
            // return docFileMeta.url;

            return "file:///Users/burton/Downloads/pg61335-images.epub";

        };

        const book = ePub(getURL());

        const pageElement = document.querySelector(".page")!;

        // console.log("FIXME: InlineView: ", InlineView);

        // const rendition = book.renderTo(pageElement, { flow: "scrolled-doc"});
        // const rendition = book.renderTo(pageElement, { flow: "continuous", width: '100%', height: '100%'});
        const rendition = book.renderTo(pageElement, {
            flow: "scrolled-doc",
            width: '100%',
            height: '100%',
            // view: InlineView
        });

        const handle = async () => {

            // TODO how do I jump to the spine items
            await rendition.display();
            await rendition.next();

            const metadata = await book.loaded.metadata;

            console.log({metadata});

            const navigation = await book.loaded.navigation;

            console.log("toc: ", navigation.toc);

            const pageList = await book.loaded.pageList;

            console.log("pageList: ", pageList);

            const manifest = await book.loaded.manifest;

            console.log("manifest: ", manifest);

            interface ExtendedSpine {
                readonly spineItems: ReadonlyArray<Section>;
            }

            const spine = await book.loaded.spine;

            const extendedSpine = <ExtendedSpine> (<any> spine);

            console.log("spine: ", spine);

            const loaded  = await book.load("toc.ncx");

            console.log("loaded: ", loaded);

            // spineItems.length would be the number of pages.

            // TODO: the sections map to pages in polar.  We can jump to each
            // 'page' by jumping to a section.  
            await rendition.display(1);

            const titles = extendedSpine.spineItems.map(current => current.document.title);

            console.log("titles: ", titles);

            console.log("FIXME: setting fingerprint");

            const docDetail = this.docDetail();
            const docFormat = DocFormatFactory.getInstance();
            docFormat.setCurrentDocFingerprint(docDetail!.fingerprint);

            this.dispatchPagesInit();

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
