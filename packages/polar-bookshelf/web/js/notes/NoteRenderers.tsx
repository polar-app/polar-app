import {Box, createStyles, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import {useBlocksStore} from "./store/BlocksStore";
import {Block as BlockClass} from "./store/Block";
import {DateContent} from "./content/DateContent";
import {BlockPredicates} from "./store/BlockPredicates";
import {autorun} from "mobx";
import {useInView} from "react-intersection-observer";
import {Helmet} from "react-helmet";
import {NotePaper} from "./NotePaper";
import {BlocksTreeProvider} from "./BlocksTree";
import {NotesInbound} from "./NotesInbound";
import {Block} from "./Block";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockTitle} from "./BlockTitle";
import {useStateRef} from "../hooks/ReactHooks";
import equal from "deep-equal";
import {NameContent} from "./content/NameContent";
import {DateContents} from "./content/DateContents";
import {IBlocksStore} from "./store/IBlocksStore";

const DAILY_NOTES_CHUNK_SIZE = 3;

const useStyles = makeStyles((theme) =>
    createStyles({
        noteContentOuter: {
            width: '100%',
            flex: '1 1 0',
            minHeight: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 26px',
        },
        faded: {
            color: theme.palette.text.hint,
        }
    }),
);

type NamedBlock = BlockClass<NameContent | DateContent>;

const focusFirstChild = (blocksStore: IBlocksStore, id: BlockIDStr) => {
    const root = blocksStore.getBlock(id);
    if (root) {
        const firstChildID = root.itemsAsArray[0] || blocksStore.createNewBlock(root.id, { asChild: true }).id;
        blocksStore.setActiveWithPosition(firstChildID, 'start');
    }
};

export const useNamedBlocks = () => {
    const blocksStore = useBlocksStore();
    const [namedBlocks, setNamedBlocks] = React.useState<ReadonlyArray<NamedBlock>>([]);
    const prevNamedBlocksIDsRef = React.useRef<BlockIDStr[] | null>(null);

    React.useEffect(() => {
        const disposer = autorun(() => {
            const namedBlocksIDs = Object.values(blocksStore.indexByName);
            if (! equal(prevNamedBlocksIDsRef.current, namedBlocksIDs)) {
                const namedBlocks = blocksStore.idsToBlocks(namedBlocksIDs) as ReadonlyArray<NamedBlock>;
                setNamedBlocks(namedBlocks);
                prevNamedBlocksIDsRef.current = namedBlocksIDs;
            }
        });

        return () => disposer();
    }, [blocksStore]);

    return namedBlocks;
};

export const DailyNotesRenderer: React.FC = () => {
    const classes = useStyles();
    const [threshold, setThreshold, thresholdRef] = useStateRef(0);
    const [dailyNotes, setDailyNotes, dailyNotesRef] = useStateRef<ReadonlyArray<BlockClass<DateContent>>>([]);
    const namedBlocks = useNamedBlocks();
    const blocksStore = useBlocksStore();

    React.useEffect(() => {
        const dateBlocks = namedBlocks.filter(BlockPredicates.isDateBlock)
        const descendingDateSorter = (
            a: Readonly<BlockClass<DateContent>>,
            b: Readonly<BlockClass<DateContent>>
        ) => (new Date(b.content.data)).getTime() - (new Date(a.content.data)).getTime();

        const notes = [...dateBlocks].sort(descendingDateSorter);
        setDailyNotes(notes);
    }, [namedBlocks, setDailyNotes]);
    
    React.useEffect(() => {
        // Add a note for today if it doesn't exist & focus the first child
        const dateContent = DateContents.create();
        const getTodaysBlockID = () => {
            const todaysBlock = blocksStore.getBlockByTarget(dateContent.data);
            if (todaysBlock) {
                return todaysBlock.id;
            }
            return blocksStore.createNewNamedBlock(dateContent.data, {type: 'date'});
        };
        const todaysBlockID = getTodaysBlockID();
        focusFirstChild(blocksStore, todaysBlockID);
    }, [blocksStore]);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const visibleNotes = React.useMemo(() => dailyNotes.slice(0, threshold), [dailyNotes, threshold]);

    const hasMore = threshold === visibleNotes.length;
    const {ref, inView} = useInView({
        root: rootRef.current,
        threshold: 0,
        rootMargin: '50px 0px',
        initialInView: true,
        skip: !hasMore
    });

    React.useEffect(() => {
        const threshold = thresholdRef.current;
        if (inView) {
            setThreshold(threshold + DAILY_NOTES_CHUNK_SIZE);
        }
    }, [inView, dailyNotesRef, thresholdRef, setThreshold]);


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
                    {hasMore &&
                        <Box display="flex" m={2} justifyContent="flex-end">
                            <Typography
                                variant="h6"
                                className={classes.faded}
                                onClick={() => setThreshold(threshold + DAILY_NOTES_CHUNK_SIZE)}
                                style={{ cursor: 'pointer' }}
                                ref={ref}
                            >
                                VIEW MORE
                            </Typography>
                        </Box>
                    }
                    {!hasMore && 
                        <Box display="flex" m={2} justifyContent="center">
                            <Typography variant="h6" className={classes.faded}>
                                You've reached the end!
                            </Typography>
                        </Box>
                    }
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
