import {Hashcodes} from '../Hashcodes';
import {Preconditions} from '../Preconditions';
import {ISODateTime} from './ISODateTime';
import {AreaHighlight} from './AreaHighlight';

class AreaHighlights {

    static createID(created: ISODateTime) {
        return Hashcodes.createID(created);
    }

    /**
     * Create a new pagemark with the created time, and other mandatory fields
     * added.
     *
     * @param opts
     * @return {AreaHighlight}
     */
    static create(opts: IAreaHighlightOpts = {}) {

        Preconditions.assertNotNull(opts.rect, "rect");

        let created = new ISODateTime(new Date());

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
