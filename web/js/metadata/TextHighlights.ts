import {TextHighlightRecords} from './TextHighlightRecords';
import {IRect} from '../util/rects/IRect';
import {TextRect} from './TextRect';
import {TextHighlight} from './TextHighlight';
import {IDimensions} from '../util/Dimensions';
import {Image} from './Image';
import {notNull} from '../Preconditions';

export class TextHighlights {

    /**
     * Create a mock text highlight for testing.
     * @return {*}
     */
    static createMockTextHighlight() {

        let rects: IRect[] = [ {top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}];
        let textSelections = [new TextRect({text: "hello world"})];
        let text = "hello world";

        // create a basic TextHighlight object..
        return TextHighlightRecords.create(rects, textSelections, text).value;

    }


    public static attachImage(textHighlight: TextHighlight, image: Image) {
        textHighlight.images[notNull(image.rel)] = image;
    }

}
