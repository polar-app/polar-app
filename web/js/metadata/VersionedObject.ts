import {ISODateTime} from './ISODateTime';
import {Author} from './Author';
import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';

export abstract class VersionedObject extends SerializedObject {

    /**
     * The unique ID for this object.  Every object needs to have a unique ID so
     * that we can reference it easily.  The ID should represent the immutable
     * form of this object. If the object is mutated the id should change.
     */
    public id: string;

    /**
     * The time this object was created
     *
     */
    public created: ISODateTime;

    /**
     * The last time this annotation was updated (note changed, moved, etc).
     */
    public lastUpdated: ISODateTime;

    /**
     * The author who created this object.
     */
    public author?: Author;

    protected constructor(template: VersionedObject) {

        super(template);

        this.id = template.id;
        this.created = template.created;
        this.lastUpdated = template.lastUpdated;
        this.author = template.author;

        this.init(template);

    }

    setup() {

        super.setup();

        if(!this.lastUpdated && this.created) {
            this.lastUpdated = this.created;
        }

    }

    validate() {

        super.validate();

        this.created = new ISODateTime(Preconditions.assertNotNull(this.created));
        this.lastUpdated = new ISODateTime(Preconditions.assertNotNull(this.lastUpdated));

        Preconditions.assertNotNull(this.id, "id");
        Preconditions.assertNotNull(this.created, "created");

    }

}

