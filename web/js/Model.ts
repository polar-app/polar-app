import {PersistenceLayer} from './datastore/PersistenceLayer';
import {DocMeta} from './metadata/DocMeta';

const {Proxies} = require("./proxies/Proxies");
const {Pagemarks} = require("./metadata/Pagemarks");
const {PagemarkType} = require("./metadata/PagemarkType");
const {DocMetas} = require("./metadata/DocMetas");
const {DocMetaDescriber} = require("./metadata/DocMetaDescriber");
const {Reactor} = require("./reactor/Reactor");
const {Objects} = require("./util/Objects");
const {Preconditions} = require("./Preconditions");

export class Model {

    private readonly persistenceLayer: PersistenceLayer;

    // TODO: we should probably not set this via a global as it might not
    // be loaded yet and / or might be invalidated if the document is closed.
    //
    // TODO: we create a fake document which is eventually replaced.
    docMeta: DocMeta = DocMetas.create('0x0001', 0);

    reactor: any; // TODO: type

    docMetaPromise: any; // TODO: type

    constructor(persistenceLayer: PersistenceLayer) {

        this.persistenceLayer = persistenceLayer;

        this.reactor = new Reactor();
        this.reactor.registerEvent('documentLoaded');
        this.reactor.registerEvent('createPagemark');
        this.reactor.registerEvent('erasePagemark');

        // The currently loaded document.
        this.docMetaPromise = null;

    }

    /**
     * Called when a new document has been loaded.
     */
    async documentLoaded(fingerprint: string, nrPages: number, currentPageNumber: number) {

        // docMetaPromise is used for future readers after the document is loaded
        this.docMetaPromise = this.persistenceLayer.getDocMeta(fingerprint);

        this.docMeta = await this.docMetaPromise;

        if(this.docMeta == null) {

            console.warn("New document found. Creating initial DocMeta");

            // this is a new document...
            //this.docMeta = DocMeta.createWithinInitialPagemarks(fingerprint, nrPages);
            this.docMeta = DocMetas.create(fingerprint, nrPages);
            await this.persistenceLayer.sync(fingerprint, this.docMeta);

            // I'm not sure this is the best way to resolve this as swapping in
            // the docMetaPromise without any synchronization seems like we're
            // asking for a race condition.

        }

        console.log("Description of doc loaded: " + DocMetaDescriber.describe(this.docMeta));
        console.log("Document loaded: ", this.docMeta);

        this.docMeta = Proxies.create(this.docMeta, function (traceEvent: any) {

            // right now we just sync the datastore on mutation.  We do not
            // attempt to use a journal yet.

            console.log("sync of persistence layer via deep trace... ");
            this.persistenceLayer.sync(this.docMeta.docInfo.fingerprint, this.docMeta);

            return true;

        }.bind(this));

        this.docMetaPromise = new Promise(function (resolve: Function, reject: Function) {
            // always provide this promise for the metadata.  For NEW documents
            // we have to provide the promise but we ALSO have to provide it
            // to swap out the docMeta with the right version.
            resolve(this.docMeta);
        }.bind(this));

        // TODO: make this into an object..
        let documentLoadedEvent = {fingerprint, nrPages, currentPageNumber, docMeta: this.docMeta};
        this.reactor.dispatchEvent('documentLoaded', documentLoadedEvent);

        return this.docMeta;

    }

    registerListenerForDocumentLoaded(eventListener: DocumentLoadedCallback) {
        this.reactor.addEventListener('documentLoaded', eventListener);
    }

    /**
     * @refactor This code should be in its own dedicated helper class
     *
     * @param pageNum The page num to use for our created pagemark.
     */
    async createPagemark(pageNum: number, options: any = {}) {

        if(!options.percentage) {
            options.percentage = 100;
        }

        console.log("Model sees createPagemark");

        this.assertPageNum(pageNum);

        let pagemark = Pagemarks.create({

            // just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by
            // default for now until we add multiple column types and handle
            // them properly.

            type: PagemarkType.SINGLE_COLUMN,
            percentage: options.percentage,
            column: 0

        });

        let docMeta = await this.docMetaPromise;

        let pageMeta = docMeta.getPageMeta(pageNum);

        // set the pagemark that we just created into the map.
        pageMeta.pagemarks[pagemark.id] = pagemark;

        // TODO: this can be done with a mutation listener now
        this.reactor.dispatchEvent('createPagemark', {pageNum, pagemark});

    }

    /**
     * @refactor This code should be in its own dedicated helper class
     * @param pageNum
     */
    erasePagemark(pageNum: number) {

        Preconditions.assertNumber(pageNum, "pageNum");

        console.log("Model sees erasePagemark");

        this.assertPageNum(pageNum);

        if(this.docMeta) {

            let pageMeta = this.docMeta.getPageMeta(pageNum);

            // FIXME: this is actually wrong because I need to delete the RIGHT
            // pagemark. NOT just delete all of them.
            Objects.clear(pageMeta.pagemarks);

            // FIXME: this can be done with a mutation listener now.
            this.reactor.dispatchEvent('erasePagemark', {pageNum});

        }

    }

    assertPageNum(pageNum: number) {

        if(pageNum == null)
            throw new Error("Must specify page pageNum");

        if(pageNum <= 0) {
            throw new Error("Page numbers begin at 1");
        }

    }

    /**
     * @deprecated
     * @param eventListener
     */
    registerListenerForCreatePagemark(eventListener: any) {
        this.reactor.addEventListener('createPagemark', eventListener);
    }

    /**
     * @deprecated
     * @param eventListener
     */
    registerListenerForErasePagemark(eventListener: any) {
        this.reactor.addEventListener('erasePagemark', eventListener);
    }

}

export interface DocumentLoadedEvent {
    readonly fingerprint: string;
    readonly nrPages: number;
    readonly currentPageNumber: number;
    readonly docMeta: DocMeta
}


export interface DocumentLoadedCallback {
    (event: DocumentLoadedEvent): void;
}
