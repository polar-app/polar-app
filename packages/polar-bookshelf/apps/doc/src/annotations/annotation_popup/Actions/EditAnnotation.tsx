import React from "react";
import {useAnnotationPopup} from "../AnnotationPopupContext";
import {InputOptions, SimpleInputForm} from "./SimpleInputForm";
import {useBlocksStore} from "../../../../../../web/js/notes/store/BlocksStore";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";

type EditAnnotationForm = {
    body: string;
};

export const EditAnnotation: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { className = "", style = {}, annotation } = props;
    const { clear } = useAnnotationPopup();
    const blocksStore = useBlocksStore();

    const inputs = React.useMemo<InputOptions<EditAnnotationForm>>(() => {
        const text = BlockTextHighlights.toText(annotation.content.value);

        return {
            body: {
                placeholder: "Highlight text",
                initialValue: text
            },
        };
    }, [annotation]);

    const onSubmit = React.useCallback(({ body }: EditAnnotationForm) => {
        const contentJSON = annotation.content.toJSON();
        blocksStore.setBlockContent(annotation.id, {
            ...contentJSON,
            value: { ...contentJSON.value, revisedText: body }
        })

        clear();
    }, [clear, annotation, blocksStore]);

    return (
        <SimpleInputForm
            className={className}
            style={style}
            inputs={inputs}
            onCancel={clear}
            onSubmit={onSubmit}
        />
    );
};
