import {Author} from './Author';
import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {ISODateTimeString} from './ISODateTimeStrings';
import {Ref} from './Refs';

export abstract class VersionedObject extends SerializedObject {

    /**
     * The unique ID for this object.  Every object needs to have a unique ID so
     * that we can reference it easily.  The ID should represent the immutable
     * form of this object. If the object is mutated the id should change.
     */
    public id: string;

    /**
     * When an object is created it has an id just like every other annotation
     * object however, we can update them over time and when it's updated we
     * need to generate a new id.  The guid allows us to reference aan object as
     * it changes over time.  If the user updates the object we keep the same
     * guid so we have a unique handle on the annotation as it's edited and the
     * initial guid never changes but the id is still essentially the pk.
     */

    public guid: string;

    /**
     * The time this object was created
     *
     */
    public created: ISODateTimeString;

    /**
     * The last time this annotation was updated (note changed, moved, etc).
     */
    public lastUpdated: ISODateTimeString;

    /**
     * The author who created this object.
     */
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

