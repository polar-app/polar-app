import React from "react";
import {Box, createStyles, Divider, makeStyles, Typography} from "@material-ui/core";
import {useStateRef} from "../hooks/ReactHooks";
import {INamedBlockEntry, useBlocksStore} from "./store/BlocksStore";
import {DateContent} from "./content/DateContent";
import {DateContents} from "./content/DateContents";
import {useInView} from "react-intersection-observer";
import {NotePaper} from "./NotePaper";
import {Helmet} from "react-helmet";
import {BlocksTreeProvider} from "./BlocksTree";
import {Block} from "./Block";
import {NotesInbound} from "./NotesInbound";
import {focusFirstChild} from "./NoteUtils";
import {NotesToolbar} from "./NotesToolbar";
import {NoteStack} from "./stacks/NoteStack";
import {RoutePathNames} from "../apps/repository/RoutePathNames";
import {observer} from "mobx-react-lite";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import moment from "moment";
import {useMonthDay} from "../icons/CalendarMonthDayIcon";

const DAILY_NOTES_CHUNK_SIZE = 3;

const useStyles = makeStyles((theme) =>
    createStyles({
        footerHeading: {
            color: theme.palette.text.hint,
            fontSize: '1rem',
        }
    }),
);

export const DailyNotesScreen: React.FC = observer(() => {
    const classes = useStyles();
    const [threshold, setThreshold, thresholdRef] = useStateRef(0);
    const [dailyNoteIDs, setDailyNoteIDs] = useStateRef<ReadonlyArray<BlockIDStr>>([]);
    const blocksStore = useBlocksStore();
    const monthDay = useMonthDay();

    React.useEffect(() => {
        const dateBlocks = blocksStore
            .namedBlockEntries
            .filter(({ type }) => type === 'date');

        const descendingDateSorter = (
            a: Readonly<INamedBlockEntry>,
            b: Readonly<INamedBlockEntry>,
        ) => moment(b.label).diff(moment(a.label), 'seconds');

        const notes = [...dateBlocks].sort(descendingDateSorter);
        setDailyNoteIDs(notes.map(({ id }) => id));
    }, [blocksStore.namedBlockEntries, setDailyNoteIDs]);

    React.useEffect(() => {
        // Add a note for today if it doesn't exist & focus the first child
        const dateContent = DateContents.create();
        const getTodaysBlockID = () => {
            const todaysBlock = blocksStore.getBlockByTarget(dateContent.data);
            if (todaysBlock) {
                return todaysBlock.id;
            }
            const content = new DateContent({ type: 'date', data: dateContent.data, format: 'YYYY-MM-DD', links: [] });
            return blocksStore.createNewNamedBlock({ content });
        };
        const todaysBlockID = getTodaysBlockID();
        focusFirstChild(blocksStore, todaysBlockID);
    }, [blocksStore, monthDay]);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const visibleNotes = React.useMemo(() => dailyNoteIDs.slice(0, threshold), [dailyNoteIDs, threshold]);

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
    }, [inView, setThreshold, thresholdRef]);


    return (
        <>
            <Helmet>
                <title>Polar: Daily Notes</title>
            </Helmet>
            <NotesToolbar />
            <NoteStack target={RoutePathNames.DAILY} rootBannerLabel="Daily notes">
                <NotePaper ref={rootRef}>
                    {visibleNotes.map((id, i) => (
                        <div key={id} className="NoteTree">
                            {i !== 0 && <Divider style={{ margin: '10px 14px' }} />}
                            <BlocksTreeProvider root={id} autoExpandRoot>
                                <Block parent={undefined}
                                       id={id}
                                       isHeader
                                       alwaysExpanded
                                       noBullet
                                       hasGutter />
                                <NotesInbound id={id} />
                            </BlocksTreeProvider>
                        </div>
                    ))}
                    {hasMore &&
                        <Box display="flex" m={2} justifyContent="flex-end">
                            <Typography
                                variant="h6"
                                className={classes.footerHeading}
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
                            <Typography variant="h6" className={classes.footerHeading}>
                                You've reached the end!
                            </Typography>
                        </Box>
                    }
                </NotePaper>
            </NoteStack>
        </>
    );
});

