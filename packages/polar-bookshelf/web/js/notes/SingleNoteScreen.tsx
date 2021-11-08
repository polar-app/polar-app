import {Box, Typography} from "@material-ui/core";
import {RouteComponentProps} from "react-router-dom";
import React from "react";
import {useBlocksStore} from "./store/BlocksStore";
import {NotePaper} from "./NotePaper";
import {BlocksTreeProvider} from "./BlocksTree";
import {NotesInbound} from "./NotesInbound";
import {Block} from "./Block";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockTitle} from "./BlockTitle";
import {focusFirstChild} from "./NoteUtils";
import {NotesToolbar} from "./NotesToolbar";
import {BlockTargetStr} from "./NoteLinkLoader";
import {NoteStack} from "./stacks/NoteStack";

interface INoteRootParams {
    id: BlockIDStr;
};

interface ISingleNoteScreenProps extends RouteComponentProps<INoteRootParams> {}

export const SingleNoteScreen: React.FC<ISingleNoteScreenProps> = (props) => {
    const { match: { params } } = props;
    const target = React.useMemo(() => decodeURIComponent(params.id), [params.id]);
    const blocksStore = useBlocksStore();
    const root = React.useMemo(() => blocksStore.getBlockByTarget(target), [target, blocksStore]);

    if (! root) {
        return <NoteNotFound target={target} />;
    }

    return (
        <>
            <NotesToolbar />
            <BlockTitle id={root.id} />
            <NoteStack target={target}>
                <NoteRenderer target={target} />
            </NoteStack>
        </>
    );
};

interface INoteRendererProps {
    target: BlockTargetStr;
}

export const NoteRenderer: React.FC<INoteRendererProps> = React.memo((props) => {
    const { target } = props;

    const blocksStore = useBlocksStore();

    const root = React.useMemo(() => blocksStore.getBlockByTarget(target), [target, blocksStore]);

    React.useEffect(() => {
        if (! root) {
            return;
        }

        const activeBlock = blocksStore.getActiveBlockForNote(root.id);
        if (activeBlock) {
            blocksStore.setActiveWithPosition(activeBlock.id, activeBlock.pos || 'start');
        } else {
            focusFirstChild(blocksStore, root.id);
        }
    }, [root, blocksStore]);


    return (
        <NotePaper>
            {root 
                ? (
                    <BlocksTreeProvider root={root.id} autoExpandRoot>
                        <Block id={root.id}
                               parent={undefined}
                               isHeader
                               alwaysExpanded
                               hasGutter
                               noBullet />
                        <div style={{ marginTop: 64 }}>
                            <NotesInbound id={root.id} />
                        </div>
                    </BlocksTreeProvider>
                ) : (
                    <NoteNotFound target={target} />
                )
            }
        </NotePaper>
    );
});

interface INoteNotFoundProps {
    target: BlockTargetStr;
}

export const NoteNotFound: React.FC<INoteNotFoundProps> = (props) => {
    const { target } = props;

    return (
        <Box mt={5} display="flex" justifyContent="center">
            <Typography variant="h5">Note {target} was not found.</Typography>
        </Box>
    );
};
