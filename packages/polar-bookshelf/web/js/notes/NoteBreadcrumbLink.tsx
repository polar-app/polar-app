import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import {Block} from "./store/Block";
import {MarkdownContentConverter} from "./MarkdownContentConverter";
import {BlockTextContentUtils} from "./NoteUtils";
import {TextContent} from "./store/BlockPredicates";
import {Breadcrumbs, fade} from "@material-ui/core";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {createNoteLink} from "./NoteLinkLoader";
import {useHistory} from "react-router-dom";
import {useLinkNavigationClickHandler} from "./NoteLinksHooks";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '35ch',
            color: theme.palette.text.secondary,
            fontSize: '0.8em',
            padding: '2px 4px',
            cursor: 'pointer',
            borderRadius: 2,
            transition: 'background-color 100ms ease-in-out',
            '&:hover': {
                backgroundColor: fade(theme.palette.text.primary, 0.1),
            },
        },
    }),
);

interface IProps {
    readonly block: Block<TextContent>;
}

export const NoteBreadcrumbLink = React.memo(function NoteBreadcrumbLink(props: IProps) {
    const { block } = props;
    const classes = useStyles();
    const history = useHistory();

    const content = React.useMemo(() => BlockTextContentUtils.getTextContentMarkdown(block.content), [block.content]);
    const linkNavigationClickHandler = useLinkNavigationClickHandler({ id: block.id });

    const htmlContent = React.useMemo(() => MarkdownContentConverter.toHTML(content), [content]);


    const handleClick = React.useCallback((event: React.MouseEvent) => {
        if (linkNavigationClickHandler(event)) {
            return;
        }

        const noteLink = createNoteLink(block.id);
        history.push(noteLink); 
    }, [history, block.id, linkNavigationClickHandler]);

    return (
        <div onClick={handleClick} className={classes.root}>
            <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
});

interface INoteBreadcrumbLinksProps {
    readonly blocks: ReadonlyArray<Block<TextContent>>;
}

const useNoteBreadcrumbLinksStyles = makeStyles(() =>
    createStyles({
        listItem: {
            display: 'flex',
            alignItems: 'center',
        },
        separator: {
            marginLeft: 6,
            marginRight: 6,
        },
    }),
);

export const NoteBreadcrumbLinks: React.FC<INoteBreadcrumbLinksProps> = (props) => {
    const { blocks } = props;
    const classes = useNoteBreadcrumbLinksStyles();

    const breadcrumbLinks = blocks.map(block => <NoteBreadcrumbLink key={block.id} block={block} />);

    return (
        <Breadcrumbs
            classes={{ li: classes.listItem, separator: classes.separator }}
            separator={<NavigateNextIcon fontSize="small" />}
        >
            {breadcrumbLinks}
        </Breadcrumbs>
    );
};
