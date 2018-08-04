import {FlashcardType} from './FlashcardType';
import {VersionedObject} from './VersionedObject';
import {Text} from './Text';

export class Flashcard extends VersionedObject {

    /**
     * The type of this flashcard.
     */
    public type: FlashcardType = FlashcardType.BASIC_FRONT_BACK;

    /**
     * The content of this flashcard created by the user.
     */
    public fields: {[key: string]: Text} = {};

    /**
     * The archetype ID used to create this flashcard.
     */
    public archetype: string = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";

    constructor(val: Partial<Flashcard>) {

        super(val);


        this.init(val);

        // TODO: we don't have a way right now to attach these to specific
        // secondary annotations do we?

    }

}
