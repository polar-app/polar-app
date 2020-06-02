import {PDFViewerContainer} from "./pdf/PDFViewerContainer";
import {PDFDocument} from "./pdf/PDFDocument";
import * as React from "react";

export type DocFormatType = 'pdf' | 'epub';

export const PDFDocumentRenderer = () => {
    return (
        <>
            <PDFViewerContainer/>

            <PDFDocument/>

        </>
    );
}

export namespace DocumentRenderers {

    export function create(type: DocFormatType) {

        return null;

    }

}
