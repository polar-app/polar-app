import {GroupIDStr} from "../../Datastore";
import {UserGroups} from "./UserGroups";
import {GroupDoc, GroupDocs} from "./GroupDocs";

export class DocsListener {

    public static listen(fingerprint: string,
                         handler: (groupDoc: GroupDoc) => void,
                         errHandler: (err: Error) => void) {


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

}