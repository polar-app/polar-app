import {TextRect} from "../../../metadata/TextRect";
import {ISelectedContent} from "../selection/ISelectedContent";


export class TextSelections {

    public static compute(selectedContent: ISelectedContent): ReadonlyArray<TextRect> {

        const result: any[] = [

        ];

        // TODO: could be cleaner as a map...

        selectedContent.rectTexts.forEach((rectText: any) => {
            const textSelection = new TextRect({
                rect: rectText.boundingPageRect,
                text: rectText.text
            });

            result.push(textSelection);

        });

        return result;

    }

}

