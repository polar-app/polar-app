import {Annotation} from 'polar-shared/src/metadata/Annotation';
import {Note} from 'polar-shared/src/metadata/Note';
import {Question} from 'polar-shared/src/metadata/Question';
import {Flashcard} from 'polar-shared/src/metadata/Flashcard';

export class ExtendedAnnotation extends Annotation {

    /**
     * The note for this annotation.
     *
     * @Deprecated.  We're moving to attachments stored as pointers to keep
     * these object immutable.
     */
    public notes: {[key: string]: Note} = {};

    /**
     * The note for this annotation.
     * @Deprecated.  We're moving to attachments stored as pointers to keep
     * these object immutable.
     */
    public questions: {[key: string]: Question} = {};

    /**
     * @Deprecated.  We're moving to attachments stored as pointers to keep
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
