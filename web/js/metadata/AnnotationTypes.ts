import {AnnotationType} from 'polar-shared/src/metadata/AnnotationType';
import {ITextHighlight} from "polar-shared/src/metadata/ITextHighlight";
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";

export class AnnotationTypes {

    public static fromString(val: string) {
        return AnnotationType[val as keyof typeof AnnotationType];
    }

    public static toDataAttribute(annotationType: AnnotationType) {
        return annotationType.toLowerCase().replace("_", "-");
    }

    public static isTextHighlight(annotation: any, type: AnnotationType): annotation is ITextHighlight {
        return type === AnnotationType.TEXT_HIGHLIGHT;
    }

    public static isAreaHighlight(annotation: any, type: AnnotationType): annotation is IAreaHighlight {
        return type === AnnotationType.AREA_HIGHLIGHT;
    }

}
