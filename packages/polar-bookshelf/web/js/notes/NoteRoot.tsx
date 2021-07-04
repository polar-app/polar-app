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
import {createStyles, makeStyles} from "@material-ui/core";

interface INoteRootRendererProps {
    readonly block: BlockClass;
}

interface INoteRootProps {
    readonly target: BlockIDStr;
}

interface INotePaperProps {
    readonly id: BlockIDStr;
}

const useNotePaperStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 1024,
            height: '100%',
            overflowY: 'auto',
            borderRadius: 4,
            background: theme.palette.background.paper,
            flex: 1,
            padding: '13px 20px',
        },
    }),
);

const NotePaper: React.FC<INotePaperProps> = ({ id }) => {
    const classes = useNotePaperStyles();

    return (
        <div className={classes.root}>
            <Block parent={undefined} id={id} withHeader noExpand noBullet />

            <NotesInbound id={id} />
        </div>
    );
};

const useStyles = makeStyles(() =>
    createStyles({
        noteOuter: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            height: '100%',
        },
        noteContentOuter: {
            width: '100%',
            flex: '1 1 0',
            minHeight: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 26px',
        }
    }),
);

export const NoteRootRenderer: React.FC<INoteRootRendererProps> = ({ block }) => {
    const classes = useStyles();
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
        <NoteProviders>
            <BlocksTreeProvider root={id}>
                <MUIBrowserLinkStyle className={classes.noteOuter}>
                    <NotesToolbar />
                    <BlockTitle id={id}/>
                    <div className={classes.noteContentOuter}>
                        <NotePaper id={id} />
                    </div>

                </MUIBrowserLinkStyle>
                <ActionMenuPopup/>
            </BlocksTreeProvider>
        </NoteProviders>
    );
};

export const NoteProviders: React.FC = ({ children }) => (
    <ActionMenuStoreProvider>
        <NoteSelectionHandler style={{ height: '100%' }}>
            <NoteStyle>
                {children}
            </NoteStyle>
        </NoteSelectionHandler>
    </ActionMenuStoreProvider>
);


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
