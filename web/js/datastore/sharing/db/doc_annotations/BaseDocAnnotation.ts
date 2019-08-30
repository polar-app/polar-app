import {DocIDStr} from "../../rpc/GroupProvisions";
import {DocRef} from "polar-shared/src/groups/DocRef";
import {AnnotationType} from "../../../../metadata/AnnotationType";
import {IComment} from "../../../../metadata/IComment";
import {IFlashcard} from "../../../../metadata/IFlashcard";
import {IAreaHighlight} from "../../../../metadata/IAreaHighlight";
import {ITextHighlight} from "../../../../metadata/ITextHighlight";
import {ProfileIDStr} from "../Profiles";
import {ISODateTimeString} from "../../../../metadata/ISODateTimeStrings";
import {IDStr} from "polar-shared/src/util/Strings";

export interface BaseDocAnnotation {

    /**
     * The main ID of this annotations which can change over time.
     */
    readonly id: IDStr;

    readonly docID: DocIDStr;

    readonly fingerprint: string;

    readonly docRef: DocRef;

    readonly annotationType: AnnotationType;

    readonly original: IComment | IFlashcard | IAreaHighlight | ITextHighlight;

    /**
     * The profile ID of this user which we need to resolve the profile information at runtime.  We should only
     * store the profileID NOT the full metadata denormalized as it changes independent of this record.
     */
    readonly profileID?: ProfileIDStr;

    readonly created: ISODateTimeString;

    readonly lastUpdated: ISODateTimeString;

}
