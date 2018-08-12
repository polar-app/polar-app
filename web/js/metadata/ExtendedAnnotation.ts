import {Annotation} from './Annotation';
import {Flashcard} from './Flashcard';

export class ExtendedAnnotation extends Annotation {

    /**
     * The note for this annotation.
     */
    public notes: {[key: string]: any} = {};

    /**
     * The note for this annotation.
     */
    public questions: {[key: string]: any} = {};

    /**
     * The note for this annotation.
     */
    public flashcards: {[key: string]: Flashcard} = {};

    constructor(val: any) {

        super(val);

        // FIXME: should have comments (plural)

        // FIXME: should have tags (plural)

        this.init(val);

    }

    setup() {

        super.setup();

        if(!this.notes) {
            this.notes = {}
        }

    }

    validate() {
        super.validate();
    }

}
