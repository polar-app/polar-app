import React from "react";
import {useAnnotationMutationsContext} from "../../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {useDialogManager} from "../../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {InputOptions, SimpleInputForm} from "./SimpleInputForm";
import {Refs} from "polar-shared/src/metadata/Refs";
import {IAnnotationPopupActionProps, IBlockAnnotationProps, IDocMetaAnnotationProps} from "../AnnotationPopupActions";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {useBlocksStore} from "../../../../../../web/js/notes/store/BlocksStore";
import {MarkdownContent} from "../../../../../../web/js/notes/content/MarkdownContent";

type CreateCommentForm = {
    readonly body: string;
};

const FORM_INPUTS: InputOptions<CreateCommentForm> = {
    body: { placeholder: "Comment" },
};

export const CreateComment: React.FC<IAnnotationPopupActionProps> = (props) => {
    const {style = {}, className = "", annotation} = props;
    const {clear} = useAnnotationPopup();
    const dialogs = useDialogManager();

    const DocMetaComment: React.FC<IDocMetaAnnotationProps> = ({ annotation }) => {
        const annotationMutations = useAnnotationMutationsContext();
        const createComment = annotationMutations.createCommentCallback(annotation);

        const onSubmit = React.useCallback(({ body }: CreateCommentForm) => {
            createComment({
                type: "create",
                parent: Refs.createRef(annotation),
                body,
            });
            dialogs.snackbar({ message: "Comment created successfully!" });
            clear();
        }, [annotation, createComment]);

        return (
            <SimpleInputForm
                inputs={FORM_INPUTS}
                onCancel={clear}
                onSubmit={onSubmit}
                className={className}
                style={style}
            />
        );
    };

    const BlockComment: React.FC<IBlockAnnotationProps> = ({ annotation }) => {
        const blocksStore = useBlocksStore();

        const onSubmit = React.useCallback(({ body }: CreateCommentForm) => {
            const content = new MarkdownContent({
                links: [],
                type: 'markdown',
                data: body,
            });
            blocksStore.createNewBlock(annotation.id, {
                unshift: true,
                content,
            });
            dialogs.snackbar({ message: "Comment created successfully!" });
            clear();
        }, [blocksStore, annotation]);

        return (
            <SimpleInputForm
                inputs={FORM_INPUTS}
                onCancel={clear}
                onSubmit={onSubmit}
                className={className}
                style={style}
            />
        );
    };

    return annotation.type === 'docMeta'
        ? <DocMetaComment annotation={annotation.annotation} />
        : <BlockComment annotation={annotation.annotation} />

};
