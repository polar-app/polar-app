import {useDocViewerElementsContext} from "../../DocViewerElementsContext";
import {useDocViewerStore} from "../../../DocViewerStore";

export function useDocViewerIFrame() {

    const docViewerElementsContext = useDocViewerElementsContext();

    // used so we update on each page...
    useDocViewerStore(['page']);

    const docViewerElement = docViewerElementsContext.getDocViewerElement();
    return docViewerElement.querySelector('iframe');

}
