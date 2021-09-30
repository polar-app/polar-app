import React from "react";
import {IAnnotationPopupActionProps, IBlockAnnotationProps, IDocMetaAnnotationProps} from "../AnnotationPopupActions";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightBlocksHooks";


export const DeleteAnnotation: React.FC<IAnnotationPopupActionProps> = ({ annotation }) => {
    const { clear } = useAnnotationPopup();

    const DocMetaDelete: React.FC<IDocMetaAnnotationProps> = ({ annotation }) => {
        const annotationMutations = useAnnotationMutationsContext();
        const handleDelete = annotationMutations.createDeletedCallback({selected: [annotation]});
        React.useEffect(() => {
            clear();
            handleDelete();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div />;
    };

    const BlockDelete: React.FC<IBlockAnnotationProps> = ({ annotation }) => {
        const { remove } = useAnnotationBlockManager();
        React.useEffect(() => {
            clear();
            remove(annotation.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div />;
    };


    return annotation.type === 'docMeta'
        ? <DocMetaDelete annotation={annotation.annotation} />
        : <BlockDelete annotation={annotation.annotation} />;
};
