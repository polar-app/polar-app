import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {Rects} from "../../web/js/Rects";
import {NodeTextRegion} from "polar-dom-text-search/src/NodeTextRegion";
import {Numbers} from "polar-shared/src/util/Numbers";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Arrays} from "polar-shared/src/util/Arrays";

export namespace Highlights {

    export interface IViewportPosition {
        readonly top: number;
        readonly left: number;
        readonly width: number;
        readonly height: number;
    }

    export interface IHighlightNode {
        readonly node: Node;
        readonly nodeID: number;
        readonly start: number;
        readonly end: number;
    }

    /**
     * A highlight with the position for where it should be displayed in the
     * viewport.
     */
    export interface IHighlightViewportPosition extends IHighlightNode, IViewportPosition {

    }

    /**
     * Take all the nodes we need to highlight, split them by character, then
     * segment them into rows that are overflowing.
     */
    export function toHighlightViewportPositions(nodeTextRegions: ReadonlyArray<NodeTextRegion>): ReadonlyArray<IHighlightViewportPosition> {

        function splitNodeTextRegion(nodeTextRegion: NodeTextRegion): ReadonlyArray<NodeTextRegion> {

            function createNodeTextRegion(start: number): NodeTextRegion {

                return {
                    ...nodeTextRegion,
                    start,
                    end: start + 1
                };

            }

            return Numbers.range(nodeTextRegion.start, nodeTextRegion.end - 1)
                          .map(createNodeTextRegion)

        }

        function createSplitNodeTextRegions(): ReadonlyArray<NodeTextRegion> {
            return arrayStream(nodeTextRegions)
                       .map(splitNodeTextRegion)
                       .flatMap(current => current)
                       .collect();
        }

        function createHighlightViewportPositions(nodeTextRegions: ReadonlyArray<NodeTextRegion>) {

            function toHighlightViewportPositions(nodeTextRegion: NodeTextRegion): IHighlightViewportPosition {

                const viewportPosition = Highlights.createViewportPosition(nodeTextRegion);
                return {
                    ...viewportPosition,
                    ...nodeTextRegion
                };

            }

            return nodeTextRegions.map(toHighlightViewportPositions);

        }

        function mergeHighlightViewportPositions(highlightViewportPositions: ReadonlyArray<IHighlightViewportPosition>): ReadonlyArray<IHighlightViewportPosition> {

            function toKey(highlightViewportPosition: IHighlightViewportPosition): string {
                return highlightViewportPosition.nodeID + ':' + highlightViewportPosition.top + ':' + highlightViewportPosition.height
            }

            function merge(groupPositions: ReadonlyArray<IHighlightViewportPosition>): IHighlightViewportPosition {

                const sorted = arrayStream(groupPositions)
                    .sort((a, b) => a.start - b.start)
                    .collect();

                const first = Arrays.first(sorted)!;
                const last = Arrays.last(sorted)!;

                const left = first.left;
                const right = last.left + last.width;
                const width = right - left;

                return {
                    top: first.top,
                    left: first.left,
                    height: first.height,
                    width,
                    node: first.node,
                    nodeID: first.nodeID,
                    start: first.start,
                    end: last.end
                };

            }

            return arrayStream(highlightViewportPositions)
                      .group(toKey)
                      .map(merge)
                      .collect();

        }

        // take each NodeTextRegion and split them out into one character each..
        const splitNodeTextRegions = createSplitNodeTextRegions();

        // compute each position in the viewport
        const highlightViewportPositions = createHighlightViewportPositions(splitNodeTextRegions);
        // then re-join based on top/height of each one.
        return mergeHighlightViewportPositions(highlightViewportPositions);

    }

    export function intersects(parent: ILTRect, child: ILTRect): boolean {
        return Rects.intersect(Rects.createFromBasicRect(parent), Rects.createFromBasicRect(child));
    }

    export function intersectWithWindow(position: IViewportPosition) {

        const parent: ILTRect = {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };

        return intersects(parent, position);

    }

    function rangeToText(range: Range): string {
        const contents = range.cloneContents();
        const div = document.createElement('div');
        div.append(contents);
        return div.innerText;
    }

    export function createViewportPosition(highlight: IHighlightNode): IViewportPosition {

        const range = document.createRange();

        range.setStart(highlight.node, highlight.start);
        range.setEnd(highlight.node, highlight.end);
        const rect = range.getBoundingClientRect();

        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };

    }

    /**
     * Convert a fixed position to an absolute position.
     */
    export function fixedToAbsolute(rect: ILTRect): ILTRect {

        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        return {
            top: rect.top + scrollTop,
            left: rect.left + scrollLeft,
            width: rect.width,
            height: rect.height
        };

    }

}
