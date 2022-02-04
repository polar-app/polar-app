import {useBlockTagEditorDialog} from "../../../../../../web/js/notes/NoteUtils";
import React from "react";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";

export const EditTags: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { annotation } = props;
    const { clear } = useAnnotationPopup();
    const editTags = useBlockTagEditorDialog();

    React.useEffect(() => {
        clear();
        editTags([annotation.id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
