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
import {NotesInnerContainer} from "./NotesContainer";
import {focusFirstChild} from "./NoteUtils";
import {NotesToolbar} from "./NotesToolbar";

interface INoteRootParams {
    id: BlockIDStr;
};

interface ISingleNoteScreenProps extends RouteComponentProps<INoteRootParams> {}

export const SingleNoteScreen: React.FC<ISingleNoteScreenProps> = (props) => {
    const { match: { params } } = props;
    const target = React.useMemo(() => decodeURIComponent(params.id), [params.id]);
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

    if (! root) {
        return (
            <Box mt={5} display="flex" justifyContent="center">
                <Typography variant="h5">Note {target} was not found.</Typography>
            </Box>
        );
    }

    const rootID = root.id;

    return (
        <>
            <NotesToolbar />
            <BlockTitle id={rootID}/>
            <NotesInnerContainer>
                <NotePaper>
                    <BlocksTreeProvider root={rootID} autoExpandRoot>
                        <Block parent={undefined}
                               id={rootID}
                               isHeader
                               alwaysExpanded
                               hasGutter
                               noBullet />
                        <div style={{ marginTop: 64 }}>
                            <NotesInbound id={rootID} />
                        </div>
                    </BlocksTreeProvider>
                </NotePaper>
            </NotesInnerContainer>
        </>
    );
};
