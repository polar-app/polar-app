import {FlashcardType} from './FlashcardType';
import {VersionedObject} from './VersionedObject';
import {Text} from './Text';
import {ISODateTime} from './ISODateTime';
import {Preconditions} from '../Preconditions';

export class Flashcard extends VersionedObject {

    /**
     * The type of this flashcard.
     */
    public type: FlashcardType;

    /**
     * The content of this flashcard created by the user.
     */
    public fields: {[key: string]: Text} ;

    /**
     * The archetype ID used to create this flashcard.
     */
    public archetype: string;

    /**
     * When a flashcard is created it has an id just like every other annotation
     * object however, we can update the flashcard over time and when it's
     * updated we need to generate a new id.  This allows us to reference a
     * flashcard as it changes over time.  If the user updates the flashcard we
     * keep the same reference so we have a unique handle on the flashcard as
     * it's edited.
     */
    public reference: string;

    // TODO: we don't have a way right now to attach these to specific
    // annotations

    public constructor(template: Flashcard) {

        super(template);

        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;
        this.reference = template.reference;

        this.init(template);

    }

    validate(): void {
        super.validate();

        Preconditions.assertNotNull(this.type, "type");
        Preconditions.assertNotNull(this.fields, "fields");
        Preconditions.assertNotNull(this.archetype, "archetype");

    }

    public static newInstance(id: string,
                              created: ISODateTime,
                              lastUpdated: ISODateTime,
                              type: FlashcardType,
                              fields: {[key: string]: Text},
                              archetype: string): Readonly<Flashcard> {

        let result = new Flashcard(<Flashcard> {
            id, created, lastUpdated, type, fields, archetype
        });

        return Object.freeze(result);

    }

}
