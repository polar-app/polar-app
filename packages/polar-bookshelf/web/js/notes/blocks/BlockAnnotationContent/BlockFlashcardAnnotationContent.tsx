import {Box, CircularProgress, createStyles, IconButton, makeStyles} from "@material-ui/core";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import React from "react";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {FlashcardAnnotationContent} from "../../content/AnnotationContent";
import {BlockContentEditable} from "../../contenteditable/BlockContentEditable";
import {useAnnotationBlockManager} from "../../HighlightBlocksHooks";
import {IBlockClozeFlashcard, IBlockFrontBackFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {ISODateString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BlockPredicates} from "../../store/BlockPredicates";
import {BlockTagsSection} from "./BlockHighlightContentWrapper";
import {useBlocksTreeStore} from "../../BlocksTree";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockTextContentUtils} from "../../BlockTextContentUtils";
import {AutoClozeDeletionIcon} from "../../../icons/AutoClozeDeletionIcon";
import {useAIFlashcardVerifiedAction} from "../../../../../apps/repository/js/ui/AIFlashcardVerifiedAction";
import {useAutoClozeDeletionBlock} from "../../../annotation_sidebar/AutoClozeDeletionHook";

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
        onClick,
    } = props;
    const classes = useStyles();

    const flashcard = annotation.value;


    return (
        <>
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
        </>
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
    const { getBlock } = useAnnotationBlockManager();
    const blocksTreeStore = useBlocksTreeStore();

    const handleChange = React.useCallback((field: keyof IBlockFrontBackFlashcard['fields']) => (markdown: MarkdownStr) => {
        const block = getBlock(id, AnnotationContentType.FLASHCARD);
        if (block && BlockPredicates.isFrontBackFlashcardBlock(block)) {
            const content = BlockTextContentUtils.updateFlashcardContentMarkdown(block.content, field, markdown);
            blocksTreeStore.setBlockContent(id, content);
        }
    }, [id, getBlock, blocksTreeStore]);

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
    const { getBlock } = useAnnotationBlockManager();
    const blocksTreeStore = useBlocksTreeStore();
    const verifiedAction = useAIFlashcardVerifiedAction();
    const [aiClozeDeletionState, aiClozeDeletionHandler] = useAutoClozeDeletionBlock();

    const handleChange = React.useCallback((markdown: MarkdownStr) => {
        const block = getBlock(id, AnnotationContentType.FLASHCARD);
        if (block && BlockPredicates.isClozeFlashcardBlock(block)) {
            const content = BlockTextContentUtils.updateFlashcardContentMarkdown(block.content, 'text', markdown);
            blocksTreeStore.setBlockContent(id, content);
        }
    }, [id, getBlock, blocksTreeStore]);

    const handleAutoCloze = React.useCallback(() => {
        if (aiClozeDeletionState === 'waiting') {
            return;
        }

        verifiedAction(() => {
            aiClozeDeletionHandler(id)
                .catch(e => console.error("Could not handle verified action: ", e));
        });
    }, [verifiedAction, aiClozeDeletionHandler, aiClozeDeletionState, id]);

    return (
        <div className="flashcard-wrapper-item">
            <BlockContentEditable
                {...props}
                content={text}
                onChange={handleChange}
            />
            <Box display="flex" mt="0.75rem" style={{ marginTop: 5 }}>
                <Box mr="0.5rem">
                    <IconButton disabled={aiClozeDeletionState === 'waiting'} size="small" onClick={handleAutoCloze}>
                        {aiClozeDeletionState === 'idle'
                            ? <AutoClozeDeletionIcon />
                            : <CircularProgress size="1.7rem" color="secondary" /> 
                        }
                    </IconButton>
                </Box>
                <DocAnnotationMoment created={created} />
            </Box>
        </div>
    );
};
