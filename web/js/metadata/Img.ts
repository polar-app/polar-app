import {URLStr} from '../util/Strings';

/**
 * Image src with width, height, and URL.
 */
export interface Img {
    readonly width: number;
    readonly height: number;
    readonly src: URLStr;
}
