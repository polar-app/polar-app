import {FlashcardType} from './FlashcardType';
import {VersionedObject} from './VersionedObject';

export class Flashcard extends VersionedObject {

    /**
     * The type of this flashcard.
     */
    public type: FlashcardType = FlashcardType.BASIC_FRONT_BACK;

    /**
     * The content of this flashcard created by the user.
     *
     * @type map<String,Text> for each defined field.
     */
    public fields: {[key: string]: Text} = {};

    constructor(val: Partial<Flashcard>) {

        super(val);


        this.init(val);

        // TODO: we don't have a way right now to attach these to specific
        // secondary annotations do we?

    }

}
