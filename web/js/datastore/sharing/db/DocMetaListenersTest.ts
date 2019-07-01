import {assert} from 'chai';
import {DocMetaListener} from "./DocMetaListeners";
import {GroupDoc} from "./GroupDocs";
import {DocMeta} from "../../../metadata/DocMeta";


describe('DocMetaListeners', function() {

    it("basic", function () {

        const fingerprint = '0x001';

        const docMetaHandler = (docMeta: DocMeta, groupDoc: GroupDoc) => {
            // noop
        };

        const errHandler = (err: Error) => {
            // noop
        };


        const listener = new DocMetaListener(fingerprint, docMetaHandler, errHandler);

        listener.onSnapshotForUserGroup({
            groups: ['123'],
            admin: [],
            invitations: [],
            moderator: [],
            uid: '234'
        });

        // listener.onSnapshotForGroupDocs

    });

});
