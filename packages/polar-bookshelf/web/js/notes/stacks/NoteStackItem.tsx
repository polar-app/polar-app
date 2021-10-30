import {Theme, createStyles, makeStyles} from "@material-ui/core";
import {observer} from "mobx-react-lite";
import React from "react";
import {BlockTargetStr} from "../NoteLinkLoader";
import {BlockTextContentUtils} from "../NoteUtils";
import {NoteRenderer} from "../SingleNoteScreen";
import {BlockPredicates} from "../store/BlockPredicates";
import {useBlocksStore} from "../store/BlocksStore";
import {NoteStackProvider} from "./StackProvider";

export const STACK_ITEM_WIDTH = 600;
export const STACK_ITEM_BANNER_WIDTH = 50;
export const STACK_ITEM_SPACING = 18;

interface INoteStackItemStylesOpts {
    index: number;
}

export const useNoteStackItemWrapperStyles = makeStyles<Theme, INoteStackItemStylesOpts>((theme) =>
    createStyles({
        root: ({ index }) => ({
            marginLeft: index === 0 ? 0 : STACK_ITEM_SPACING,
            width: STACK_ITEM_WIDTH,
            minWidth: STACK_ITEM_WIDTH,
            position: 'sticky',
            boxShadow: theme.shadows[5],
            left: `${(index + 1) * STACK_ITEM_BANNER_WIDTH}px`,
        }),
        banner: {
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10,
            width: STACK_ITEM_BANNER_WIDTH,
            lineHeight: `${STACK_ITEM_BANNER_WIDTH}px`,
            padding: '22px 0',
            minHeight: 200,
            background: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(103,84,214,1) 50%)',
        },
        bannerText: {
            writingMode: 'vertical-lr',
            fontWeight: 'bold',
            height: '70%',
            fontSize: theme.typography.pxToRem(24),
        },
    })
);

interface INoteStackItemProps {
    readonly target: BlockTargetStr;
}

export const NoteStackItem: React.FC<INoteStackItemProps> = React.memo((props) => {
    const { target } = props;

    return (
        <NoteStackProvider target={target}>
            <NoteRenderer target={target} />
        </NoteStackProvider>
    );
});

interface INoteStackItemWrapperProps {
    readonly index: number;
    readonly target?: BlockTargetStr;
    readonly bannerLabel?: string;
    readonly hidden: boolean;
}

export const NoteStackItemWrapper: React.FC<INoteStackItemWrapperProps> = observer((props) => {
    const { index, target, bannerLabel, hidden, children } = props;
    const blocksStore = useBlocksStore();
    const classes = useNoteStackItemWrapperStyles({ index });
    const rootBlock = React.useMemo(() =>
        target && blocksStore.getBlockByTarget(target), [target, blocksStore]);

    const noteTitle = React.useMemo(() => {
        if (bannerLabel) {
            return bannerLabel;
        }

        if (rootBlock) {
            return BlockPredicates.isTextBlock(rootBlock)
                ? BlockTextContentUtils.getTextContentMarkdown(rootBlock.content)
                : '';
        }

        return "Untitled";
    }, [rootBlock, bannerLabel]);

    return (
        <div className={classes.root} style={{ zIndex: index + 1 }}>
            {hidden && (
                <div className={classes.banner}>
                    <div className={classes.bannerText}>
                        {noteTitle}
                    </div>
                </div> 
            )}
            {children}
        </div>
    );
});
