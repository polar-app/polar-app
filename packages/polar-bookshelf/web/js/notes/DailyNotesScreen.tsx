import React from "react";
import {Box, createStyles, makeStyles, Typography} from "@material-ui/core";
import {useStateRef} from "../hooks/ReactHooks";
import {useBlocksStore} from "./store/BlocksStore";
import {Block as BlockClass} from "./store/Block";
import {DateContent} from "./content/DateContent";
import {BlockPredicates} from "./store/BlockPredicates";
import {DateContents} from "./content/DateContents";
import {useInView} from "react-intersection-observer";
import {NotePaper} from "./NotePaper";
import {Helmet} from "react-helmet";
import {BlocksTreeProvider} from "./BlocksTree";
import {Block} from "./Block";
import {NotesInbound} from "./NotesInbound";
import {NotesInnerContainer} from "./NotesContainer";
import {focusFirstChild, useNamedBlocks} from "./NoteUtils";

const DAILY_NOTES_CHUNK_SIZE = 3;

const useStyles = makeStyles((theme) =>
    createStyles({
        faded: {
            color: theme.palette.text.hint,
        }
    }),
);

export const DailyNotesScreen: React.FC = () => {
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
            <NotesInnerContainer>
                <NotePaper ref={rootRef}>
                    {visibleNotes.map(({ id }) => (
                        <div key={id} className="NoteTree">
                            <BlocksTreeProvider root={id} autoExpandRoot>
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
                    {! hasMore && 
                        <Box display="flex" m={2} justifyContent="center">
                            <Typography variant="h6" className={classes.faded}>
                                You've reached the end!
                            </Typography>
                        </Box>
                    }
                </NotePaper>
            </NotesInnerContainer>
        </>
    );
};
