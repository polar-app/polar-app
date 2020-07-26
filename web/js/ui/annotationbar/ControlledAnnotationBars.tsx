import {
    AnnotationBarCallbacks,
    ControlledAnnotationBar
} from './ControlledAnnotationBar';
import * as React from 'react';
import {
    ActiveSelectionEvent,
    ActiveSelections
} from '../popup/ActiveSelections';
import {ControlledPopupProps} from '../popup/ControlledPopup';
import * as ReactDOM from 'react-dom';
import {Point} from '../../Point';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Points} from '../../Points';
import {HighlightCreatedEvent} from '../../comments/react/HighlightCreatedEvent';
import {Elements} from "../../util/Elements";
import {isPresent} from 'polar-shared/src/Preconditions';
import {FileType} from "../../apps/main/file_loaders/FileType";

export interface RegisterOpts {
    readonly fileType: FileType;
}

export namespace ControlledAnnotationBars {

    export function create(controlledPopupProps: ControlledPopupProps,
                           annotationBarCallbacks: AnnotationBarCallbacks,
                           opts: RegisterOpts) {

        registerEventListener(annotationBarCallbacks, opts);

    }

    function registerEventListener(annotationBarCallbacks: AnnotationBarCallbacks,
                                   opts: RegisterOpts) {

        const handleTarget = (target: HTMLElement) => {

            let annotationBar: HTMLElement | undefined;

            interface AnnotationPageInfo {
                readonly pageNum: number;
                readonly pageElement: HTMLElement;
            }

            ActiveSelections.addEventListener(activeSelectionEvent => {

                const computeAnnotationPageInfo = (): AnnotationPageInfo | undefined => {

                    const computeForPDF = (): AnnotationPageInfo | undefined => {

                        const pageElement = Elements.untilRoot(activeSelectionEvent.element, ".page");

                        if (! pageElement) {
                            // log.warn("Not found within .page element");
                            return undefined;
                        }

                        const pageNum = parseInt(pageElement.getAttribute("data-page-number"), 10);

                        return {pageElement, pageNum};

                    };

                    const computeForEPUB = (): AnnotationPageInfo | undefined => {
                        return {pageElement: target, pageNum: 1};
                    };

                    switch (opts.fileType) {
                        case "pdf":
                            return computeForPDF();

                        case "epub":
                            return computeForEPUB();
                    }

                };

                const annotationPageInfo = computeAnnotationPageInfo();

                if (! annotationPageInfo) {
                    return;
                }

                switch (activeSelectionEvent.type) {

                    case 'created':

                        annotationBar = createAnnotationBar(annotationPageInfo.pageNum,
                                                                 annotationPageInfo.pageElement,
                                                                 annotationBarCallbacks,
                                                                 activeSelectionEvent);

                        break;

                    case 'destroyed':

                        if (annotationBar) {
                            destroyAnnotationBar(annotationBar);
                        }

                        break;

                }

                if (activeSelectionEvent.type === 'destroyed') {
                    // only created supported for now.
                    return;
                }

            }, target);
        };

        const targets = computeTargets(opts.fileType);

        for (const target of targets) {
            handleTarget(target);
        }

    }

    function computeTargets(fileType: FileType): ReadonlyArray<HTMLElement> {

        function computeTargetsForPDF(): ReadonlyArray<HTMLElement> {
            // FIXME: this is not portable to Polar 2.0 tabbed browsing.

            const pageElements = Array.from(document.querySelectorAll(".page")) as HTMLElement[];

            console.log("FIXME: adding annotaiton bar across N pageElementS: " + pageElements.length);

            return pageElements;
        }

        function computeTargetsForEPUB(): ReadonlyArray<HTMLElement> {

            return Array.from(document.querySelectorAll("iframe"))
                        .map(iframe => iframe.contentDocument)
                        .filter(contentDocument => isPresent(contentDocument))
                        .map(contentDocument => contentDocument!)
                        .map(contentDocument => contentDocument.documentElement)
                        // .map(documentElement => computeDocumentElements(documentElement))
                        // .reduce(Reducers.FLAT, []);

        }

        switch(fileType) {

            case "pdf":
                return computeTargetsForPDF();

            case "epub":
                return computeTargetsForEPUB();

        }

    }

    function destroyAnnotationBar(annotationBar: HTMLElement) {

        if (annotationBar && annotationBar.parentElement) {
            annotationBar.parentElement!.removeChild(annotationBar);
        }

    }

    function computePosition(pageElement: HTMLElement,
                             point: Point,
                             offset: Point | undefined): Point {

        // const docFormat = DocFormatFactory.getInstance();

        const origin: Point =
            Optional.of(pageElement.getBoundingClientRect())
                .map(rect => {
                    return {'x': rect.left, 'y': rect.top};
                })
                .get();

        // one off for the html viewer... I hope we can unify these one day.
        // if (docFormat.name === 'html') {
        //     origin = {x: 0, y: 0};
        // }

        const relativePoint: Point =
            Points.relativeTo(origin, point);

        offset = offset || {x: 0, y: 0};

        const left = relativePoint.x + offset.x;
        const top = relativePoint.y + offset.y;

        return {
            x: left,
            y: top
        };

    }

    function createAnnotationBar(pageNum: number,
                                 pageElement: HTMLElement,
                                 annotationBarCallbacks: AnnotationBarCallbacks,
                                 activeSelectionEvent: ActiveSelectionEvent) {

        const point: Point = {
            x: activeSelectionEvent.boundingClientRect.left + (activeSelectionEvent.boundingClientRect.width / 2),
            y: activeSelectionEvent.boundingClientRect.top
        };

        const offset: Point = {
            x: -75,
            y: -50
        };

        // TODO use the mouseDirection on the activeSelectionEvent and place
        // with top/bottom

        // TODO: we have to compute the position above or below based on the
        // direction of the mouse movement.

        const position = computePosition(pageElement, point, offset);

        const annotationBar = document.createElement('div');
        annotationBar.setAttribute("class", 'polar-annotation-bar');

        annotationBar.addEventListener('mouseup', (event) => event.stopPropagation());
        annotationBar.addEventListener('mousedown', (event) => event.stopPropagation());

        const style = `position: absolute; top: ${position.y}px; left: ${position.x}px; z-index: 10000;`;
        annotationBar.setAttribute('style', style);

        pageElement.insertBefore(annotationBar, pageElement.firstChild);

        const onHighlightedCallback = (highlightCreatedEvent: HighlightCreatedEvent) => {
            // TODO: there's a delay here and it might be nice to have a progress
            // bar until it completes.
            annotationBarCallbacks.onHighlighted(highlightCreatedEvent);
            destroyAnnotationBar(annotationBar);

        };

        ReactDOM.render(
            <ControlledAnnotationBar activeSelection={activeSelectionEvent}
                                     onHighlighted={onHighlightedCallback}
                                     type='range'
                                     pageNum={pageNum}/>,

            annotationBar

        );

        return annotationBar;

    }

}



