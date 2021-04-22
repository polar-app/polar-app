import {RepoDocInfo} from "./RepoDocInfo";
import {TimeDurations} from "polar-shared/src/util/TimeDurations";
import {
    ISODateTimeString,
    ISODateTimeStrings
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {PagemarkType} from "polar-shared/src/metadata/PagemarkType";
import {RepoDocInfos} from "./RepoDocInfos";
import {DocMetas} from "../../../web/js/metadata/DocMetas";

const now = new Date();
const today = ISODateTimeStrings.create();
const yesterday = ISODateTimeStrings.create(TimeDurations.compute('-1d', now));

export namespace MockRepoDocInfos {

    export function createDoc(title: string,
                              added: ISODateTimeString,
                              lastUpdated: ISODateTimeString,
                              tags: ReadonlyArray<string>,
                              progress: number): RepoDocInfo {

        function toTag(tag: string) {
            return {
                id: tag,
                label: tag
            };
        }

        const tagMap =
            arrayStream(tags)
            .map(toTag)
            .toMap(current => current.id);

        const flagged = Math.random() > 0.5;
        const archived = Math.random() > 0.5;
        const nrAnnotations = Math.floor(Math.random() * 150);
        const nrPages = Math.floor(Math.random() * 150);

        const fingerprint = Hashcodes.createRandomID();

        const docMeta = DocMetas.create(fingerprint, nrPages);

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
            pagemarkType: PagemarkType.SINGLE_COLUMN
        };

        return RepoDocInfos.convert(docMeta, true, false);

    }

    export function create(): ReadonlyArray<RepoDocInfo> {

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
}
