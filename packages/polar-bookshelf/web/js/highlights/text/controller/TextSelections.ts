import {TextRect} from "polar-shared/src/metadata/TextRect";
import {ISelectedContent} from "../selection/ISelectedContent";


export class TextSelections {

    public static compute(selectedContent: ISelectedContent): ReadonlyArray<TextRect> {

        const result: readonly TextRect[] = [

        ];

        // TODO: could be cleaner as a map with a toTextRect
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

