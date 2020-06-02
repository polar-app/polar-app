import {PDFViewerContainer} from "./pdf/PDFViewerContainer";
import {PDFDocument} from "./pdf/PDFDocument";
import * as React from "react";
import {useDocViewerStore} from "../DocViewerStore";
import {URLStr} from "polar-shared/src/util/Strings";
import isEqual from "react-fast-compare";
import {EPUBDocument} from "./epub/EPUBDocument";
import {EPUBViewerContainer} from "./epub/EPUBViewerContainer";

interface ILoadedProps {
    readonly docURL: URLStr;
}

const PDFDocumentRenderer = (props: ILoadedProps) => {
    return (
        <>
            <PDFViewerContainer/>

            <PDFDocument {...props}/>

        </>
    );
}

const EPUBDocumentRenderer = (props: ILoadedProps) => {
    return (
        <>
            <EPUBViewerContainer/>

            <EPUBDocument {...props}/>

        </>
    );
}


export type DocFormatType = 'pdf' | 'epub';

interface IProps {
    readonly type: DocFormatType;
}

export const DocRenderer = React.memo((props: IProps) => {

    const {docURL} = useDocViewerStore();
    const {type} = props;

    if (! docURL) {
        return null;
    }

    switch (type) {

        case "pdf":
            return <PDFDocumentRenderer docURL={docURL}/>;
        case "epub":
            return <EPUBDocumentRenderer docURL={docURL}/>;

    }

    return null;

}, isEqual);
