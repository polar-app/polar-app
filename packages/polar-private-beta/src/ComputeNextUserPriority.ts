import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {TagStr} from "polar-shared/src/util/Strings";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Reducers} from "polar-shared/src/util/Reducers";

export namespace ComputeNextUserPriority {

    import IPrivateBetaReq = PrivateBetaReqCollection.IPrivateBetaReq;

    interface IPriority {
        readonly priority: number;
    }

    interface IPriorityMap {
        [key: string]: IPriority;
    }

    export interface IPrivateBetaReqWithPriority extends IPrivateBetaReq {
        readonly priority: number;
    }


    export interface IComputeOpts {
        readonly tagPriorities: IPriorityMap;
    }

    export async function compute(opts: IComputeOpts) {

        // ** get the list of all users that haven't yet been invited.

        const firestore = FirestoreAdmin.getInstance();

        const records = await PrivateBetaReqCollection.list(firestore);

        return computeUsingRecords(records, opts);

    }

    export async function computeUsingRecords(records: ReadonlyArray<IPrivateBetaReq>, opts: IComputeOpts) {

        return records
            // make sure we only compute users that have not been invited yet.
            .filter(current => current.invited === undefined)
            // ** get their priority
            .map(current => computePriority(opts.tagPriorities, current))
            // ** sort them by prioritized tags, using a score, then created
            .sort(sortWithPriority)

    }

    /**
     * The general idea here is that we sort users by priority descending, and
     * when the priorities are equivalent we then sort by the 'created'
     * timestamp ascending so that users that registered earlier get invited
     * earlier.
     *
     * There should be NO overlapping priorities by metadata or tag ideally.
     *
     * This should allow us to handle the following scenarios:
     *
     *  - compute by user metadata including whether they're a student, THEN
     *    sort by tag priority.
     *
     *  - compute by tag priority, THEN their metadata, like whether they are a
     *    student.
     *
     *  - change the priorities at runtime based on which signup codes we're
     *    using
     */
    export function computePriority(tagPriorities: IPriorityMap, req: IPrivateBetaReq): IPrivateBetaReqWithPriority {

        function getPriorityForTag(tag: TagStr): IPriority | undefined {
            return tagPriorities[tag] || undefined;
        }

        function computePriority() {

            if (req.tags.length === 0) {
                return 0;
            }

            return arrayStream(req.tags)
                .map(current => getPriorityForTag(current))
                .filterPresent()
                .map(current => current.priority)
                .collect()
                .reduce(Reducers.MAX)
        }

        const priority = computePriority();

        return {...req, priority};

    }

    export function sortWithPriority(a: IPrivateBetaReqWithPriority, b: IPrivateBetaReqWithPriority) {

        const diff = b.priority - a.priority;

        if (diff !== 0) {
            // if the priorities aren't different sort by those.
            return diff;
        }

        // now sort by the created time
        return ISODateTimeStrings.compare(a.created, b.created);

    }

}
