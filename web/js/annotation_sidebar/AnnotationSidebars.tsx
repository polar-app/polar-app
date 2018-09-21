import {Splitter} from '../ui/splitter/Splitter';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AnnotationSidebar} from './AnnotationSidebar';
import {DocMeta} from '../metadata/DocMeta';

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

}
