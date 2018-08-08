export enum AnnotationType {
    FLASHCARD = "FLASHCARD",
    PAGEMARK = "PAGEMARK",
    TEXT_HIGHLIGHT = "TEXT_HIGHLIGHT",
    AREA_HIGHLIGHT = "AREA_HIGHLIGHT"
}

export class
AnnotationTypes {

    static fromString(val: string) {
        return AnnotationType[val as keyof typeof AnnotationType];
    }

}
