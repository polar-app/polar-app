import {PDFViewerContainer} from "./pdf/PDFViewerContainer";
import {PDFDocument} from "./pdf/PDFDocument";
import * as React from "react";
import {useDocViewerStore} from "../DocViewerStore";
import {URLStr} from "polar-shared/src/util/Strings";
import isEqual from "react-fast-compare";
import {EPUBDocument} from "./epub/EPUBDocument";
import {EPUBViewerContainer} from "./epub/EPUBViewerContainer";
import {FileTypes} from "../../../../web/js/apps/main/file_loaders/FileTypes";

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

interface IProps {
}

export const DocRenderer = React.memo((props: IProps) => {

    const {docURL} = useDocViewerStore();

    if (! docURL) {
        return null;
    }

    const type = FileTypes.create(docURL);

    switch (type) {

        case "pdf":
            return <PDFDocumentRenderer docURL={docURL}/>;
        case "epub":
            return <EPUBDocumentRenderer docURL={docURL}/>;

    }

    return null;

}, isEqual);
