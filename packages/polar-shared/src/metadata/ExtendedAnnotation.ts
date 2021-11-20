import {Annotation} from './Annotation';
import {Note} from './Note';
import {Question} from './Question';
import {Flashcard} from './Flashcard';

export class ExtendedAnnotation extends Annotation {

    /**
     * The note for this annotation.
     *
     * @deprecated.  We're moving to attachments stored as pointers to keep
     * these object immutable.
     */
    public notes: {[key: string]: Note} = {};

    /**
     * The note for this annotation.
     * @deprecated.  We're moving to attachments stored as pointers to keep
     * these object immutable.
     */
    public questions: {[key: string]: Question} = {};

    /**
     * @deprecated.  We're moving to attachments stored as pointers to keep
     * these object immutable.
     */
    public flashcards: {[key: string]: Flashcard} = {};

    constructor(val: any) {

        super(val);

        this.init(val);

    }

    public setup() {

        super.setup();

        if (!this.notes) {
            this.notes = {};
        }

    }

    public validate() {
        super.validate();
    }

}
