import {createStyles, makeStyles} from "@material-ui/core";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {IFlashcard} from "polar-shared/src/metadata/IFlashcard";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import React from "react";
import {DocAnnotationMoment} from "../../../annotation_sidebar/DocAnnotationMoment";
import {BlockEditorGenericProps} from "../../BlockEditor";
import {FlashcardAnnotationContent} from "../../content/AnnotationContent";
import {BlockContentEditable} from "../../contenteditable/BlockContentEditable";
import {BlockAnnotationAction, BlockAnnotationActionsWrapper, useSharedAnnotationBlockActions} from "./BlockAnnotationActions";
import {Flashcards} from "../../../metadata/Flashcards";
import CachedIcon from '@material-ui/icons/Cached';
import {useAnnotationBlockManager} from "../../NoteUtils";
import {AnnotationContentType, IFlashcardAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {ITextConverters} from "../../../annotation_sidebar/DocAnnotations";
import {AnnotationType} from "polar-shared/src/metadata/AnnotationType";
import {Refs} from "polar-shared/src/metadata/Refs";
import {Texts} from "polar-shared/src/metadata/Texts";
import {TextType} from "polar-shared/src/metadata/TextType";

interface IProps extends BlockEditorGenericProps {
    readonly annotation: FlashcardAnnotationContent;
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
    } = props;
    const classes = useStyles();

    const flashcard = annotation.value;
    const actions = useSharedAnnotationBlockActions({
        id,
        annotation,
        actions: ['remove'],
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
                return ITextConverters.create(AnnotationType.TEXT_HIGHLIGHT, highlight).text || '';
            }

            return '';
        };

        const getNewContent = (): IFlashcardAnnotationContent => {
            const ref = Refs.create(flashcard.id, 'flashcard');
            const text = getText();
            if (flashcard.type === FlashcardType.BASIC_FRONT_BACK) {
                return {
                    ...contentJSON,
                    value: Flashcards.createCloze(text, ref, 'MARKDOWN')
                };
            } else {
                return {
                    ...contentJSON,
                    value: Flashcards.createFrontBack('', text, ref, 'MARKDOWN')
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
                {flashcard.type === FlashcardType.BASIC_FRONT_BACK
                    ? (
                        <FrontBackFlashcard
                            {...props}
                            flashcard={flashcard}
                        />
                    ) : (
                        <ClozeFlashcard
                            {...props}
                            flashcard={flashcard}
                        />
                    )
                }
            </div>
        </BlockAnnotationActionsWrapper>
    );
};

interface IFlashcardProps extends BlockEditorGenericProps {
    flashcard: IFlashcard;
}

const FrontBackFlashcard: React.FC<IFlashcardProps> = (props) => {
    const { flashcard, id, onKeyDown, innerRef: frontRef } = props;
    const { fields, created } = flashcard;
    const { front, back } = React.useMemo(() => Flashcards.convertFieldsToMap(fields, 'MARKDOWN'), [fields]);
    const backRef = React.useRef<HTMLDivElement>(null);
    const { update, getBlock } = useAnnotationBlockManager();

    const handleChange = React.useCallback((type: 'front' | 'back') => (markdown: MarkdownStr) => {
        const block = getBlock(id, AnnotationContentType.FLASHCARD);
        if (block) {
            const contentJSON = block.content.toJSON();
            contentJSON.value.fields[type] = Texts.create(markdown, TextType.MARKDOWN);
            update(id, { ...contentJSON });
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

const ClozeFlashcard: React.FC<IFlashcardProps> = (props) => {
    const { flashcard, id } = props;
    const { fields, created } = flashcard;
    const { text } = React.useMemo(() => Flashcards.convertFieldsToMap(fields, 'MARKDOWN'), [fields]);
    const { update, getBlock } = useAnnotationBlockManager();

    const handleChange = React.useCallback((markdown: MarkdownStr) => {
        const block = getBlock(id, AnnotationContentType.FLASHCARD);
        if (block) {
            const contentJSON = block.content.toJSON();
            contentJSON.value.fields.text = Texts.create(markdown, TextType.MARKDOWN);
            update(id, { ...contentJSON });
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
