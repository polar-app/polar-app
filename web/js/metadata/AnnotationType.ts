export enum AnnotationType {
    FLASHCARD = "flashcard"
}

export class AnnotationTypes {

    static fromString(val: string) {
        return AnnotationType[val as keyof typeof AnnotationType];
    }

}
