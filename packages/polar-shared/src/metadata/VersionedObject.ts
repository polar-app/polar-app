import {Author} from './Author';
import {SerializedObject} from "./SerializedObject";
import {Preconditions} from '../Preconditions';
import {ISODateTimeString} from './ISODateTimeStrings';
import {Ref} from './Refs';
import {IVersionedObject} from "./IVersionedObject";

export abstract class VersionedObject extends SerializedObject implements IVersionedObject {

    public id: string;

    public guid: string;

    public created: ISODateTimeString;

    public lastUpdated: ISODateTimeString;

    public author?: Author;

    public ref?: Ref;

    protected constructor(template: VersionedObject) {

        super(template);

        this.id = template.id;
        this.guid = template.guid;
        this.created = template.created;
        this.lastUpdated = template.lastUpdated;
        this.author = template.author;

        this.init(template);

    }

    public setup() {

        super.setup();

        if (!this.lastUpdated && this.created) {
            this.lastUpdated = this.created;
        }

    }

    public validate() {

        super.validate();

        this.created = Preconditions.assertPresent(this.created);
        this.lastUpdated = Preconditions.assertPresent(this.lastUpdated);

        Preconditions.assertNotNull(this.id, "id");
        Preconditions.assertNotNull(this.created, "created");

    }

}

