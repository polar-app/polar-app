import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Numbers} from "polar-shared/src/util/Numbers";

export interface ArchiveTimestamp {
    readonly yymmdd: string;
    readonly iso: string;
}

export class ArchiveTimestamps {

    public static create(timestamp: ISODateTimeString, interval: number, count: number) {

        const epoch = new Date(timestamp);

        function toTimestamp(idx: number): ArchiveTimestamp {

            function padd(value: number) {
                const val = '' + value;
                if (val.length === 1) {
                    return `0${val}`;
                }

                return val;

            }

            const ts = epoch.getTime() + (idx * interval);
            const d = new Date(ts);
            const year = d.getUTCFullYear();
            const month = padd(d.getUTCMonth() + 1);
            const day = padd(d.getUTCDate());

            const yymmdd = `${year}${month}${day}`;
            const iso = d.toISOString();

            return {yymmdd, iso};

        }

        return Numbers.range(0, count)
                      .map(idx => toTimestamp(idx));

    }

}
