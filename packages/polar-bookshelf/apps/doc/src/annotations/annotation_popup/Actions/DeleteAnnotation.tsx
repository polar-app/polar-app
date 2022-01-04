import React from "react";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightBlocksHooks";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";


export const DeleteAnnotation: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const { clear } = useAnnotationPopup();
    const { remove } = useAnnotationBlockManager();

    React.useEffect(() => {
        clear();
        remove(annotation.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
