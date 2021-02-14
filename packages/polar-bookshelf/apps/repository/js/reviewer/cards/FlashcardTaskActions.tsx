import * as React from 'react';
import {FlashcardTaskAction} from "./FlashcardTaskAction";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {
    ClozeParser,
    ClozeRegion,
    Region
} from "polar-spaced-repetition/src/spaced_repetition/scheduler/util/ClozeParser";
import {Texts} from "polar-shared/src/metadata/Texts";
import {Preconditions} from 'polar-shared/src/Preconditions';
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";

export class FlashcardTaskActions {

    public static create(flashcard: IFlashcard,
                         docAnnotation: IDocAnnotation): ReadonlyArray<FlashcardTaskAction> {

        if (flashcard.type === FlashcardType.BASIC_FRONT_BACK) {
            return this.createBasicFrontBackFlashcard(flashcard, docAnnotation);
        } else if (flashcard.type === FlashcardType.CLOZE) {
            return this.createClozeFlashcard(flashcard, docAnnotation);
        } else {
            throw new Error("Type not yet supported: " + flashcard.type);
        }

    }

    private static createBasicFrontBackFlashcard(flashcard: IFlashcard,
                                                 docAnnotation: IDocAnnotation): ReadonlyArray<FlashcardTaskAction> {

        const front = Texts.toString(flashcard.fields.front);
        const back = Texts.toString(flashcard.fields.back);

        const result: FlashcardTaskAction = {
            front: <div dangerouslySetInnerHTML={{__html: front || ""}}/>,
            back: <div dangerouslySetInnerHTML={{__html: back || ""}}/>,
            docAnnotation
        };

        return [result];

    }

    private static createClozeFlashcard(flashcard: IFlashcard,
                                        docAnnotation: IDocAnnotation): ReadonlyArray<FlashcardTaskAction> {

        const cloze = Texts.toString(flashcard.fields.cloze || flashcard.fields.text);

        if (cloze === undefined) {
            const msg = "No cloze text found";
            console.warn(`${msg}: `, flashcard);
            throw new Error(msg);
        }

        Preconditions.assertPresent(cloze, 'cloze');
        const regions = ClozeParser.toRegions(cloze!);

        // the identifiers for all the cloze deletions to expand
        const identifiers =
            regions.filter(current => current.type === 'cloze')
                   .map(current => (current as ClozeRegion).id);

        if (identifiers.length === 0) {
            console.warn(`No cloze texts parsed from '${cloze}': `, regions);
            return [];
        }

        const clozeAsText = ClozeParser.regionsToText(regions);

        const regionToElement = (region: Region, id: number) => {

            if (region.type === 'cloze' && (region as ClozeRegion).id === id) {
                return `<span class="text-danger font-weight-bold">[...]</span>`;
            } else {
                return region.text;
            }

        };

        const toFlashcard = (id: number) => {

            const front = regions.map(region => regionToElement(region, id)).join('');

            return {
                front: <div dangerouslySetInnerHTML={{__html: front}}/>,
                back: <div dangerouslySetInnerHTML={{__html: clozeAsText}}/>,
                docAnnotation
            };

        };

        return identifiers.map(toFlashcard);

    }

}
