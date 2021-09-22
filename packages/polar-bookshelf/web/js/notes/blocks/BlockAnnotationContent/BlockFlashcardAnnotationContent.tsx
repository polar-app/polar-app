import {createStyles, makeStyles} from "@material-ui/core";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import React from "react";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {FlashcardAnnotationContent} from "../../content/AnnotationContent";
import {BlockContentEditable} from "../../contenteditable/BlockContentEditable";
import {BlockAnnotationAction, BlockAnnotationActionsWrapper, useSharedAnnotationBlockActions} from "./BlockAnnotationActions";
import CachedIcon from '@material-ui/icons/Cached';
import {AnnotationContentType, IFlashcardAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {useAnnotationBlockManager} from "../../HighlightNotesUtils";
import {BlockTextHighlights} from "polar-blocks/src/annotations/BlockTextHighlights";
import {BlockFlashcards} from "polar-blocks/src/annotations/BlockFlashcards";
import {IBlockClozeFlashcard, IBlockFrontBackFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {ISODateString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockTextContentUtils} from "../../NoteUtils";
import {BlockPredicates} from "../../store/BlockPredicates";
import {BlockTagsSection} from "./BlockHighlightContentWrapper";

interface IProps extends BlockEditorGenericProps {
    readonly annotation: FlashcardAnnotationContent;
    readonly created: ISODateString;
}

export const useStyles = makeStyles((theme) =>
    createStyles({
        flashcardWrapper: {
            borderRadius: 4,
            border: `1px solid ${theme.palette.text.hint}`,
            '& .flashcard-wrapper-item': {
                padding: 8,
            },
            '& .flashcard-wrapper-item + .flashcard-wrapper-item': {
                borderTop: `1px solid ${theme.palette.text.hint}`,
            }
        },
    })
);

export const BlockFlashcardAnnotationContent: React.FC<IProps> = (props) => {
    const {
        annotation,
        id,
        onClick,
    } = props;
    const classes = useStyles();

    const flashcard = annotation.value;
    const actions = useSharedAnnotationBlockActions({
        id,
        annotation,
        actions: ['remove', 'editTags'],
    });
    const { update, getBlock } = useAnnotationBlockManager();

    const handleChangeType = React.useCallback(() => {
        const block = getBlock(id, AnnotationContentType.FLASHCARD);
        if (! block) {
            return;
        }

        const getText = (): string => {
            if (! block.parent) {
                return '';
            }
            const parent = getBlock(block.parent)!;

            if (parent.content.type === AnnotationContentType.TEXT_HIGHLIGHT) {
                const highlight = parent.content.toJSON().value;
                return BlockTextHighlights.toText(highlight);
            }

            return '';
        };

        const getNewContent = (): IFlashcardAnnotationContent => {
            const text = getText();
            if (flashcard.type === FlashcardType.BASIC_FRONT_BACK) {
                return {
                    ...contentJSON,
                    value: BlockFlashcards.createCloze(text),
                };
            } else {
                return {
                    ...contentJSON,
                    value: BlockFlashcards.createFrontBack('', text),
                };
            }
        };

        const contentJSON = block.content.toJSON();
        update(id, getNewContent());
    }, [update, getBlock, id, flashcard]);

    return (
        <BlockAnnotationActionsWrapper
            actions={[
                ...actions,
                <BlockAnnotationAction key="switch" icon={<CachedIcon />} onClick={handleChangeType} />
            ]}
        >
            <div className={classes.flashcardWrapper}>
                {flashcard.type === FlashcardType.CLOZE
                    ? (
                        <ClozeFlashcard
                            {...props}
                            flashcard={flashcard}
                        />
                    ) : (
                        <FrontBackFlashcard
                            {...props}
                            flashcard={flashcard}
                        />
                    )
                }
            </div>
            <BlockTagsSection onClick={onClick} links={annotation.links} />
        </BlockAnnotationActionsWrapper>
    );
};

interface IFrontBackFlashcardProps extends BlockEditorGenericProps {
    readonly flashcard: IBlockFrontBackFlashcard;
    readonly created: ISODateString;
}

const FrontBackFlashcard: React.FC<IFrontBackFlashcardProps> = (props) => {
    const { flashcard, id, onKeyDown, innerRef: frontRef, created } = props;
    const { fields: { front, back } } = flashcard;
    const backRef = React.useRef<HTMLDivElement>(null);
    const { update, getBlock } = useAnnotationBlockManager();

    const handleChange = React.useCallback((field: keyof IBlockFrontBackFlashcard['fields']) => (markdown: MarkdownStr) => {
        const block = getBlock(id, AnnotationContentType.FLASHCARD);
        if (block && BlockPredicates.isFrontBackFlashcardBlock(block)) {
            const content = BlockTextContentUtils.updateFlashcardContentMarkdown(block.content, field, markdown);
            update(id, content);
        }
    }, [id, getBlock, update]);

    return (
        <>
            <div className="flashcard-wrapper-item">
                <BlockContentEditable
                    {...props}
                    onChange={handleChange('front')}
                    onKeyDown={onKeyDown}
                    innerRef={frontRef}
                    content={front}
                />
            </div>
            <div className="flashcard-wrapper-item">
                <BlockContentEditable
                    {...props}
                    onChange={handleChange('back')}
                    onKeyDown={onKeyDown}
                    innerRef={backRef}
                    content={back}
                />
                <div style={{ marginTop: 5 }}>
                    <DocAnnotationMoment created={created} />
                </div>
            </div>
        </>
    );
};

interface IClozeFlashcardProps extends BlockEditorGenericProps {
    readonly flashcard: IBlockClozeFlashcard;
    readonly created: ISODateString;
}

const ClozeFlashcard: React.FC<IClozeFlashcardProps> = (props) => {
    const { flashcard, id, created } = props;
    const { fields: { text } } = flashcard;
    const { update, getBlock } = useAnnotationBlockManager();

    const handleChange = React.useCallback((markdown: MarkdownStr) => {
        const block = getBlock(id, AnnotationContentType.FLASHCARD);
        if (block && BlockPredicates.isClozeFlashcardBlock(block)) {
            const content = BlockTextContentUtils.updateFlashcardContentMarkdown(block.content, 'text', markdown);
            update(id, content);
        }
    }, [id, update, getBlock]);

    return (
        <div className="flashcard-wrapper-item">
            <BlockContentEditable
                {...props}
                content={text}
                onChange={handleChange}
            />
            <div style={{ marginTop: 5 }}>
                <DocAnnotationMoment created={created} />
            </div>
        </div>
    );
};
