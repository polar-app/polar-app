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

    // TODO: we don't have a way right now to attach these to specific
    // annotations

    protected constructor(template: Flashcard) {

        super(template);

        // FIXME: this doesn't actually help here because init calls assign.
        // It might make sense to just call template.validate() to do
        // all the type checking but it might not have a method since it
        // just JSON here...

        this.id = Preconditions.assertNotNull(template.id);
        this.created = template.created;
        this.lastUpdated = template.lastUpdated;
        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;

        this.init(template);

    }

    validate(): void {
        super.validate();

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
