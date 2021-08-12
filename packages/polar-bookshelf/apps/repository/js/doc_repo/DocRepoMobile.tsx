import React from "react";
import clsx from "clsx";
import ViewListIcon from '@material-ui/icons/ViewList';
import SearchIcon from '@material-ui/icons/Search';
import {ButtonBase, createStyles, debounce, fade, InputAdornment, makeStyles, TextField, TextFieldProps} from "@material-ui/core";
import {RepoDocInfo} from "../RepoDocInfo";
import {ThumbnailHolder} from "../../../../web/js/ui/ThumbnailHolder";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import {Either} from "../../../../web/js/util/Either";
import {BackendFileRefs} from "../../../../web/js/datastore/BackendFileRefs";
import {useDocLoader} from "../../../../web/js/apps/main/DocLoaderHooks";

interface IDocRepoMobileProps {
    className?: string;
    style?: React.CSSProperties;
}

const useSearchBarStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
        },
        inputOuter: {
            flex: 1,
        },
        listViewIcon: {
            padding: 3,
            borderRadius: 4,
            marginLeft: 8,
            border: `1px solid ${fade(theme.palette.text.primary, 0.5)}`,
            '& svg': {
                display: 'block',
                width: 28,
                height: 28,
                fill: fade(theme.palette.text.primary, 0.5)
            }
        },
        textField: {
            '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
            },
            '& .MuiOutlinedInput-adornedStart': {
                paddingLeft: 8,
            }
        },
        input: {
            fontSize: '1.0625rem',
            height: 36,
            background: theme.palette.background.paper,
            borderRadius: 4,
        }
    }),
);

type IDocRepoMobileSearchBarProps = TextFieldProps;

const DocRepoMobileSearchBar: React.FC<IDocRepoMobileSearchBarProps> = (props) => {
    const classes = useSearchBarStyles();

    return (
        <div className={classes.root}>
            <div className={classes.inputOuter}>
                <TextField size="small"
                           placeholder="Find note by name... "
                           variant="outlined"
                           className={classes.input}
                           classes={{ root: classes.textField }}
                           fullWidth
                           {...props}
                           InputProps={{
                               className: classes.input,
                               startAdornment: (
                                   <InputAdornment position="start">
                                       <SearchIcon style={{ width: 22, height: 22 }} />
                                   </InputAdornment>
                               ),
                           }}/>
            </div>
            <ButtonBase className={classes.listViewIcon}>
                <ViewListIcon />
            </ButtonBase>
        </div>
    );
};

interface IDocRepoDocumentProps {
    onDocumentLoad: (docInfo: RepoDocInfo) => void;
    docInfo: RepoDocInfo;
}

const useDocumentStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 12,
            height: '100%',
            maxHeight: 175,
            overflow: 'hidden'
        },
        thumbnail: {
            height: '30vw',
            maxHeight: 175,
            alignSelf: 'start',
            width: '22vw',
            maxWidth: 132,
        },
        details: {
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '100%',
            '& h3': {
                margin: 0,
                fontSize: '1.0625rem',
            },
            '& p': {
                fontSize: '0.8125rem',
                textOverflow: 'ellipsis',
                margin: 0,
                marginTop: 8,
                overflow: 'hidden',
                minHeight: 0,
                flex: '1 0 0',
            }
        }
    })
);

const DocRepoDocument: React.FC<IDocRepoDocumentProps> = (props) => {
    const classes = useDocumentStyles();
    const { docInfo, onDocumentLoad } = props;

    const handleClick = React.useCallback(() => {
        onDocumentLoad(docInfo);
    }, [onDocumentLoad, docInfo]);

    return (
        <article className={classes.root} onClick={handleClick}>
            <div className={classes.thumbnail}>
                <ThumbnailHolder
                    imageURL={`https://picsum.photos/500?${docInfo.id}`}
                />
            </div>
            <div className={classes.details}>
                <h3>{docInfo.title}</h3>
                <p>{docInfo.docInfo.description?.substr(0, 70)}</p>
            </div>
        </article>
    );
};

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            margin: '0 16px',
        },
        docsOuter: {
            margin: '24px 0',
            '& > * + *': {
                marginTop: 16,
            },
        },
    })
);

export const DocRepoMobile: React.FC<IDocRepoMobileProps> = ({ className, style }) => {
    const classes = useStyles();
    const { view } = useDocRepoStore(['view']);
    const { setFilters } = useDocRepoCallbacks();
    const docLoader = useDocLoader();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [search, setSearch] = React.useState<string>("");

    const handleDocumentLoad = React.useCallback((doc: RepoDocInfo) => {
        const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(doc.docInfo))!;
        docLoader({
            fingerprint: doc.fingerprint,
            title: doc.title,
            url: doc.url,
            newWindow: true,
            backendFileRef,
        });        
    }, [docLoader]);

    const scrollDocsRepoIntoView = React.useCallback(() => {
        setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    }, [containerRef]);

    const handleSearchTermUpdated = React.useMemo(() => {
        const updateResults = (searchTerm: string) => {
            setFilters({ title: searchTerm });
            scrollDocsRepoIntoView();
        };

        return debounce(updateResults, 1000);
    }, [setFilters, scrollDocsRepoIntoView]);

    const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
        const { target: { value } } = e;
        setSearch(value);
        handleSearchTermUpdated(value);
    }, [setSearch, handleSearchTermUpdated]);

    return (
        <div className={clsx(className, classes.root)} style={style} ref={containerRef}>
            <DocRepoMobileSearchBar
                onFocus={scrollDocsRepoIntoView}
                onChange={handleSearchChange}
                value={search}
            />
            <div className={classes.docsOuter}>
                {view.map(doc =>
                    <DocRepoDocument key={doc.id}
                                     onDocumentLoad={handleDocumentLoad}
                                     docInfo={doc} />
                )}
            </div>
        </div>
    );
};
