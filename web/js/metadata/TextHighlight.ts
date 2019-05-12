import {TextRect} from './TextRect';
import {Text} from './Text';
import {Texts} from './Texts';
import {TextType} from './TextType';
import {BaseHighlight} from './BaseHighlight';
import {Preconditions} from '../Preconditions';
import {Rect} from '../Rect';
import {Image} from './Image';
import {Note} from './Note';
import {Question} from './Question';
import {Flashcard} from './Flashcard';
import {Author} from './Author';
import {ISODateTimeString} from './ISODateTimeStrings';
import {HighlightColor} from './HighlightColor';

export class TextHighlight extends BaseHighlight implements ITextHighlight {

    /**
     * A raw array-like object of text from the regions that the user
     * has highlighted in the UI. In PDF and pdf.js there isn't really
     * the concept of flowing text so we try to show the user the text
     * in the specific regions they selected.
     *
     */
    public textSelections: {[id: number]: TextRect} = {};

    /**
     * The text selections converted to a text string which may or may not be
     * human readable.  Some of the PDF text are actually lists of figures with
     * special characters that might be placed absolutely around the screen.
     *
     * When this is just a plain string we assume it's text and not HTML.
     */
    public text: Text | string = Texts.create("", TextType.HTML);

    public revisedText?: Text | string;

    constructor(val: ITextHighlight) {

        super(val);

        // FIXME: all these extractions (text, html, etc) should be 'snippet'
        // because we also have to include the context with them and with the
        // context we also need to include images as well as the format (markdown,
        // html, etc).  It should probably be a map of each snippet type...
        //
        // There should be one with no context, one with context.
        //
        // FIXME: text selections should also / probably be a snippet.  Each
        // snippet should also have a rect associated with it.  The 'text'
        // snippet should have a rect for the boundary of the text.
        //
        // FIXME: we could probably retain the html and text values as legacy
        // for now and add snippets later.

        /**
         * The HTML representation of this content.  This this is cleansed via
         * a whitelist so only <b>, <em>, <a> etc attribute
         *
         * @type {String}
         */

        // https://github.com/punkave/sanitize-html for this with the default
        // options looks pretty decent.
        //
        // do this with the resulting document fragment.
        //
        // this.html = null;

        this.init(val);

    }

    public validate() {
        super.validate();
        Preconditions.assertNotInstanceOf(this.textSelections, "textSelections", Array);
    }

}

export interface ITextHighlight {

    readonly textSelections: {[id: number]: TextRect};

    readonly text: Text | string;

    /**
     * User edited/revised text for the highlight.
     */
    readonly revisedText?: Text | string;

    readonly rects: {[key: number]: Rect};
    readonly image?: Image;
    readonly images: {[key: string]: Image};
    readonly notes: {[key: string]: Note};
    readonly questions: {[key: string]: Question};
    readonly flashcards: {[key: string]: Flashcard};
    readonly id: string;
    readonly guid: string;
    readonly created: ISODateTimeString;
    readonly lastUpdated: ISODateTimeString;
    readonly author?: Author;
    readonly color?: HighlightColor;

}
