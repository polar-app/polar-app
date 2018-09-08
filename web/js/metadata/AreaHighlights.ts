import {Hashcodes} from '../Hashcodes';
import {Preconditions} from '../Preconditions';
import {AreaHighlight} from './AreaHighlight';
import {ISODateTimeString, ISODateTimeStrings} from './ISODateTimeStrings';

export class AreaHighlights {

    public static createID(created: ISODateTimeString) {
        return Hashcodes.createID(created);
    }

    /**
     * Create a new pagemark with the created time, and other mandatory fields
     * added.
     *
     * @param opts
     * @return {AreaHighlight}
     */
    public static create(opts: IAreaHighlightOpts = {}) {

        Preconditions.assertNotNull(opts.rect, "rect");

        const created = ISODateTimeStrings.create();

        return new AreaHighlight({

            // per-pagemark fields.
            id: AreaHighlights.createID(created),

            created,

            // there is only one rect for an area highlight.
            rects: { "0": opts.rect }

        });

    }

}

interface IAreaHighlightOpts {
    readonly rect?: any;
}
