import {DocTagsIndex, RelatedTagsManager, TagDocsIndex} from './RelatedTagsManager';
import {assertJSON} from '../../test/Assertions';
import {assert} from 'chai';
import {Tags} from "polar-shared/src/tags/Tags";

describe('RelatedTags', function() {

    const getTagDocsIndex = (relatedTags: RelatedTagsManager) => {
        return (<any> relatedTags).tagDocsIndex as TagDocsIndex;
    };

    const getDocTagsIndex = (relatedTags: RelatedTagsManager) => {
        return (<any> relatedTags).docTagsIndex as DocTagsIndex;
    };

    it("basic", async function() {

        const relatedTags = new RelatedTagsManager();

        relatedTags.update('0x01', 'set', [Tags.create('linux')]);
        relatedTags.update('0x01', 'set', [Tags.create('microsoft')]);

        relatedTags.update('0x02', 'set', [Tags.create('linux')]);
        relatedTags.update('0x02', 'set', [Tags.create('google')]);

        relatedTags.update('0x03', 'set', [Tags.create('linux')]);
        relatedTags.update('0x03', 'set', [Tags.create('microsoft')]);

        relatedTags.update('0x04', 'set', [Tags.create('linux')]);
        relatedTags.update('0x04', 'set', [Tags.create('microsoft')]);

        relatedTags.update('0x05', 'set', [Tags.create('linux')]);
        relatedTags.update('0x05', 'set', [Tags.create('google')]);

        const tagDocsIndex = getTagDocsIndex(relatedTags);
        const docTagsIndex = getDocTagsIndex(relatedTags);

        assert.isDefined(tagDocsIndex);

        assertJSON(tagDocsIndex, {
            "linux": {
                "tag": "linux",
                "docs": {
                    "0x01": true,
                    "0x02": true,
                    "0x03": true,
                    "0x04": true,
                    "0x05": true
                }
            },
            "microsoft": {
                "tag": "microsoft",
                "docs": {
                    "0x01": true,
                    "0x03": true,
                    "0x04": true
                }
            },
            "google": {
                "tag": "google",
                "docs": {
                    "0x02": true,
                    "0x05": true
                }
            }
        }, undefined, true);

        assertJSON(docTagsIndex, {
            "0x01": {
                tagRefs: {
                    "linux": { refs: 1 },
                    "microsoft": { refs: 1 },
                }
            },
            "0x02": {
                tagRefs: {
                    "linux": { refs: 1 },
                    "google": { refs: 1 },
                }
            },
            "0x03": {
                tagRefs: {
                    "linux": { refs: 1 },
                    "microsoft": { refs: 1 },
                }
            },
            "0x04": {
                tagRefs: {
                    "linux": { refs: 1 },
                    "microsoft": { refs: 1 },
                }
            },
            "0x05": {
                tagRefs: {
                    "linux": { refs: 1 },
                    "google": { refs: 1 },
                }
            },
        }, undefined, true);

        const tagHits = relatedTags.compute(['linux']);

        assertJSON(tagHits, [
               {
                   "tag": "microsoft",
                   "hits": 3
               },
               {
                   "tag": "google",
                   "hits": 2
               }
           ], undefined, true);

    });

    it('should store & delete data from the indices properly', () => {
        const relatedTags = new RelatedTagsManager();

        relatedTags.update('0x01', 'set', [Tags.create('linux')]);
        relatedTags.update('0x01', 'set', [Tags.create('microsoft')]);
        relatedTags.update('0x01', 'set', [Tags.create('microsoft')]);
        relatedTags.update('0x01', 'set', [Tags.create('microsoft')]);
        relatedTags.update('0x01', 'delete', [Tags.create('microsoft')]);
        relatedTags.update('0x01', 'set', [Tags.create('microsoft')]);
        relatedTags.update('0x01', 'set', [Tags.create('microsoft')]);
        relatedTags.update('0x01', 'set', [Tags.create('macos')]);
        relatedTags.update('0x01', 'delete', [Tags.create('macos')]);

        relatedTags.update('0x02', 'set', [Tags.create('linux (arch)')]);
        relatedTags.update('0x02', 'delete', [Tags.create('linux (arch)')]);

        const tagDocsIndex = getTagDocsIndex(relatedTags);
        const docTagsIndex = getDocTagsIndex(relatedTags);

        assert.isDefined(tagDocsIndex);

        assertJSON(tagDocsIndex, {
            "linux": {
                "tag": "linux",
                "docs": {
                    "0x01": true,
                }
            },
            "microsoft": {
                "tag": "microsoft",
                "docs": {
                    "0x01": true,
                }
            },
        }, undefined, true);

        assertJSON(docTagsIndex, {
            "0x01": {
                "tagRefs": {
                    "microsoft": { refs: 4 },
                    "linux": { refs: 1 },
                }
            }
        });
    });
});
