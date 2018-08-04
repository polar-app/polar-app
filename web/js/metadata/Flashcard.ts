import {FlashcardType} from './FlashcardType';
import {VersionedObject} from './VersionedObject';
import {Text} from './Text';
import {ISODateTime} from './ISODateTime';

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

    protected constructor(template: Flashcard) {

        super(template);

        this.id = template.id;
        this.created = template.created;
        this.lastUpdated = template.lastUpdated;
        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;

        this.init(template);

        // TODO: we don't have a way right now to attach these to specific
        // secondary annotations do we?

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

        let result = Object.create(Flashcard.prototype);

        Object.assign(result, <Flashcard> {
            id, created, lastUpdated, type, fields, archetype
        });

        result.init();

        return Object.freeze(result);

    }

}
