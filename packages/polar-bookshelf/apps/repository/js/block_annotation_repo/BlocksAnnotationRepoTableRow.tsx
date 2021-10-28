import {Box, createStyles, makeStyles, TableCell, TableRow, Theme, useTheme} from "@material-ui/core";
import {AnnotationContentType, IAreaHighlightAnnotationContent, IFlashcardAnnotationContent, ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import React from "react";
import {DocFileResolvers} from "../../../../web/js/datastore/DocFileResolvers";
import {Images} from "../../../../web/js/metadata/Images";
import {MarkdownContentConverter} from "../../../../web/js/notes/MarkdownContentConverter";
import {IBlockPredicates} from "../../../../web/js/notes/store/IBlockPredicates";
import {ColorStr} from "../../../../web/js/ui/colors/ColorSelectorBox";
import {DateTimeTableCell} from "../DateTimeTableCell";
import {usePersistenceLayerContext} from "../persistence_layer/PersistenceLayerApp";
import {calculateTextPreviewHeight} from "../annotation_repo/FixedHeightAnnotationPreview";
import {IRepoAnnotationContent, useBlocksAnnotationRepoStore} from "./BlocksAnnotationRepoStore";
import {observer} from "mobx-react-lite";
import {useBlocksAnnotationRepoTableContextMenu} from "./BlocksAnnotationRepoTable";
import {IMouseEvent} from "../doc_repo/MUIContextMenu2";
import {BlockTextContentUtils} from "../../../../web/js/notes/NoteUtils";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";

const MAX_IMG_HEIGHT = 300;

export const useFixedHeightBlockAnnotationCalculator = () => {
    const theme = useTheme();

    const margin = theme.spacing(3);

    return React.useCallback((block: IBlock<IRepoAnnotationContent>): number => {
        const content = block.content

        if (content.type === AnnotationContentType.AREA_HIGHLIGHT) {
            const { value } = content;

            if (! value.image) {
                return MAX_IMG_HEIGHT;
            }

            return Math.min(value.image.height || Infinity, MAX_IMG_HEIGHT) + margin;
        } else {
            const text = BlockTextContentUtils.getTextContentMarkdown(content);

            return calculateTextPreviewHeight(text).height + margin;
        }
    }, [margin]);
};

interface IHighlightPreviewParentProps {
    readonly block: IBlock<IRepoAnnotationContent>; 
}

interface IUseHighlightPreviewParentStylesProps {
    readonly color?: ColorStr;
}

const useHighlightPreviewParentStyles = makeStyles<Theme, IUseHighlightPreviewParentStylesProps> (() =>
    createStyles({
        root: ({ color }) => ({
            borderLeftColor: color || 'transparent',
            borderLeftWidth: '4px',
            borderLeftStyle: 'solid',
            paddingLeft: '5px',
        }),
    }),
);

export const HighlightPreviewParent: React.FC<IHighlightPreviewParentProps> = ({ children, block }) => {
    const color = React.useMemo(() => {
        if (IBlockPredicates.isAnnotationHighlightBlock(block)) {
            return block.content.value.color;
        }

        return undefined;
    }, [block]);

    const classes = useHighlightPreviewParentStyles({ color });

    return <div className={classes.root} children={children} />;
};


interface ITextHighlightPreviewProps {
    content: ITextHighlightAnnotationContent | IFlashcardAnnotationContent | IMarkdownContent;
}

export const TextHighlightPreview: React.FC<ITextHighlightPreviewProps> = ({ content }) => {
    const markdown = React.useMemo(() => BlockTextContentUtils.getTextContentMarkdown(content), [content]);
    const html = React.useMemo(() =>
        markdown.length ? MarkdownContentConverter.toHTML(markdown) : "no text", [markdown]);

    const { height } = calculateTextPreviewHeight(markdown || '');

    return <div style={{ overflow: 'hidden', height, maxWidth: '100%', wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: html }} />;
};


interface IAreaHighlightPreviewProps {
    content: IAreaHighlightAnnotationContent;
}

export const AreaHighlightPreview: React.FC<IAreaHighlightPreviewProps> = ({ content }) => {
    const { value: areaHighlight } = content;
    const { persistenceLayerProvider } = usePersistenceLayerContext();

    const image = React.useMemo(() => {
        if (! areaHighlight.image) {
            return undefined;
        }

        const resolver = DocFileResolvers.createForPersistenceLayer(persistenceLayerProvider);
        return Images.toImg(resolver, areaHighlight.image);
    }, [persistenceLayerProvider, areaHighlight]);

    if (! image) {
        return <div>No image</div>;
    }

    const height = Math.min(image.height, MAX_IMG_HEIGHT);

    return (
        <Box py={1} style={{ height }} display="flex" alignItems="flex-start" justifyContent="center">
            <img style={{ maxHeight: '100%', maxWidth: '100%' }} src={image.src} />
        </Box>
    );
};



interface IHighlightPreviewProps {
    block: IBlock<IRepoAnnotationContent>;
}

export const HighlightPreview: React.FC<IHighlightPreviewProps> = ({ block }) => {
    const content = block.content;

    if (content.type === AnnotationContentType.AREA_HIGHLIGHT) {
        return <AreaHighlightPreview content={content} />
    } else {
        return <TextHighlightPreview content={content} />
    }
};

interface IBlocksAnnotationRepoTableRowProps {
    readonly viewIndex: number;
    readonly rowSelected: boolean;
    readonly block: IBlock<IRepoAnnotationContent>;
}

export const BlocksAnnotationRepoTableRow: React.FC<IBlocksAnnotationRepoTableRowProps> = React.memo(observer(function BlocksAnnotationRepoTableRow(props) {
    const { block } = props;
    const theme = useTheme();
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();


    const onClick = React.useCallback((event: React.MouseEvent) => {
        blocksAnnotationRepoStore.selectItem(block.id, event, 'click');
    }, [blocksAnnotationRepoStore, block.id]);

    const onContextMenu = React.useCallback((event: IMouseEvent) => {
        blocksAnnotationRepoStore.selectItem(block.id, event, 'context');
    }, [blocksAnnotationRepoStore, block.id]);

    const contextMenuCallbacks = useBlocksAnnotationRepoTableContextMenu({ onContextMenu });

    return (
        <TableRow role="checkbox"
                  onClick={onClick}
                  selected={blocksAnnotationRepoStore.isSelected(block.id)}
                  style={{ userSelect: 'none' }}
                  draggable
                  hover
                  {...contextMenuCallbacks}>
            <TableCell padding="checkbox">
                <Box my={1}>
                    <HighlightPreviewParent block={block}>
                        <Box mt={1}>
                            <HighlightPreview block={block} />

                            <DateTimeTableCell
                                datetime={block.updated || block.created}
                                style={{ color: theme.palette.text.secondary }}/>
                        </Box>
                    </HighlightPreviewParent>
                </Box>
            </TableCell>
        </TableRow>
    );
}));