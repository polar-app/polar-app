/**
 * Main entrypoint for computing stats on underlying metadata...
 */
import {DocInfo, IDocInfo} from './DocInfo';
import {ISODateString, ISODateTimeStrings} from './ISODateTimeStrings';
import {Dictionaries} from '../util/Dictionaries';

export class Statistics {

    public static computeDocumentsAddedRate(docInfos: Iterable<IDocInfo>): DateStats {

        const result: DateStatMap = {};

        for (const docInfo of docInfos) {

            // merge the 'added' time to a Date map and convert it ot the
            // date...

            if (docInfo.added) {
               const addedDate = ISODateTimeStrings.parse(docInfo.added!);
               const key = ISODateTimeStrings.toISODateString(addedDate);

               const entry = Dictionaries.computeIfAbsent(result, key, () => {
                   return {date: key, value: 0};
               });

               ++entry.value;

            }

        }

        return Object.values(result)
            .sort((a, b) => a.date.localeCompare(b.date));

    }

}

export interface DateStatMap {
    [date: string]: DateStat;
}

export type DateStats = ReadonlyArray<DateStat>;

export interface DateStat {
    readonly date: ISODateString;
    readonly value: number;
}
