import React from "react";
import {InputOptions, SimpleInputForm} from "./SimpleInputForm";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {useBlocksStore} from "../../../../../../web/js/notes/store/BlocksStore";
import {MarkdownContent} from "../../../../../../web/js/notes/content/MarkdownContent";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";

type CreateCommentForm = {
    body: string;
};

const FORM_INPUTS: InputOptions<CreateCommentForm> = {
    body: { placeholder: "Comment" },
};

export const CreateComment: React.FC<IAnnotationPopupActionProps> = (props) => {
    const {style = {}, className = "", annotation} = props;
    const {clear} = useAnnotationPopup();
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
        clear();
    }, [blocksStore, annotation, clear]);

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
