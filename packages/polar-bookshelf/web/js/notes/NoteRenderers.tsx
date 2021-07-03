import {Box, createStyles, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import {useBlocksStore} from "./store/BlocksStore";
import {Block as BlockClass} from "./store/Block";
import {DateContent} from "./content/DateContent";
import {observer} from "mobx-react-lite";
import {BlockPredicates} from "./store/BlockPredicates";
import {reaction} from "mobx";
import {useInView} from "react-intersection-observer";
import {Helmet} from "react-helmet";
import {NotePaper} from "./NotePaper";
import {BlocksTreeProvider} from "./BlocksTree";
import {NotesInbound} from "./NotesInbound";
import {Block} from "./Block";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockTitle} from "./BlockTitle";
import {useStateRef} from "../hooks/ReactHooks";

const DAILY_NOTES_CHUNK_SIZE = 3;

const useStyles = makeStyles(() =>
    createStyles({
        noteContentOuter: {
            width: '100%',
            flex: '1 1 0',
            minHeight: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 26px',
        },
    }),
);

export const DailyNotesRenderer: React.FC = () => {
    const blocksStore = useBlocksStore();
    const classes = useStyles();
    const [threshold, setThreshold, thresholdRef] = useStateRef(0);
    const [dailyNotes, setDailyNotes] = React.useState<ReadonlyArray<BlockClass<DateContent>>>([]);

    React.useEffect(() => {
        const getDateBlocks = () => blocksStore
            .idsToBlocks(Object.values(blocksStore.indexByName))
            .filter(BlockPredicates.isDateBlock);

        const updateDailyNotes = (dateBlocks: ReadonlyArray<BlockClass<DateContent>>) => {
            const descendingDateSorter = (
                a: Readonly<BlockClass<DateContent>>,
                b: Readonly<BlockClass<DateContent>>
            ) => (new Date(b.content.data)).getTime() - (new Date(a.content.data)).getTime();

            const notes = [...dateBlocks].sort(descendingDateSorter);
            setDailyNotes(notes);
        };

        updateDailyNotes(getDateBlocks());
        const disposer = reaction(getDateBlocks, updateDailyNotes);

        return () => disposer();
    }, [blocksStore]);

    const visibleNotes = React.useMemo(() => dailyNotes.slice(0, threshold), [dailyNotes, threshold]);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const {ref, inView} = useInView({
        root: rootRef.current,
        threshold: 0,
        rootMargin: '50px 0px',
    });

    React.useEffect(() => {
        const threshold = thresholdRef.current;
        if (inView && threshold < dailyNotes.length) {
            setThreshold(threshold + DAILY_NOTES_CHUNK_SIZE);
        }
    }, [inView, dailyNotes, thresholdRef, setThreshold]);

    return (
        <>
            <Helmet>
                <title>Polar: Daily notes</title>
            </Helmet>
            <div className={classes.noteContentOuter}>
                <NotePaper ref={rootRef}>
                    {visibleNotes.map(({ id }) => (
                        <div key={id} className="NoteTree">
                            <BlocksTreeProvider root={id}>
                                <Block parent={undefined} id={id} withHeader noExpand noBullet />
                                <NotesInbound id={id} />
                            </BlocksTreeProvider>
                        </div>
                    ))}
                    <div ref={ref} />
                </NotePaper>
            </div>
        </>
    );
};


interface ISingleNoteRendererProps {
    readonly target: BlockIDStr;
}

export const SingleNoteRendrer: React.FC<ISingleNoteRendererProps> = ({ target }) => {
    const classes = useStyles();
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
            blocksStore.setActiveWithPosition(root.id, 'end');
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
            <BlockTitle id={rootID}/>
            <div className={classes.noteContentOuter}>
                <NotePaper>
                    <BlocksTreeProvider root={rootID}>
                        <Block parent={undefined} id={rootID} withHeader noExpand noBullet />
                        <NotesInbound id={rootID} />
                    </BlocksTreeProvider>
                </NotePaper>
            </div>
        </>
    );
};
