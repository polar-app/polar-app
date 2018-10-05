import {AnnotationType} from './AnnotationType';

export class Refs {

    public static create(id: string, type: RefType): Ref {
        return `${type}:${id}`;
    }

    public static createFromAnnotationType(id: string, type: AnnotationType) {

        return this.create(id, this.toRefType(type));

    }

    private static toRefType(type: AnnotationType) {

        switch (type) {

            case AnnotationType.TEXT_HIGHLIGHT:
                return 'text-highlight';

            case AnnotationType.AREA_HIGHLIGHT:
                return 'area-highlight';

            case AnnotationType.FLASHCARD:
                return 'flashcard';

        }

        throw new Error("Not handled yet");

    }

}

export type RefType = 'page' | 'comment' | 'pagemark' | 'note' | 'question' | 'flashcard' | 'text-highlight' | 'area-highlight';

/**
 * A reference to another annotation.
 */
export type Ref = string;
