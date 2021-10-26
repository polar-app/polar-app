import {isPresent} from 'polar-shared/src/Preconditions';
import {FileType} from "../../apps/main/file_loaders/FileType";

export interface RegisterOpts {
    readonly fileType: FileType;
    readonly docViewerElementProvider: () => HTMLElement;
}

export namespace ControlledAnnotationBars {

    export function computeTargets(fileType: FileType, docViewerElementProvider: () => HTMLElement): ReadonlyArray<HTMLElement> {

        const docViewerElement = docViewerElementProvider();

        function computeTargetsForPDF(): ReadonlyArray<HTMLElement> {
            return Array.from(docViewerElement.querySelectorAll(".page")) as readonly HTMLElement[];
        }

        function computeTargetsForEPUB(): ReadonlyArray<HTMLElement> {
            return Array.from(docViewerElement.querySelectorAll("iframe"))
                        .map(iframe => iframe.contentDocument)
                        .filter(contentDocument => isPresent(contentDocument))
                        .map(contentDocument => contentDocument!)
                        .map(contentDocument => contentDocument.documentElement)
        }

        switch(fileType) {

            case "pdf":
                return computeTargetsForPDF();

            case "epub":
                return computeTargetsForEPUB();

        }

    }
}



