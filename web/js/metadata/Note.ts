import {TextType} from './TextType';
import {VersionedObject} from './VersionedObject';
import {Text} from './Text';
import {Texts} from './Texts';

/**
 * Private note describing this object.  Meant to last a long time.
 */
export class Note extends VersionedObject {

    /**
     * The content of this note.
     */
    public content: Text;

    constructor(val: Note) {

        super(val);

        this.content = val.content;

        this.init(val);

    };

    setup() {

        if(!this.content) {
            this.content = Texts.create("", TextType.HTML);
        }

    }

    validate() {

        if(!this.created) {
            throw new Error("The field `created` is required.");
        }

    }

};
