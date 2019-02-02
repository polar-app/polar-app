import {ReadingProgress} from './ReadingProgress';
import {PageMeta} from './PageMeta';
import {isPresent} from '../Preconditions';
import {HitMap} from '../util/HitMap';
import {ReadingOverview} from './ReadingOverview';
import {ArrayListMultimap} from '../util/Multimap';
import {ISODateTimeStrings} from './ISODateTimeStrings';
import {PagemarkModes} from './PagemarkModes';
import {PagemarkMode} from './PagemarkMode';
import {Reducers} from '../util/Reducers';
import {Numbers} from '../util/Numbers';

export class ReadingOverviews {


    /**
     * Return an ISO date to percentage (0 to 100) mapping per day.
     */
    private static toDailyReadingProgress(records: ReadonlyArray<ReadingProgress>) {

        const mapping = new ArrayListMultimap<string /* ISODateString */, Perc>();

        for (const record of records) {
            const date = ISODateTimeStrings.toISODate(record.created);
            mapping.put(date, record.progressByMode[PagemarkMode.READ] || 0);
        }

        const result: {[date: string]: Perc} = {};

        for (const date of mapping.keys()) {
            result[date] = mapping.get(date).reduce(Reducers.MAX, 0);
        }

        return result;

    }

    private static toLogicalPages(pageMeta: PageMeta) {

        const dimensions = pageMeta.pageInfo.dimensions;

        if (dimensions && isPresent(dimensions.height)) {
            // this in HTML document and we should assume 850px x 1100px
            // is a page.
            return dimensions.height / 1100;
        }

        return 1;

    }

    public static compute(pageMetas: ReadonlyArray<PageMeta>): ReadingOverview {

        const result = new HitMap();

        for (const pageMeta of pageMetas) {

            const dailyReadingProgress
                = this.toDailyReadingProgress(Object.values(pageMeta.readingProgress));

            const logicalPages = this.toLogicalPages(pageMeta);

            for (const date of Object.keys(dailyReadingProgress)) {
                const perc = dailyReadingProgress[date];
                const nrPages = Numbers.toFixedFloat((perc / 100) * logicalPages, 2);
                result.registerHit(date, nrPages);
            }

        }

        return result.toLiteralMap();

    }

}

/**
 * Percentage from 0 to 100
 */
type Perc = number;

