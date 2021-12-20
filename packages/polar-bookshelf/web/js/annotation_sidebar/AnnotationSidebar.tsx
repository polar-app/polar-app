import React from "react";
import {useBlocksStore} from "../notes/store/BlocksStore";
import {NoteProviders} from "../notes/NoteProviders";
import {BlocksTreeProvider} from "../notes/BlocksTree";
import {AppBar, Box, createStyles, Divider, Fab, IconButton, makeStyles, Toolbar, Typography, useScrollTrigger, Zoom} from "@material-ui/core";
import {useDocViewerStore} from "../../../apps/doc/src/DocViewerStore";
import {useHighlightBlockIDs} from "../notes/HighlightBlocksHooks";
import {HighlightBlock} from "../notes/HighlightBlock";
import {NoAnnotations} from "./NoAnnotations";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {observer} from "mobx-react-lite";
import {useStateRef} from "../hooks/ReactHooks";
import {BlockPredicates} from "../notes/store/BlockPredicates";
import clsx from "clsx";
import {BlockTextContentUtils} from "../notes/NoteUtils";
import {DeviceRouters} from "../ui/DeviceRouter";

const AnnotationSidebarToolbar: React.FC = () => {
    return (
        <AppBar color="inherit" position="static">
            <Toolbar>
                <Typography>ANNOTATIONS</Typography>
            </Toolbar>
        </AppBar>
    );
};

interface IAnnotationSidebarHeadingProps {
    readonly docBlockID: BlockIDStr;
    readonly scrollParent: HTMLDivElement | null;
    readonly onClose?: () => void;
}

const useAnnotationSidebarHeadingStyles = makeStyles((theme) =>
    createStyles({
        backButton: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,

            '&.floating': {
                position: 'fixed',
                zIndex: 10,
                top: theme.spacing(1.5),
                right: theme.spacing(1.5),
            }
        },
    })
);

const AnnotationSidebarHeading: React.FC<IAnnotationSidebarHeadingProps> = observer((props) => {
    const { docBlockID, onClose, scrollParent } = props;
    const blocksStore = useBlocksStore();
    const classes = useAnnotationSidebarHeadingStyles();

    const documentBlock = blocksStore.getBlock(docBlockID);

    const trigger = useScrollTrigger({ target: scrollParent || undefined });
    const [floatingBackShown, setFloatingBackShown, floatingBackShownRef] = useStateRef(false);

    React.useEffect(() => {
        if (! scrollParent) {
            return;
        }

        const SCROLL_THRESHOLD = 150;

        const handleScroll = () => {
            const { scrollTop } = scrollParent;

            if (scrollTop < SCROLL_THRESHOLD && floatingBackShownRef.current) {
                setFloatingBackShown(false);
            } else if (scrollTop >= SCROLL_THRESHOLD && ! floatingBackShownRef.current) {
                setFloatingBackShown(true);
            }
        };

        scrollParent.addEventListener('scroll', handleScroll, { passive: true });

        return () => scrollParent.removeEventListener('scroll', handleScroll);
    }, [scrollParent, floatingBackShownRef, setFloatingBackShown]);

    if (! documentBlock || ! BlockPredicates.isDocumentBlock(documentBlock)) {
        return null;
    }

    const title = BlockTextContentUtils.getTextContentMarkdown(documentBlock.content);

    return (
        <Box ml={5.5}
             mr={2.25}
             mt={2.75}
             display="flex"
             alignItems="center"
             justifyContent="space-between">

            <Typography variant="h6" style={{ fontWeight: 'bold' }}>{title}</Typography>

            <Zoom appear={false} in={! trigger && floatingBackShown}>
                <Fab onClick={onClose}
                     className={clsx(classes.backButton, 'floating')}>
                    <ChevronRightIcon />
                </Fab>
            </Zoom>

            <IconButton onClick={onClose}
                        className={classes.backButton}>
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
});

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default,
            flex: 1,
            height: '100%',
        },
        info: {
            margin: 10,
            textAlign: 'center',
        },
        titleDivider: {
            margin: `${theme.spacing(2)}px ${theme.spacing(1.5)}px`,
        },
        blocksTree: {
            height: '100%',
            overflowY: 'auto',
        },
        inner: {
            padding: theme.spacing(1.5),
        },
    }),
);

interface IAnnotationSidebarRendererProps {
    readonly docFingerprint: string;
    readonly onClose?: () => void;
};

const AnnotationSidebarRenderer: React.FC<IAnnotationSidebarRendererProps> = React.memo((props) => {
    const { docFingerprint, onClose } = props;
    const classes = useStyles();

    const blocksStore = useBlocksStore();

    const documentBlock = blocksStore.getBlock(blocksStore.indexByDocumentID[docFingerprint]);

    const annotationBlockIDs = useHighlightBlockIDs({ docID: docFingerprint });
    const [scrollParent, setScrollParent] = React.useState<HTMLDivElement | null>(null);

    if (! documentBlock) {
        return <h2 className={classes.info}>No document note was found for this document.</h2>
    }

    return (
        <div className={classes.root}>
            <NoteProviders>
                <BlocksTreeProvider root={documentBlock.id}
                                    className={classes.blocksTree}
                                    ref={setScrollParent}
                                    autoExpandRoot>

                    <DeviceRouters.Handheld>
                        <>
                            <AnnotationSidebarToolbar />
                            <AnnotationSidebarHeading scrollParent={scrollParent}
                                                      docBlockID={documentBlock.id}
                                                      onClose={onClose}/>
                            <Divider className={classes.titleDivider} />
                        </>
                    </DeviceRouters.Handheld>

                    <Box className={classes.inner}>
                        {
                            annotationBlockIDs.length
                                ? annotationBlockIDs.map(id => <HighlightBlock key={id} id={id} parent={documentBlock.id} />)
                                : <NoAnnotations />
                        }
                    </Box>

                </BlocksTreeProvider>
            </NoteProviders>
        </div>
    );
});

interface IAnnotationSidebarProps {
    readonly onClose?: () => void;
}

export const AnnotationSidebar: React.FC<IAnnotationSidebarProps> = (props) => {
    const { onClose } = props;
    const { docMeta } = useDocViewerStore(['docMeta']);

    if (! docMeta) {
        return null;
    }

    return <AnnotationSidebarRenderer onClose={onClose} docFingerprint={docMeta.docInfo.fingerprint} />
};
