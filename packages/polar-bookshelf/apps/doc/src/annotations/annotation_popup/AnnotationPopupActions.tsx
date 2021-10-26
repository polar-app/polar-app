import React from "react";
import clsx from "clsx";
import {createStyles, Grow, makeStyles} from "@material-ui/core";
import {useAnnotationPopupStyles} from "./AnnotationPopup";
import {AnnotationPopupActionEnum, useAnnotationPopup} from "./AnnotationPopupContext";
import {useAnnotationMutationsContext} from "../../../../../web/js/annotation_sidebar/AnnotationMutationsContext";
import {ColorMenu} from "../../../../../web/js/ui/ColorMenu";
import {ColorStr} from "../../../../../web/js/ui/colors/ColorSelectorBox";
import {EditAnnotation} from "./Actions/EditAnnotation";
import {CreateComment} from "./Actions/CreateComment";
import {CreateFlashcard} from "./Actions/CreateFlashcard";
import {CreateAIFlashcard} from "./Actions/CreateAIFlashcard";
import {EditTags} from "./Actions/EditTags";
import {DeleteAnnotation} from "./Actions/DeleteAnnotation";
import {ANNOTATION_COLOR_SHORTCUT_KEYS} from "./AnnotationPopupShortcuts";
import {IBlockAnnotation, IDocMetaAnnotation} from "./AnnotationPopupReducer";
import {IDocAnnotation} from "../../../../../web/js/annotation_sidebar/DocAnnotation";
import {TextHighlightAnnotationContent} from "../../../../../web/js/notes/content/AnnotationContent";
import {Block} from "../../../../../web/js/notes/store/Block";
import {useBlocksStore} from "../../../../../web/js/notes/store/BlocksStore";

export type IDocMetaAnnotationProps = {
    readonly annotation: IDocAnnotation,
};

export type IBlockAnnotationProps = {
    readonly annotation: Block<TextHighlightAnnotationContent>,
};

export type IAnnotationPopupActionProps = {
    readonly className?: string,
    readonly style?: React.CSSProperties,
    readonly annotation: IDocMetaAnnotation | IBlockAnnotation,
};

const ColorPicker: React.FC<IAnnotationPopupActionProps> = (props) => {
    const { className = "", style = {}, annotation } = props;
    const { clear } = useAnnotationPopup();

    const DocMetaAnnotation: React.FC<IDocMetaAnnotationProps> = ({ annotation }) => {
        const annotationMutations = useAnnotationMutationsContext();
        const handleColor = annotationMutations.createColorCallback({selected: [annotation]});

        const handleChange = React.useCallback((color: ColorStr) => {
            handleColor({ color });
            clear();
        }, [handleColor]);

        return (
            <ColorMenu
                selected={annotation.color}
                onChange={handleChange}
                hintLimit={ANNOTATION_COLOR_SHORTCUT_KEYS.length}
                withHints
            />
        );
    };

    const BlockAnnotation: React.FC<IBlockAnnotationProps> = ({ annotation }) => {

        const blocksStore = useBlocksStore();
        const handleChange = React.useCallback((color: ColorStr) => {
            const annotationJSON = annotation.content.toJSON();

            blocksStore.setBlockContent(annotation.id, {
                ...annotationJSON,
                value: { ...annotationJSON.value, color }
            });
            clear();
        }, [blocksStore, annotation]);

        return (
            <ColorMenu
                selected={annotation.content.value.color}
                onChange={handleChange}
                hintLimit={ANNOTATION_COLOR_SHORTCUT_KEYS.length}
                withHints
            />
        );
    };

    return (
        <div className={className} style={{ ...style, width: "auto" }}>
            {annotation.type === 'docMeta'
                ? <DocMetaAnnotation annotation={annotation.annotation} />
                : <BlockAnnotation annotation={annotation.annotation} />
            }
        </div>
    );
};

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            margin: "10px 0",
            transformOrigin: "bottom center",
            boxShadow: theme.shadows[8],
            width: "100%",
            zIndex: 2,
        },
    }),
);




const ACTIONS: Record<AnnotationPopupActionEnum, React.FC<IAnnotationPopupActionProps>> = {
    [AnnotationPopupActionEnum.CHANGE_COLOR]: ColorPicker,
    [AnnotationPopupActionEnum.CREATE_COMMENT]: CreateComment,
    [AnnotationPopupActionEnum.EDIT]: EditAnnotation,
    [AnnotationPopupActionEnum.CREATE_FLASHCARD]: CreateFlashcard,
    [AnnotationPopupActionEnum.CREATE_AI_FLASHCARD]: CreateAIFlashcard,
    [AnnotationPopupActionEnum.EDIT_TAGS]: EditTags,
    [AnnotationPopupActionEnum.DELETE]: DeleteAnnotation,
};

export const AnnotationPopupActions: React.FC = () => {
    const {activeAction, annotation} = useAnnotationPopup();
    const classes = useStyles();
    const annotationPopupClasses = useAnnotationPopupStyles();
    const ActionComponent = activeAction ? ACTIONS[activeAction] : null;

    if (!ActionComponent || !annotation) {
        return null;
    }

    return (
        <Grow in>
            <ActionComponent
                className={clsx(classes.root, annotationPopupClasses.root)}
                annotation={annotation}
            />
        </Grow>
    );
};
