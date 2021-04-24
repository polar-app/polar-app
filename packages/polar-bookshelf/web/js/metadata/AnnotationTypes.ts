import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";
import {IComment} from 'polar-shared/src/metadata/IComment';
import {IFlashcard} from 'polar-shared/src/metadata/IFlashcard';

export class AnnotationTypes {

    public static fromString(val: string) {
        return AnnotationType[val as keyof typeof AnnotationType];
    }

    public static toDataAttribute(annotationType: AnnotationType) {
        return annotationType.toLowerCase().replace("_", "-");
    }

    public static isTextHighlight(annotation: unknown, type: AnnotationType): annotation is ITextHighlight {
        return type === AnnotationType.TEXT_HIGHLIGHT;
    }

    public static isAreaHighlight(annotation: unknown, type: AnnotationType): annotation is IAreaHighlight {
        return type === AnnotationType.AREA_HIGHLIGHT;
    }

    public static isComment(annotation: unknown, type: AnnotationType): annotation is IComment {
        return type === AnnotationType.COMMENT;
    }

    public static isFlashcard(annotation: unknown, type: AnnotationType): annotation is IFlashcard {
        return type === AnnotationType.FLASHCARD;
    }
}
