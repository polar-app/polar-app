import {FlashcardType} from './FlashcardType';
import {VersionedObject} from './VersionedObject';
import {Text} from './Text';
import {Preconditions} from '../Preconditions';
import {ISODateTimeString} from './ISODateTimeStrings';
import {Ref} from './Refs';
import {IVersionedObject} from "./IVersionedObject";

export class Flashcard extends VersionedObject implements IFlashcard {

    public type: FlashcardType;

    public fields: {[key: string]: Text} ;

    public archetype: string;

    // TODO: we don't have a way right now to attach these to specific
    // annotations

    public constructor(template: Flashcard) {

        super(template);

        this.type = template.type;
        this.fields = template.fields;
        this.archetype = template.archetype;
        this.guid = template.guid;

        this.init(template);

    }

    public validate(): void {

        super.validate();

        Preconditions.assertNotNull(this.id, "id");
        Preconditions.assertNotNull(this.type, "type");
        Preconditions.assertNotNull(this.guid, "guid");
        Preconditions.assertNotNull(this.fields, "fields");
        Preconditions.assertNotNull(this.archetype, "archetype");

        // TODO: assert that the guid is not null.

    }

    public static newInstance(id: string,
                              guid: string,
                              created: ISODateTimeString,
                              lastUpdated: ISODateTimeString,
                              type: FlashcardType,
                              fields: {[key: string]: Text},
                              archetype: string,
                              ref: Ref): Readonly<Flashcard> {

        const result = new Flashcard(<Flashcard> {
            id, guid, created, lastUpdated, type, fields, archetype, ref
        });

        return Object.freeze(result);

    }

}

export interface IFlashcard extends IVersionedObject {

    /**
     * The type of this flashcard.
     */
    type: FlashcardType;

    /**
     * The content of this flashcard created by the user.
     */
    fields: {[key: string]: Text} ;

    /**
     * The archetype ID used to create this flashcard.
     */
    archetype: string;

}
