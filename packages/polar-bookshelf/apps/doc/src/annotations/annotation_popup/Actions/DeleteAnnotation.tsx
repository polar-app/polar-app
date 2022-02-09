import React from "react";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightBlocksHooks";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";


export const useDeleteAnnotation = () => {
    const annotationPopupStore = useAnnotationPopupStore();
    const { remove } = useAnnotationBlockManager();

    return React.useCallback(() => {
        const { selectedAnnotationID } = annotationPopupStore;

        if (selectedAnnotationID) {
            remove(selectedAnnotationID);
        }

        annotationPopupStore.reset();
    }, [annotationPopupStore, remove]);
};
