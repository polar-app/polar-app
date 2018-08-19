import {Model} from '../Model';
import {Preconditions} from '../Preconditions';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class Controller {

    protected model: Model;

    /**
     *
     */
    constructor(model: Model) {
        this.model = Preconditions.assertNotNull(model, "model");
    }

    /**
     * Called when a new document has been loaded.
     */
    async onDocumentLoaded(fingerprint: string, nrPages: number, currentlySelectedPageNum: number) {
        await this.model.documentLoaded(fingerprint, nrPages, currentlySelectedPageNum);
    }

    /**
     * Mark the given page number as read.
     */
    async createPagemark(pageNum: number, options: any) {
        log.info("Controller sees pagemark created: " + pageNum, options);
        await this.model.createPagemark(pageNum, options);
    }

    erasePagemarks(pageNum: number) {
        log.info("Controller sees pagemarks erased: " + pageNum);
        this.model.erasePagemark(pageNum);
    }

    /**
     * Mark the given page number as read.
     */
    erasePagemark(num: number) {
        log.info("Controller sees pagemark erased: " + num);
        this.model.erasePagemark(num);
    }

    getCurrentPageElement() {

    }

}
