import { Strings } from "polar-shared/src/util/Strings";
import {IDateContent, LocaleStr, TimezoneStr} from "./IDateContent";

export namespace DateContents {

    interface ICreateOpts {
        readonly timezone?: TimezoneStr;
        readonly locale?: LocaleStr;
    }

    /**
     * Create a new IDateContent object
     */
    export function create(opts?: ICreateOpts): IDateContent {

        const resolvedOptions = Intl.DateTimeFormat().resolvedOptions();
        const timezone = opts?.timezone || resolvedOptions.timeZone;
        const locale = opts?.locale || resolvedOptions.locale;

        const format = 'MMMM D, YYYY';

        const now = new Date();

        const month = now.toLocaleString(locale, { month: "long" });
        const day = now.toLocaleString(locale, { day: "numeric" });
        const year = now.toLocaleString(locale, { year: "numeric" });

        const ts = `${Strings.upperFirst(month)} ${day}, ${year}`;

        return {
            type: 'date',
            data: ts,
            timezone,
            locale,
            format
        }

    }

}
