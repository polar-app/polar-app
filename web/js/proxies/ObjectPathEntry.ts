/**
 * A simple map of the object and the path to get to that object.
 *
 * We're able walk an entire object decomposing it into a list of
 * ObjectPathEntry objects which make it easier to test and debug rather than
 * dealing with recursive objects.
 *
 * @type {ObjectPathEntry}
 */
export class ObjectPathEntry {

    /**
     * The full path to this object from the root.
     */
    public readonly path: string;

    /**
     * The actual value of this object.
     */
    public readonly value: any;

    /**
     * The parent object which holds a reference to this object, or null if it
     * is the root.
     */
    public readonly parent: any;

    /**
     * The key of this object within the parent.
     */
    public readonly parentKey: string | null;

    constructor(path: string, value: any, parent: any, parentKey: string | null) {

        this.parent = parent;
        this.parentKey = parentKey;
        this.path = path;
        this.value = value;

    }

}
