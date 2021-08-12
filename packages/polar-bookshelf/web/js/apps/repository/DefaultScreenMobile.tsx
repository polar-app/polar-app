import {createStyles, makeStyles} from "@material-ui/styles";
import {useDocRepoStore} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import React from "react";
import {UserBarMobile} from "../../../../apps/repository/js/UserBarMobile";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {ThumbnailHolder} from "../../ui/ThumbnailHolder";
import AddIcon from '@material-ui/icons/Add';
import clsx from "clsx";
import {useNamedBlocks} from "../../notes/NoteUtils";
import moment from "moment";
import {useHistory} from "react-router";
import {useDocLoader} from "../main/DocLoaderHooks";
import {Either} from "../../util/Either";
import {BackendFileRefs} from "../../datastore/BackendFileRefs";
import {NamedBlock} from "../../notes/store/BlocksStore";
import {DocRepoMobile} from "../../../../apps/repository/js/doc_repo/DocRepoMobile";

const useHorizontalItemsScrollerStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            overflowX: 'scroll',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                width: '0!important',
                height: '0!important',
                background: 'transparent!important',
            },
            '& > .scrollerItem': {
                width: '22vw',
                height: '30vw',
                flexShrink: 0,
                maxWidth: 132,
                maxHeight: 175,
                minWidth: 75,
                minHeight: 100,
            },
            '& > .scrollerItem + .scrollerItem': {
                marginLeft: 8,
            }
        },
    }),
);

interface IScrollerProps {
    className?: string;
    style?: React.CSSProperties;
}

const HORIZONTAL_SCROLLER_MAX_ITEMS = 30;

const HorizontalItemsScroller: React.FC<IScrollerProps> = ({ children, style, className }) => {
    const classes = useHorizontalItemsScrollerStyles();

    return (
        <div className={clsx(classes.root, className)} style={style}>
            {
                React.Children.toArray(children)
                    .map((child, i) => <div key={i} className="scrollerItem">{child}</div>)
            }
        </div>
    );
};

const useScrollerStyles = makeStyles(() =>
    createStyles({
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 16px',
        },
        title: {
            fontSize: '1rem',
            fontWeight: 'normal',
            margin: 0,
            padding: '10px 0',
        },
        scroller: {
            padding: '0 16px',
        },
    })
);

const RecentDocsScroller: React.FC<IScrollerProps> = ({ className, style }) => {
    const classes = useScrollerStyles();
    const history = useHistory();
    const { data } = useDocRepoStore(['data']);
    const docLoader = useDocLoader();

    const lastUpdatedDocs = React.useMemo(() => (
        data
            .filter((x) => !!x.lastUpdated)
            .sort(({ lastUpdated: a }, { lastUpdated: b }) => moment(b).diff(a, 'seconds')) 
            .slice(0, HORIZONTAL_SCROLLER_MAX_ITEMS)
    ), [data]);

    const handleDocumentLoad = React.useCallback((doc: RepoDocInfo): React.MouseEventHandler => () => {
        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(doc.docInfo))!;
        docLoader({
            fingerprint: doc.fingerprint,
            title: doc.title,
            url: doc.url,
            newWindow: true,
            backendFileRef,
        });        
    }, [docLoader]);

    const handleUploadDocument = React.useCallback(() => {
        history.push('#add');
    }, [history]);

    return (
        <section className={className} style={style}>
            <div className={classes.header}>
                <h3 className={classes.title}>Documents</h3>
                <AddIcon style={{ cursor: 'pointer' }} onClick={handleUploadDocument} />
            </div>
            <HorizontalItemsScroller className={classes.scroller}>
                {lastUpdatedDocs.map(doc => (
                    <ThumbnailHolder
                        key={doc.id}
                        style={{ cursor: 'pointer' }}
                        onClick={handleDocumentLoad(doc)}
                        // TODO: Replace this with actual thumbnails later
                        imageURL={`https://picsum.photos/500?${doc.id}`}
                    />
                ))}
            </HorizontalItemsScroller>
        </section>
    );
};


const RecentNotesScroller: React.FC<IScrollerProps> = ({ className, style }) => {
    const classes = useScrollerStyles();
    const namedBlocks = useNamedBlocks();
    const history = useHistory();
    const lastUpdatedNotes = React.useMemo(() => (
        [...namedBlocks]
            .sort(({ updated: a }, { updated: b }) => moment(b).diff(a, 'seconds'))
            .slice(0, HORIZONTAL_SCROLLER_MAX_ITEMS)
    ), [namedBlocks]);

    const handleNoteLoad = React.useCallback((note: NamedBlock): React.MouseEventHandler => () => {
        history.push(`/notes/${note.content.data}`);
    }, []);

    const handleCreateNote = React.useCallback(() => {}, []);

    return (
        <section className={className} style={style}>
            <div className={classes.header}>
                <h3 className={classes.title}>Notes</h3>
                <AddIcon style={{ cursor: 'pointer' }} onClick={handleCreateNote} />
            </div>
            <HorizontalItemsScroller className={classes.scroller}>
                {lastUpdatedNotes.map(note => (
                    // TODO: Replace this with actual thumbnails later
                    <ThumbnailHolder
                        key={note.id}
                        style={{ cursor: 'pointer' }}
                        onClick={handleNoteLoad(note)}
                        text={note.content.data}
                    />
                ))}
            </HorizontalItemsScroller>
        </section>
    );
};

const useDefaultScreenStyles = makeStyles(() =>
    createStyles({
        root: {
            padding: '16px 0',
            overflowY: 'auto',
        },
        content: {
            marginTop: 30,
        },
        section: {
            marginBottom: 24,
        }
    }),
);

export const DefaultScreenMobile: React.FC = () => {
    const classes = useDefaultScreenStyles();

    return (
        <div className={classes.root}>
            <UserBarMobile />
            <div className={classes.content}>
                <RecentDocsScroller className={classes.section} />
                <RecentNotesScroller className={classes.section} />
                <DocRepoMobile className={classes.section} />
            </div>
        </div>
    );
};
