import {PDFViewerContainer} from "./pdf/PDFViewerContainer";
import {PDFDocument} from "./pdf/PDFDocument";
import * as React from "react";
import {useDocViewerStore} from "../DocViewerStore";
import {URLStr} from "polar-shared/src/util/Strings";
import isEqual from "react-fast-compare";
import {EPUBDocument} from "./epub/EPUBDocument";
import {EPUBViewerContainer} from "./epub/EPUBViewerContainer";
import {FileTypes} from "../../../../web/js/apps/main/file_loaders/FileTypes";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileType} from "../../../../web/js/apps/main/file_loaders/FileType";
import {EPUBFinderProvider} from "./epub/EPUBFinderStore";
import {isPresent} from "polar-shared/src/Preconditions";

interface ILoadedProps {
    readonly docURL: URLStr;
    readonly docMeta: IDocMeta;
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
        <EPUBFinderProvider>
            <>
                <EPUBViewerContainer/>

                <EPUBDocument {...props}/>

            </>
        </EPUBFinderProvider>
    );
}

interface IDocViewerContext {
    readonly fileType: FileType;
    readonly docID: string;
}

export const DocViewerContext = React.createContext<IDocViewerContext>(null!);

/**
 * Provided so we can determine which type of doc type we should load (epub,
 * pdf, etc)
 */
export function useDocViewerContext(): IDocViewerContext {
    const result = React.useContext(DocViewerContext);

    if (! isPresent(result)) {
        throw new Error("DocViewerContext not defined.");
    }

    return result;
}

interface DocRendererDelegateProps {
    readonly docURL: string,
    readonly docMeta: IDocMeta;
    readonly fileType: FileType;
}

const DocRendererDelegate = React.memo((props: DocRendererDelegateProps) => {

    switch (props.fileType) {

        case "pdf":
            return <PDFDocumentRenderer docURL={props.docURL} docMeta={props.docMeta}/>;
        case "epub":
            return <EPUBDocumentRenderer docURL={props.docURL} docMeta={props.docMeta}/>;
        default:
            return null;
    }

});

export const DocRenderer = React.memo(() => {

    const {docURL, docMeta} = useDocViewerStore(['docURL', 'docMeta']);

    if (! docURL || ! docMeta) {
        return null;
    }

    const fileType = FileTypes.create(docURL);

    return (
        <DocRendererDelegate docURL={docURL} docMeta={docMeta} fileType={fileType}/>
    );

}, isEqual);
