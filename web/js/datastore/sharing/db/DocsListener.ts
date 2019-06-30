import {GroupIDStr} from "../../Datastore";
import {UserGroups} from "./UserGroups";
import {GroupDoc} from "./GroupDocs";
import {DocMeta} from "../../../metadata/DocMeta";
import {SetArrays} from "../../../util/SetArrays";
import {PageMeta} from "../../../metadata/PageMeta";

export class DocsListener {

    // FIXME: how do we behave when cloud sync isn't enable.
    public static listen(fingerprint: string,
                         handler: (groupDoc: GroupDoc) => void,
                         errHandler: (err: Error) => void) {

        // FIXME: only emit on the FIRST time we see the doc and then give the caller a proxied object after that...

        const handleGroup = async (groupID: GroupIDStr) => {

            // FIXME this will load the initial documents but it will NOT
            // load deltas from the server which is the MAIN problem at the moment...

            // FIXME: we might have to refactor this to have it ALL be done in react
            // moving forward which would mean a huge amount of wasted time but worth
            // it for the long term.

            // FIXME: this is going to give us a dumop of ALL the documents in this snapshot not just the changes..
            // await GroupDocs.onSnapshotForByGroupIDAndFingerprint(groupID, fingerprint, groupDoc => handler(groupDoc));

        };

        const handleUserGroups = async () => {

            // the current groups being monitored
            const monitoring = new Set<GroupIDStr>();

            await UserGroups.onSnapshot(userGroup => {

                for (const groupID of userGroup.groups) {

                    if (monitoring.has(groupID)) {
                        continue;
                    }

                    monitoring.add(groupID);

                    handleGroup(groupID)
                        .catch(err => errHandler(err));

                }

            });

        };

        handleUserGroups()
            .catch(err => errHandler(err));

    }

    /**
     * Start with the source and perform a diff against the target.
     *
     * @param source
     * @param target
     */
    public static mergeUpdate(source: DocMeta, target: DocMeta) {

        const mergePageMeta = (source: PageMeta, target: PageMeta) => {

            StringDicts.merge(source.textHighlights, target.textHighlights);
            StringDicts.merge(source.areaHighlights, target.areaHighlights);
            StringDicts.merge(source.notes, target.notes);
            StringDicts.merge(source.comments, target.comments);
            StringDicts.merge(source.questions, target.questions);
            StringDicts.merge(source.flashcards, target.flashcards);

        };

        for (const page of Object.keys(source.pageMetas)) {
            mergePageMeta(source.pageMetas[page], target.pageMetas[page]);
        }

    }


}

interface StringDict<T> {
    [key: string]: T;
}

class StringDicts {

    public static merge<T>(source: StringDict<T>, target: StringDict<T>) {

        // *** delete excess in the target that were deleted in the source

        const deletable = SetArrays.difference(Object.keys(target), Object.keys(source));

        for (const key of deletable) {
            delete target[key];
        }

        // FIXME: I think we have to update this to ALSO look at the GUID... and if when the GUID
        // is updated we also have to update that too.

        // *** copy new keys into the target
        const copyable = SetArrays.difference(Object.keys(source), Object.keys(target));

        for (const key of copyable) {
            target[key] = source[key];
        }

    }

}

