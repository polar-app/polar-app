"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRepoDocInfos = void 0;
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const PagemarkType_1 = require("polar-shared/src/metadata/PagemarkType");
const RepoDocInfos_1 = require("./RepoDocInfos");
const DocMetas_1 = require("../../../web/js/metadata/DocMetas");
const now = new Date();
const today = ISODateTimeStrings_1.ISODateTimeStrings.create();
const yesterday = ISODateTimeStrings_1.ISODateTimeStrings.create(TimeDurations_1.TimeDurations.compute('-1d', now));
var MockRepoDocInfos;
(function (MockRepoDocInfos) {
    function createDoc(title, added, lastUpdated, tags, progress) {
        function toTag(tag) {
            return {
                id: tag,
                label: tag
            };
        }
        const tagMap = ArrayStreams_1.arrayStream(tags)
            .map(toTag)
            .toMap(current => current.id);
        const flagged = Math.random() > 0.5;
        const archived = Math.random() > 0.5;
        const nrAnnotations = Math.floor(Math.random() * 150);
        const nrPages = Math.floor(Math.random() * 150);
        const fingerprint = Hashcodes_1.Hashcodes.createRandomID();
        const docMeta = DocMetas_1.DocMetas.create(fingerprint, nrPages);
        docMeta.docInfo = {
            fingerprint,
            title: title + ": " + Math.random(),
            added,
            lastUpdated,
            tags: tagMap,
            flagged,
            archived,
            progress,
            nrPages,
            nrAnnotations,
            properties: {},
            attachments: {},
            pagemarkType: PagemarkType_1.PagemarkType.SINGLE_COLUMN
        };
        return RepoDocInfos_1.RepoDocInfos.convert(docMeta);
    }
    MockRepoDocInfos.createDoc = createDoc;
    function create() {
        return [
            createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
            createDoc('Donut', yesterday, today, [], 4.9),
            createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
            createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
            createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
            createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
            createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
            createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
            createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
            createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
            createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
            createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
            createDoc('Oreo', yesterday, today, ['startups'], 4.0),
            createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
            createDoc('Donut', yesterday, today, [], 4.9),
            createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
            createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
            createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
            createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
            createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
            createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
            createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
            createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
            createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
            createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
            createDoc('Oreo', yesterday, today, ['startups'], 4.0),
            createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
            createDoc('Donut', yesterday, today, [], 4.9),
            createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
            createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
            createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
            createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
            createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
            createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
            createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
            createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
            createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
            createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
            createDoc('Oreo', yesterday, today, ['startups'], 4.0),
            createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
            createDoc('Donut', yesterday, today, [], 4.9),
            createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
            createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
            createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
            createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
            createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
            createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
            createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
            createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
            createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
            createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
            createDoc('Oreo', yesterday, today, ['startups'], 4.0),
            createDoc('Cupcake', yesterday, today, ['linux', 'microsoft'], 4.3),
            createDoc('Donut', yesterday, today, [], 4.9),
            createDoc('Eclair', yesterday, today, ['linux', 'google'], 6.0),
            createDoc('Frozen yoghurt', yesterday, today, ['google', 'intel'], 4.0),
            createDoc('Gingerbread', yesterday, today, ['cloud', 'aws'], 3.9),
            createDoc('Honeycomb', yesterday, today, ['amazon', 'aws'], 6.5),
            createDoc('Ice cream sandwich', yesterday, today, ['microsoft', 'amazon'], 4.3),
            createDoc('Jelly Bean', yesterday, today, ['microsoft', 'aws', 'cloud'], 0.0),
            createDoc('KitKat', yesterday, today, ['intel', 'cloud'], 7.0),
            createDoc('Lollipop', yesterday, today, ['internet', 'microsoft'], 0.0),
            createDoc('Marshmallow', yesterday, today, ['sanfrancisco', 'investors'], 2.0),
            createDoc('Nougat', yesterday, today, ['boulder', 'startups'], 37.0),
            createDoc('Oreo', yesterday, today, ['startups'], 4.0),
        ];
    }
    MockRepoDocInfos.create = create;
})(MockRepoDocInfos = exports.MockRepoDocInfos || (exports.MockRepoDocInfos = {}));
//# sourceMappingURL=MockRepoDocInfos.js.map