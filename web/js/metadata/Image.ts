import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';

export class Image extends SerializedObject {

    /**
     * The type of this image.
     */
    public type: string;

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

    constructor(val: Image) {

        super(val);

        this.type = val.type;
        this.src = val.src;
        this.width = val.width;
        this.height = val.height;

        this.init(val);

    }


    validate() {

        super.validate();

        Preconditions.assertNotNull(this.type, "type");
        Preconditions.assertNotNull(this.src, "src");

    }
}
