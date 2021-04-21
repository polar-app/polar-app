interface IViewerElementContext {
    readonly containerElement: HTMLDivElement;
    readonly viewerElement: HTMLDivElement;
}

export namespace ViewerElements {

    export function find(docID: string): IViewerElementContext {

        const root = document.querySelector(`div[data-doc-viewer-id='${docID}']`);

        if (root === null) {
            throw new Error("No root");
        }

        const containerElement = root.querySelector('.viewerContainer')! as HTMLDivElement;

        if (containerElement === null) {
            throw new Error("No containerElement");
        }

        const viewerElement = root.querySelector('.viewer')! as HTMLDivElement;

        if (viewerElement === null) {
            throw new Error("No viewerElement");
        }

        return {viewerElement, containerElement};

    }

}

