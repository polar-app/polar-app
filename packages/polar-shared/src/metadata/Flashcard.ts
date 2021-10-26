import {FlashcardType} from './FlashcardType';
import {VersionedObject} from './VersionedObject';
import {Text} from './Text';
import {Preconditions} from '../Preconditions';
import {ISODateTimeString} from './ISODateTimeStrings';
import {Ref} from './Refs';
import {IFlashcard} from "./IFlashcard";

export class Flashcard extends VersionedObject implements IFlashcard {

    public type: FlashcardType;

    public fields: {readonly [key: string]: Text} ;

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

        Preconditions.assertPresent(this.id, "id");
        Preconditions.assertPresent(this.type, "type");
        Preconditions.assertPresent(this.guid, "guid");
        Preconditions.assertPresent(this.fields, "fields");
        Preconditions.assertPresent(this.archetype, "archetype");

        // TODO: assert that the guid is not null.

    }

    public static newInstance(id: string,
                              guid: string,
                              created: ISODateTimeString,
                              lastUpdated: ISODateTimeString,
                              type: FlashcardType,
                              fields: {readonly [key: string]: Text},
                              archetype: string,
                              ref: Ref): Readonly<Flashcard> {

        const result = new Flashcard(<Flashcard> {
            id, guid, created, lastUpdated, type, fields, archetype, ref
        });

        return Object.freeze(result);

    }

}

