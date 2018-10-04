import {Splitter} from '../ui/splitter/Splitter';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AnnotationSidebar} from './AnnotationSidebar';
import {DocMeta} from '../metadata/DocMeta';
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class AnnotationSidebars {

    public static create(docMeta: DocMeta): Splitter {

        const splitter = new Splitter('#polar-viewer', '#polar-sidebar');

        splitter.collapse();

        ReactDOM.render(
            <AnnotationSidebar docMeta={docMeta} />,
            document.querySelector('#polar-sidebar') as HTMLElement
        );

        return splitter;

    }

    public static scrollToAnnotation(id: string, pageNum: number) {

        const selector = `.page div[data-annotation-id='${id}']`;

        const pageElements: HTMLElement[] = Array.from(document.querySelectorAll(".page"));
        const pageElement = pageElements[pageNum - 1];

        if (!pageElement) {
            log.error(`Could not find page ${pageNum} of N pages: ${pageElements.length}`);
            return;
        }

        this.scrollToElement(pageElement);

        const annotationElement = document.querySelector(selector)! as HTMLElement;

        this.scrollToElement(annotationElement);

    }

    private static scrollToElement(element: HTMLElement) {

        element.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });

    }


}
