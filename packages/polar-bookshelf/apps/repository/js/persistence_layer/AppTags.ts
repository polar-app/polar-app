import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";

export interface AppTags {

    readonly docTags: () => DocTags;

    readonly annotationTags: () => AnnotationTags;

}

export type DocTags = ReadonlyArray<TagDescriptor>;

export type AnnotationTags = ReadonlyArray<TagDescriptor>;
