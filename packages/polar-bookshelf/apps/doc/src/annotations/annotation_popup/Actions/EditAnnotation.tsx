import React from "react";
import {InputOptions, SimpleInputForm} from "./SimpleInputForm";
import {useBlocksStore} from "../../../../../../web/js/notes/store/BlocksStore";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightBlocksHooks";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";

interface EditAnnotationForm {
    readonly body: string;
}

export const EditAnnotation: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { className, style, annotationID } = props;
    const { getBlock } = useAnnotationBlockManager();
    const annotationPopupStore = useAnnotationPopupStore();
    const blocksStore = useBlocksStore();

    const inputs = React.useMemo<InputOptions<EditAnnotationForm>>(() => {
        const annotation = getBlock(annotationID, AnnotationContentType.TEXT_HIGHLIGHT);
        const text = annotation ? BlockTextHighlights.toText(annotation.content.value) : "";

        return {
            body: {
                placeholder: "Highlight text",
                initialValue: text
            },
        };
    }, [annotationID, getBlock]);

    const onSubmit = React.useCallback(({ body }: EditAnnotationForm) => {
        const annotation = getBlock(annotationID, AnnotationContentType.TEXT_HIGHLIGHT);

        if (! annotation) {
            return;
        }

        const contentJSON = annotation.content.toJSON();
        blocksStore.setBlockContent(annotation.id, {
            ...contentJSON,
            value: { ...contentJSON.value, revisedText: body }
        })

        annotationPopupStore.clearActiveAction();
    }, [annotationPopupStore, annotationID, blocksStore, getBlock]);

    return (
        <SimpleInputForm
            className={className}
            style={style}
            inputs={inputs}
            onCancel={() => annotationPopupStore.clearActiveAction()}
            onSubmit={onSubmit}
        />
    );
};
