import {Box, LinearProgress, Typography} from "@material-ui/core";
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
import {NotesContainer} from "./NotesContainer";
import {NoteProviders} from "./NoteProviders";
import {observer} from "mobx-react-lite";
import {autorun} from "mobx";

interface INoteRootParams {
    readonly id: BlockIDStr;
};

interface ISingleNoteScreenProps extends RouteComponentProps<INoteRootParams> {}

export const SingleNoteScreen: React.FC<ISingleNoteScreenProps> = observer((props) => {
    const { match: { params } } = props;
    const target = React.useMemo(() => decodeURIComponent(params.id), [params.id]);
    const blocksStore = useBlocksStore();

    if (! blocksStore.hasSnapshot) {
        return <LinearProgress />;
    }

    return (
        <NotesContainer>
            <NoteProviders>
                <NotesToolbar />
                <BlockTitle target={target} />
                <NoteStack target={target}>
                    <NoteRenderer target={target} />
                </NoteStack>
            </NoteProviders>
        </NotesContainer>
    );
});

interface INoteRendererProps {
    readonly target: BlockTargetStr;
}

export const NoteRenderer: React.FC<INoteRendererProps> = React.memo((props) => {
    const { target } = props;

    const blocksStore = useBlocksStore();

    const [rootID, setRootID] = React.useState<BlockIDStr | undefined>(undefined);

    React.useEffect(() => {
        return autorun(() => {
            const root = blocksStore.getBlockByTarget(target);

            if (root && root.id !== rootID) {
                setRootID(root.id);
            }
        });
    }, [target, rootID, setRootID, blocksStore]);

    React.useEffect(() => {
        if (! rootID) {
            return;
        }

        const activeBlock = blocksStore.getActiveBlockForNote(rootID);

        if (activeBlock) {
            blocksStore.setActiveWithPosition(activeBlock.id, activeBlock.pos || 'start');
        } else {
            focusFirstChild(blocksStore, rootID);
        }
    }, [rootID, blocksStore]);


    return (
        <NotePaper>
            {rootID
                ? (
                    <BlocksTreeProvider root={rootID} autoExpandRoot>
                        <Block id={rootID}
                               parent={undefined}
                               isHeader
                               alwaysExpanded
                               hasGutter
                               noBullet />
                        <div style={{ marginTop: 64 }}>
                            <NotesInbound id={rootID} />
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
    readonly target: BlockTargetStr;
}

export const NoteNotFound: React.FC<INoteNotFoundProps> = (props) => {
    const { target } = props;

    return (
        <Box mt={5} display="flex" justifyContent="center">
            <Typography variant="h5">Note {target} was not found.</Typography>
        </Box>
    );
};
