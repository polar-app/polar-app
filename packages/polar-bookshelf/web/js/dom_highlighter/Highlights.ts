import {ILTRect} from "polar-shared/src/util/rects/ILTRect";
import {Rects} from "polar-shared/src/util/Rects";
import {NodeTextRegion} from "polar-dom-text-search/src/NodeTextRegion";
import {Numbers} from "polar-shared/src/util/Numbers";
import {arrayStream, ArrayStreamMultiMap} from "polar-shared/src/util/ArrayStreams";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Preconditions} from "polar-shared/src/Preconditions";

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

    export type HighlightViewportPositionsResult = readonly [
        ReadonlyArray<IHighlightViewportPosition>,
        ReadonlyArray<NodeTextRegion>,
        ReadonlyArray<IHighlightViewportPosition>
    ];


    /**
     * Split the given text node so that every character has its own text
     * node so that we can see the actual position on the screen.
     */
    export function splitTextNodePerCharacter(textNode: Text): ReadonlyArray<Text> {

        const result: Text[] = [

        ];

        while (textNode.textContent && textNode.textContent.length > 1) {
            result.push(textNode);
            textNode = textNode.splitText(1);
        }

        result.push(textNode);

        return result;

    }

    /**
     * Take all the nodes we need to highlight, split them by character, then
     * segment them into rows that are overflowing.
     */
    export function toHighlightViewportPositions(nodeTextRegions: ReadonlyArray<NodeTextRegion>): HighlightViewportPositionsResult {

        /**
         * This is a bit of a hack as for some reason NodeTextRegion started off
         * as inclusive and changed to exclusive so it introduced a nasty bug.
         */
        interface NodeTextRegionExclusive extends NodeTextRegion {
            readonly type: 'exclusive';
        }

        function splitNodeTextRegion(nodeTextRegion: NodeTextRegion): ReadonlyArray<NodeTextRegionExclusive> {

            function createNodeTextRegion(start: number): NodeTextRegionExclusive {

                return {
                    ...nodeTextRegion,
                    start,
                    end: start + 1,
                    type: 'exclusive'
                };

            }

            // WARN: we MUST be careful here as nodeTextRegion is [start,end] (inclusive) but we need to
            // return a range that's exclusive. [start, end)
            return Numbers.range(nodeTextRegion.start, nodeTextRegion.end)
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

        // take each NodeTextRegion and split them out into one character each...
        const splitNodeTextRegions = createSplitNodeTextRegions();

        // compute each position in the viewport...
        const rawHighlightViewportPositions = createHighlightViewportPositions(splitNodeTextRegions);

        // then re-join based on top/height of each one.
        const [mergedHighlightViewportPositions] =  mergeHighlightViewportPositions(rawHighlightViewportPositions);

        return [mergedHighlightViewportPositions, splitNodeTextRegions, rawHighlightViewportPositions];

    }

    export type HighlightViewportPositionFiltered = ReadonlyArray<IHighlightViewportPosition>;
    export type HighlightViewportPositionMerged = ReadonlyArray<IHighlightViewportPosition>;
    export type HighlightViewportPositionGrouped = readonly (readonly IHighlightViewportPosition[])[];

    export type MergeHighlightViewportPositionsResult = readonly [
        HighlightViewportPositionFiltered,
        HighlightViewportPositionMerged,
        ArrayStreamMultiMap<IHighlightViewportPosition>
    ];

    export function mergeHighlightViewportPositions(highlightViewportPositions: ReadonlyArray<IHighlightViewportPosition>): MergeHighlightViewportPositionsResult {

        function toMultiMapKey(highlightViewportPosition: IHighlightViewportPosition): string {
            return `nodeID=${highlightViewportPosition.nodeID}&top=${highlightViewportPosition.top}&height=${highlightViewportPosition.height}&nodeType=${highlightViewportPosition.node.nodeType}`;

        }

        function merge(key: string, groupPositions: ReadonlyArray<IHighlightViewportPosition>): IHighlightViewportPosition {

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

        function isCollapsed(item: IHighlightViewportPosition) {
            const collapsed = item.width === 0 || item.height === 0 ;
            return collapsed;
        }

        const grouped
            = arrayStream(highlightViewportPositions)
                .toMultiMap(toMultiMapKey)


        function dumpGroups() {

            for (const group of Object.keys(grouped)) {

                const groupValues = grouped[group];
                //
                // console.log(`group: ${group}: `)

                for(const highlightViewportPosition of groupValues) {
                    // const ch = highlightViewportPosition.node.nodeValue![highlightViewportPosition.start];
                    //
                    // console.log("    " + JSON.stringify({
                    //     ch,
                    //     start: highlightViewportPosition.start,
                    //     end: highlightViewportPosition.end,
                    // }))
                }

            }

        }

        dumpGroups();

        const merged
            = arrayStream(Object.entries(grouped))
                .map(entry => merge(entry[0], entry[1]))
                .collect();

        const filtered = arrayStream(merged)
            .filter(current => ! isCollapsed(current))
            .collect();

        return [filtered, merged, grouped];

    }

    export function intersects(parent: ILTRect, child: ILTRect): boolean {

        return Rects.intersect(Rects.createFromBasicRect(parent), Rects.createFromBasicRect(child));

    }

    export function intersectsWithWindow(position: IHighlightViewportPosition): boolean {

        const doc = position.node.ownerDocument;

        if (! doc) {
            return false;
        }

        const win = doc.defaultView;

        if (! win) {
            return false;
        }

        const parent: ILTRect = {
            top: 0,
            left: 0,
            width: win.innerWidth,
            height: win.innerHeight
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

        const {node} = highlight;
        const doc = node.ownerDocument;

        if (! doc) {
            throw new Error("Node has no owner document");
        }

        const range = doc.createRange();

        function computeEnd() {

            if (! node.nodeValue ) {
                return 0;
            }

            return Math.min(node.nodeValue?.length, highlight.end);

        }

        try {

            range.setStart(node, highlight.start);
            range.setEnd(node, computeEnd());

        } catch (e) {
            console.warn(`Unable to mount annotation on node: ${(e as any).message}`, node);
            throw e;
        }

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
    export function fixedToAbsolute(position: IHighlightViewportPosition): ILTRect {

        Preconditions.assertPresent(position, 'position');

        const doc = position.node.ownerDocument!;
        const win = doc.defaultView!;

        const scrollLeft = win?.pageXOffset || doc.documentElement.scrollLeft;
        const scrollTop = win?.pageYOffset || doc.documentElement.scrollTop;

        return {
            top: position.top + scrollTop,
            left: position.left + scrollLeft,
            width: position.width,
            height: position.height
        };

    }

}
