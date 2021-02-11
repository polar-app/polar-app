import {Clause, Collections} from "../../impl/groups/db/Collections";
import {Lazy} from "../../impl/util/Lazy";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

interface IEvent {
    readonly name: string;
    readonly uid: string;
    readonly created: ISODateTimeString;
}

async function getEventsForTimeRange(start: ISODateTimeString, end: ISODateTimeString): Promise<ReadonlyArray<IEvent>> {

    // protected and private groups can not have names and these must be public.
    const clauses: ReadonlyArray<Clause> = [
        ['created', '>=' , start],
        ['created', '<=' , end],
    ];

    return Collections.list('event', clauses);

}

async function exec() {

    const start = "2020-12-07T00:00:0.000Z";
    const end   = "2021-01-07T00:00:0.000Z";

    const events = await getEventsForTimeRange(start, end);

    const uniques: {[uid: string]: boolean} = {};

    for (const current of events) {
        uniques[current.uid] = true;
    }

    console.log(`total unique events for users: ${start} to ${end}: ` + Object.values(uniques).length)

}

exec()
    .catch(err => console.error(err));
