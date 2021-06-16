import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import {Block} from "./Block";
import {NoteStyle} from "./NoteStyle";
import {BlockIDStr} from "./store/BlocksStore";
import {useBlocksStore} from "./store/BlocksStore";
import {observer} from "mobx-react-lite"
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import {ActionMenuStoreProvider} from "../mui/action_menu/ActionStore";
import LinearProgress from "@material-ui/core/LinearProgress";
import {NotesToolbar} from "./NotesToolbar";
import {Block as BlockClass} from "./store/Block";

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
        blocksStore.setRoot(id);
        blocksStore.setActiveWithPosition(id, 'end');
    }, [id, blocksStore]);

    return (
        <ActionMenuStoreProvider>
            <NoteSelectionHandler style={{flexGrow: 1}}>
                <NoteStyle>
                    <MUIBrowserLinkStyle style={{flexGrow: 1}}>
                        
                        <NotesToolbar/>

                        <Block parent={undefined} id={id}/>

                        <NotesInbound id={id}/>

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
