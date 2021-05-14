import React from "react";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {Clipboards} from "../../../../../../web/js/util/system/clipboard/Clipboards";
import {IDocAnnotation} from "../../../../../../web/js/annotation_sidebar/DocAnnotation";
import {AnnotationTypes} from "../../../../../../web/js/metadata/AnnotationTypes";
import {IAnnotationPopupActionProps} from "../AnnotationPopupActions";
import {useAnnotationPopup} from "../AnnotationPopupContext";


const copyAnnotationToClipboard = (annotation: IDocAnnotation) => {
    const annotationOriginal = annotation.original;
    if (AnnotationTypes.isTextHighlight(annotationOriginal, annotation.annotationType)) {
        Clipboards.writeText(annotation.text || "");
    }
};
export const CopyAnnotation: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const {clear} = useAnnotationPopup();
    const dialogs = useDialogManager();

    React.useEffect(() => {
        clear();
        copyAnnotationToClipboard(annotation);
        dialogs.snackbar({ message: "Copied annotation contents to clipboard successfully!" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
};
