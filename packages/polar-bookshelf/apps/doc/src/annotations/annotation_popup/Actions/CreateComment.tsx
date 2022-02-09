import React from "react";
import {InputOptions, SimpleInputForm} from "./SimpleInputForm";
import {useBlocksStore} from "../../../../../../web/js/notes/store/BlocksStore";
import {MarkdownContent} from "../../../../../../web/js/notes/content/MarkdownContent";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";

type CreateCommentForm = {
    body: string;
};

const FORM_INPUTS: InputOptions<CreateCommentForm> = {
    body: { placeholder: "Comment" },
};

export const CreateComment: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { style, className, annotationID } = props;
    const blocksStore = useBlocksStore();
    const annotationPopupStore = useAnnotationPopupStore();

    const onSubmit = React.useCallback(({ body }: CreateCommentForm) => {
        annotationPopupStore.clearActiveAction();

        const content = new MarkdownContent({
            links: [],
            type: 'markdown',
            data: body,
        });

        blocksStore.createNewBlock(annotationID, {
            unshift: true,
            content,
        });
    }, [blocksStore, annotationPopupStore, annotationID]);

    return (
        <SimpleInputForm
            inputs={FORM_INPUTS}
            onCancel={() => annotationPopupStore.clearActiveAction()}
            onSubmit={onSubmit}
            className={className}
            style={style}
        />
    );
};
