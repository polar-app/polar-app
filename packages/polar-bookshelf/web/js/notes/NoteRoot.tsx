import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import {Block} from "./Block";
import {NoteStyle} from "./NoteStyle";
import {useBlocksStore} from "./store/BlocksStore";
import {observer} from "mobx-react-lite"
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import {ActionMenuStoreProvider} from "../mui/action_menu/ActionStore";
import LinearProgress from "@material-ui/core/LinearProgress";
import {NotesToolbar} from "./NotesToolbar";
import {Block as BlockClass} from "./store/Block";
import {BlockTitle} from "./BlockTitle";
import {BlocksTreeProvider} from "./BlocksTree";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

interface INoteRootRendererProps {
    readonly block: BlockClass;
}

interface INoteRootProps {
    readonly target: BlockIDStr;
}

export const NoteRootRenderer: React.FC<INoteRootRendererProps> = ({ block }) => {
    const blocksStore = useBlocksStore();
    const id = block.id;

    React.useEffect(() => {
        const activeBlock = blocksStore.getActiveBlockForNote(id);
        if (activeBlock) {
            blocksStore.setActiveWithPosition(activeBlock.id, activeBlock.pos || 'start');
        } else {
            blocksStore.setActiveWithPosition(id, 'end');
        }
    }, [id, blocksStore]);

    return (
        <ActionMenuStoreProvider>
            <NoteSelectionHandler style={{flexGrow: 1}}>
                <NoteStyle>
                    <MUIBrowserLinkStyle style={{flexGrow: 1}}>
                        <BlocksTreeProvider root={id}>

                            <NotesToolbar/>
                            <BlockTitle id={id}/>
                            <Block parent={undefined} id={id}/>

                            <NotesInbound id={id}/>

                        </BlocksTreeProvider>
                    </MUIBrowserLinkStyle>
                    <ActionMenuPopup/>
                </NoteStyle>
            </NoteSelectionHandler>
        </ActionMenuStoreProvider>
    );

};


export const NoteRoot: React.FC<INoteRootProps> = observer(({ target }) => {
    const blocksStore = useBlocksStore();

    const block = blocksStore.getBlockByTarget(target);

    if (! blocksStore.hasSnapshot) {
        return (
            <LinearProgress />
        );
    }

    if (!block) {
        return <div>No note for: '{target}'</div>;
    }

    return <NoteRootRenderer block={block} />;
});
