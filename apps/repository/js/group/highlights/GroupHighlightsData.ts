import {GroupIDStr} from "../../../../../web/js/datastore/Datastore";
import {Group} from "../../../../../web/js/datastore/sharing/db/Groups";
import {GroupDocAnnotation} from "../../../../../web/js/datastore/sharing/db/doc_annotations/GroupDocAnnotations";

export interface GroupHighlightsData {
    readonly id: GroupIDStr;
    readonly group: Group;
    readonly groupDocAnnotations: ReadonlyArray<GroupDocAnnotation>;

}
