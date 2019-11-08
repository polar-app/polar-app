import * as React from 'react';
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {
    ClozeParser,
    ClozeRegion,
    Region
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/util/ClozeParser";
import {Texts} from "../../../../web/js/metadata/Texts";

export class FlashcardTaskActions {

    public static create(flashcard: IFlashcard): ReadonlyArray<FlashcardTaskAction> {

        if (flashcard.type === FlashcardType.BASIC_FRONT_BACK) {
            return this.createBasicFrontBackFlashcard(flashcard);
        } else if (flashcard.type === FlashcardType.CLOZE) {
            return this.createClozeFlashcard(flashcard);
        } else {
            throw new Error("Type not yet supported: " + flashcard.type);
        }

    }

    private static createBasicFrontBackFlashcard(flashcard: IFlashcard): ReadonlyArray<FlashcardTaskAction> {

        const result = {
            front: <div>
                {flashcard.fields.front}
            </div>,
            back: <div>
                {flashcard.fields.back}
            </div>
        };

        return [result];

    }

    private static createClozeFlashcard(flashcard: IFlashcard): ReadonlyArray<FlashcardTaskAction> {

        const text = Texts.toString(flashcard.fields.cloze);
        const regions = ClozeParser.toRegions(text!);

        // the identifiers for all the cloze deletions to expand
        const identifiers =
            regions.filter(current => current.type === 'cloze')
                   .map(current => (current as ClozeRegion).id);


        const toElement = (region: Region, id: number) => {

            if (region.type === 'cloze' && (region as ClozeRegion).id === id) {
                return <span className="text-danger font-weight-bold">...</span>
            } else {
                return region.text;
            }
        };

        const toFlashcard = (id: number) => {

            const front = regions.map(region => toElement(region, id));

            return {
                front: <div>{front}</div>,
                back: <div>text</div>
            }

        };

        return identifiers.map(toFlashcard);

    }

}
