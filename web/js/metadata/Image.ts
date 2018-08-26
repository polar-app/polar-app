import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';

export class Image extends SerializedObject {

    /**
     * The type of this image.
     */
    public type?: string;

    /**
     * The src of this image.  Either an HTTP/HTTPS URL or a data: URL.
     */
    public src: string;

    /**
     * The width of this image.
     */
    public width?: number;

    /**
     * The height of this image.
     *
     * @type {number}
     */
    public height?: number;

    /**
     * A per image 'relation' similar to the HTML rel attribute with links.
     * This allow us to attach an image to an annotation and give it a relation.
     *
     * For example.  We could have 'screenshot', 'thumbnail', 'highlight', etc.
     *
     * These relations are free form so any relation type can be designed by
     * the developer and still compatible with the schema.  Standard relations
     * are and will be defined and future relations can be added at any point.
     */
    public rel?: string;

    constructor(opts: any) {

        super(opts);

        this.type = opts.type;
        this.src = opts.src;
        this.width = opts.width;
        this.height = opts.height;
        this.rel = opts.rel;

        this.init(opts);

    }


    validate() {

        super.validate();

        //Preconditions.assertNotNull(this.type, "type");
        Preconditions.assertNotNull(this.src, "src");

    }

}
