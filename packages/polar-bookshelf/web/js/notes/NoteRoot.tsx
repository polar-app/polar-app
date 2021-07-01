import React from "react";
import {MUIBrowserLinkStyle} from "../mui/MUIBrowserLinkStyle";
import {NotesInbound} from "./NotesInbound";
import {Block} from "./Block";
import {NoteStyle} from "./NoteStyle";
import {BlockIDStr, useBlocksStore} from "./store/BlocksStore";
import {observer} from "mobx-react-lite"
import {NoteSelectionHandler} from "./NoteSelectionHandler";
import {ActionMenuPopup} from "../mui/action_menu/ActionMenuPopup";
import {ActionMenuStoreProvider} from "../mui/action_menu/ActionStore";
import LinearProgress from "@material-ui/core/LinearProgress";
import {NotesToolbar} from "./NotesToolbar";
import {Block as BlockClass} from "./store/Block";
import {BlockTitle} from "./BlockTitle";
import {BlocksTreeProvider} from "./BlocksTree";
import {useTheme} from "@material-ui/core";
import {BlockPredicates} from "./store/BlockPredicates";
import {useLocation, useParams} from "react-router";

interface INoteRootRendererProps {
    readonly block: BlockClass;
}

interface INoteRootProps {
    readonly target: BlockIDStr;
}

interface INotePaneProps {
    width: number;
    id: BlockIDStr;
    pos: number;
    active: boolean;
}

export const NotePane: React.FC<INotePaneProps> = ({ width, id, pos, active }) => {
    const theme = useTheme();
    const blocksStore = useBlocksStore();
    const block = blocksStore.getBlock(id);

    if (! block) {
        return null;
    }

    return (
        <div style={{
            maxHeight: '100%',
            minWidth: width,
            flex: `1 0 ${width}px`,
            overflowY: 'auto',
            position: 'sticky',
            left: pos * 40,
            background: theme.palette.background.default,
            zIndex: pos,
            boxShadow: theme.shadows[16],
            padding: theme.spacing(2)
        }}>
            <BlocksTreeProvider root={id}>
                <Block parent={undefined} id={id}/>

                <NotesInbound id={id}/>

            </BlocksTreeProvider>
            {! active &&
                <div style={{ padding: '16px 0', textTransform: 'capitalize', writingMode: 'vertical-lr', position: 'absolute', left: 0, top: 0, height: '100%', width: 40, fontSize: 20, display: 'flex', alignItems: 'center', background: theme.palette.background.default }}>
                    {BlockPredicates.isTextBlock(block) ? block.content.data : ''}
                </div>
            }
        </div>
    );
};

export const NoteRootRenderer: React.FC<INoteRootRendererProps> = ({ block }) => {
    const blocksStore = useBlocksStore();
    const id = block.id;
    const params = useParams();

    React.useEffect(() => {
        const activeBlock = blocksStore.getActiveBlockForNote(id);
        if (activeBlock) {
            blocksStore.setActiveWithPosition(activeBlock.id, activeBlock.pos || 'start');
        } else {
            blocksStore.setActiveWithPosition(id, 'end');
        }
    }, [id, blocksStore]);

    const searchParams = new URLSearchParams(location.search);
    console.log('debug', params, useLocation());
    const panesStr = searchParams.get('panes');
    const panes = panesStr ? panesStr.split(',') : [];
    const ref = React.useRef<HTMLDivElement>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [widthPerPane, setWidthPerPane] = React.useState(0);
    React.useEffect(() => {
        const elem = scrollRef.current;
        if (elem) {
            const {width} = elem.getBoundingClientRect();
            console.log(width);
            setWidthPerPane(Math.max(width / (panes.length + 1), 700));
        }
    }, [panes.length]);

    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const elem = scrollRef.current;
        if (! elem) {
            return undefined;
        }
        const handleScroll = () => {
            const activePos = Math.floor(elem.scrollLeft / (widthPerPane - 40));
            setCurrent(activePos);
        };
        elem.addEventListener('scroll', handleScroll, {passive: true});
        return () => elem.removeEventListener('scroll', handleScroll);
    }, [widthPerPane]);

    return (
        <ActionMenuStoreProvider>
            <NoteSelectionHandler style={{height: '100%'}}>
                <NoteStyle>
                    <MUIBrowserLinkStyle style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <NotesToolbar />
                        <BlockTitle id={id}/>
                        <div style={{ height: '100%', width: '100%', overflowX: 'auto', display: 'flex' }} ref={scrollRef}>
                            <div style={{ flex: 1, display: 'flex', width: widthPerPane * (panes.length + 1), height: '100%', position: 'relative'}} ref={ref}>
                                    
                                <NotePane id={id} width={widthPerPane} pos={0} active={current === 0} />
                                {panes.map((id, i) => <NotePane key={id} pos={i + 1} id={id} width={widthPerPane} active={current <= i + 1} />)}
                            </div>
                        </div>
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
