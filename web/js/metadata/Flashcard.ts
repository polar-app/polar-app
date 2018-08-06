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

    public constructor(template: Flashcard) {

        super(template);

        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;

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
