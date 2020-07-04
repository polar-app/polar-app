import {TextHighlightRow} from "./TextHighlightRow";
import {IntermediateRow} from "./IntermediateRow";
import {Rects} from "../../../Rects";
import {createSiblingTuples} from "polar-shared/src/util/Functions";
import {Objects} from "polar-shared/src/util/Objects";

/**
 * TODO:
 *
 * I designed this incorrectly and should refactor it into a problem of geometry.
 *
 * What I need to do is form this into a polygon with points decorating the polygon.
 *
 * Then I need to take the outlier points, which contain all the points inside
 * the plane, then break it down into rows by looking down the polygon vertically
 * and bisecting it until it forms a collection of rectangles.
 *
 * The code for this would be a LOT cleaner and I think less error prone.
 *
 * This wasn't immediately evident because I was thinking about the problem
 * as a stream of text, not of geometric points.
 *
 */
export class TextHighlightRows {


    /**
     * Go through ALL the rects and build out rows of elements that are
     * horizontally all on the same plane.
     *
     * @param rectElements
     */
    static computeRows(rectElements: any) {

        let tuples = createSiblingTuples(rectElements);

        let result = [];

        // the current row
        let row: any[] = [];

        tuples.forEach(function (tuple: any) {

            if(!tuple.curr.rect) {
                throw new Error("Not a RectElement");
            }

            row.push(tuple.curr);

            if(tuple.next == null || (tuple.next && tuple.curr.rect.top !== tuple.next.rect.top)) {
                result.push(row);
                row = [];
            }

        });

        if (row.length !== 0)
            result.push(row);

        return result;

    }

    // given a row of rects, compute a rect that covers the entire row maximizing
    // the height and width.
    static computeRectForRow(row: any) {

        if (row.length == null || row.length === 0)
            throw new Error("Invalid row data");

        // duplicate the first entry... we will keep maximizing the bounds.
        let result = Rects.validate(Objects.duplicate(row[0].rect));

        row.forEach(function (rectElement: any) {

            if(rectElement.rect.left < result.left) {
                result.left = rectElement.rect.left;
            }

            if(rectElement.rect.top < result.top) {
                result.top = rectElement.rect.top;
            }

            if(rectElement.rect.bottom > result.bottom) {
                result.bottom = rectElement.rect.bottom;
            }

            if(rectElement.rect.right > result.right) {
                result.right = rectElement.rect.right;
            }

            result.width = result.right - result.left;
            result.height = result.bottom - result.top;

        });

        return Rects.validate(result);

    }

    static computeIntermediateRows(rectElements: any) {

        let rows = TextHighlightRows.computeRows(rectElements)
        let result: any[] = [];

        rows.forEach(function (rectElementsWithinRow) {
            let rect = TextHighlightRows.computeRectForRow(rectElementsWithinRow);
            let intermediateRow = new IntermediateRow(rect, rectElementsWithinRow);
            result.push(intermediateRow);
        });

        return result;

    }

    static computeContiguousRects(rectElements: any[]) {

        let intermediateRows = TextHighlightRows.computeIntermediateRows(rectElements);

        let intermediateRowPager = createSiblingTuples(intermediateRows);

        let result: any[] = [];

        intermediateRowPager.forEach(function (page: any) {

            if(!page.curr.rect || !page.curr.rectElements) {
                throw new Error("Not a IntermediateRow");
            }

            let adjustedRect = {
                left: page.curr.rect.left,
                top: page.curr.rect.top,
                right: page.curr.rect.right,
                bottom: page.curr.rect.bottom,
                width: 0,
                height: 0
            };

            // adjust the bottom of this div but ONLY if the next div is not on
            // the same rows.  I might need to have some code to first build
            // this into ROWS.

            if(page.next && page.next.rect.top !== page.curr.rect.top) {
                adjustedRect.bottom = Math.max(page.next.rect.top, adjustedRect.bottom);
            }

            adjustedRect.width = adjustedRect.right - adjustedRect.left;
            adjustedRect.height = adjustedRect.bottom - adjustedRect.top;

            adjustedRect = Rects.validate(adjustedRect);

            let textHighlightRow = new TextHighlightRow(adjustedRect, page.curr.rectElements);

            result.push(textHighlightRow);

        });

        return result;

    }

}
