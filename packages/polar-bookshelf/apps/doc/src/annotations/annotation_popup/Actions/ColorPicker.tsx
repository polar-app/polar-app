import {ColorStr} from "../../../../../../web/js/ui/colors/ColorSelectorBox";
import React from "react";
import {IAnnotationPopupActionProps} from "../IAnnotationPopupActionProps";
import {useBlocksStore} from "../../../../../../web/js/notes/store/BlocksStore";
import {useAnnotationBlockManager} from "../../../../../../web/js/notes/HighlightBlocksHooks";
import {useAnnotationPopupStore} from "../AnnotationPopupContext";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {ColorMenu} from "../../../../../../web/js/ui/ColorMenu";
import {ANNOTATION_COLOR_SHORTCUT_KEYS} from "../AnnotationPopupShortcuts";
import {Devices} from "polar-shared/src/util/Devices";
import {reaction} from "mobx";


export const ColorPicker: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { className, style, annotationID } = props;

    const blocksStore = useBlocksStore();
    const { getBlock } = useAnnotationBlockManager();
    const annotationPopupStore = useAnnotationPopupStore();

    const handleChange = React.useCallback((color: ColorStr) => {
        const annotation = getBlock(annotationID, AnnotationContentType.TEXT_HIGHLIGHT);

        if (! annotation) {
            return;
        }

        const annotationJSON = annotation.content.toJSON();

        blocksStore.setBlockContent(annotation.id, {
            ...annotationJSON,
            value: { ...annotationJSON.value, color }
        });
        annotationPopupStore.clearActiveAction();
    }, [blocksStore, annotationID, annotationPopupStore, getBlock]);

    const getColor = React.useCallback(() => {
        const annotation = getBlock(annotationID, AnnotationContentType.TEXT_HIGHLIGHT);

        if (! annotation) {
            return;
        }
        
        return annotation.content.value.color;
    }, [annotationID, getBlock]);

    const [color, setColor] = React.useState(getColor);

    React.useEffect(() => reaction(getColor, setColor), [setColor, getColor]);

    return (
        <div className={className} style={{ ...style, width: "auto" }}>
            <ColorMenu
                selected={color}
                onChange={handleChange}
                hintLimit={ANNOTATION_COLOR_SHORTCUT_KEYS.length}
                withHints={Devices.isDesktop()}
            />
        </div>
    );
};
