import {PagemarkRect} from './PagemarkRect';
import {Pagemark} from './Pagemark';
import {Logger} from '../logger/Logger';
import {Hashcodes} from '../Hashcodes';
import {Objects} from '../util/Objects';
import {PagemarkType} from './PagemarkType';
import {PagemarkRects} from './PagemarkRects';
import {Dictionaries} from '../util/Dictionaries';
import {round} from '../util/Percentages';
import {PagemarkMode} from './PagemarkMode';
import {DocMeta} from './DocMeta';
import {DocMetas} from './DocMetas';
import {isPresent, Preconditions} from '../Preconditions';
import {ISODateTimeString, ISODateTimeStrings} from './ISODateTimeStrings';
import {PageNumber} from './PageMeta';

const log = Logger.create();

const DEFAULT_PAGEMARK_RECT = new PagemarkRect({
    left: 0,
    top: 0,
    width: 100,
    height: 100
});

export class Pagemarks {

    public static createID(created: ISODateTimeString) {

        const id = Hashcodes.create(JSON.stringify(created));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0, 10);

    }


    /**
     * Create pagemarks over the given range.
     */
    public static createRange(docMeta: DocMeta, end: PageNumber) {



    }

    /**
     * Create a new pagemark with the created time, and other mandatory fields
     * added.
     *
     */
    public static create(opts: Partial<PagemarkOptions> = {}): Pagemark {

        const options: PagemarkOptions = Objects.defaults( opts, {

            // just set docMeta pageMarkType = PagemarkType.SINGLE_COLUMN by
            // default for now until we add multiple column types and handle
            // them properly.

            // TODO: this needs to be read from the docInfo setting for this
            // document and the default here

            type: PagemarkType.SINGLE_COLUMN,

            column: 0,

        });

        const keyOptions = Pagemarks.createKeyOptions(options);

        if (keyOptions.count === 0) {
            throw new Error("Must specify either rect or percentage.");
        }

        if (keyOptions.count === 1) {

            if (keyOptions.hasPercentage) {
                keyOptions.rect = PagemarkRects.createFromPercentage(keyOptions.percentage);
            }

            if (keyOptions.hasRect) {
                keyOptions.percentage = keyOptions.rect.toPercentage();
            }

        }

        if (round(keyOptions.percentage) !== round(keyOptions.rect.toPercentage())) {
            const msg = "Percentage and rect are not the same";
            log.warn(msg, keyOptions.percentage, keyOptions.rect, keyOptions.rect.toPercentage());
            throw new Error(msg);
        }

        const created = ISODateTimeStrings.create();

        return new Pagemark({

            // per-pagemark fields.
            id: Pagemarks.createID(created),
            created,

            // the rest are from options.
            type: options.type,
            percentage: keyOptions.percentage,
            column: options.column,
            rect: keyOptions.rect

        });

    }

    /**
     *
     * @param options
     * @return {KeyPagemarkOptions}
     */
    private static createKeyOptions(options: PagemarkOptions): KeyPagemarkOptions {

        const keyOptions: KeyPagemarkOptions = {
            count: 0,
            hasPercentage: false,
            hasRect: false,
            rect: options.rect,
            percentage: options.percentage
        };

        keyOptions.hasPercentage = "percentage" in options;
        keyOptions.hasRect = "rect" in options;

        if (keyOptions.hasPercentage) {
            ++keyOptions.count;
        }

        if (keyOptions.hasRect) {
            ++keyOptions.count;
        }

        return keyOptions;

    }

    /**
     *
     */
    public static upgrade(pagemarks: {[id: string]: Pagemark}) {

        const result: {[id: string]: Pagemark} = {};

        Object.assign(result, pagemarks);

        Dictionaries.forDict(result, (key, pagemark) => {

            if (! pagemark.rect) {

                if (pagemark.percentage >= 0 && pagemark.percentage <= 100) {

                    // now rect but we can build one from the percentage.
                    pagemark.rect = PagemarkRects.createFromPercentage(pagemark.percentage);

                }

            }

            if (! pagemark.id) {
                log.debug("Pagemark given ID");
                pagemark.id = Pagemarks.createID(pagemark.created);
            }

            if ( ! pagemark.mode) {
                log.debug("Using default pagemark mode.");
                pagemark.mode = PagemarkMode.READ;
            }

            if ( ! isPresent(pagemark.percentage)) {
                log.debug("No pagemark percentage. Assigning zero.");
                pagemark.percentage = 0;
            }

        });

        return result;

    }

    /**
     *
     * @param docMeta
     * @param pageNum
     *
     * @param pagemark An optional pagemark to update.  If the pagemark isn't
     * specified all the pagemarks on the page are deleted and progress updated.
     */
    public static updatePagemark(docMeta: DocMeta, pageNum: number, pagemark?: Pagemark) {

        Preconditions.assertPresent(pageNum, "pageNum");

        const pageMeta = docMeta.getPageMeta(pageNum);

        if (pagemark) {
            // set the pagemark that we just created into the map.
            pageMeta.pagemarks[pagemark.id] = pagemark;
        } else {
            // delete the pagemarks on the page.
            Objects.clear(pageMeta.pagemarks);
        }

        // TODO: this actually requires TWO disk syncs and we're going to
        // need a way to resolve this in the future. It would be nice to
        // elide these to one somehow by hinting to the persistenceLayer
        // used in the model to start a batch around these objects then
        // commit just the last one.
        docMeta.docInfo.progress = (DocMetas.computeProgress(docMeta) * 100);

    }

}

export interface PagemarkOptions {

    /**
     * The type of pagemark we're working with.
     */
    type: PagemarkType;

    /**
     */
    rect: PagemarkRect;

    /**
     */
    percentage: number;

    column: number;

}

/**
 * The key / important options when creating a Pagemark.
 */
export interface KeyPagemarkOptions {

    /**
     * The total number of key options.
     */
    count: number;

    /**
     * True when we have the percentage.
     *
     */
    hasPercentage: boolean;

    /**
     * True when we have the rect.
     *
     */
    hasRect: boolean;

    /**
     */
    rect: PagemarkRect;

    /**
     */
    percentage: number;

}
