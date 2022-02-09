import {useBlockTagEditorDialog} from "../../../../../../web/js/notes/NoteUtils";
import React from "react";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";

export const EditTags: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { annotationID } = props;
    const annotationPopupStore = useAnnotationPopupStore();
    const editTags = useBlockTagEditorDialog();

    React.useEffect(() => {
        annotationPopupStore.clearActiveAction();
        editTags([annotationID]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
