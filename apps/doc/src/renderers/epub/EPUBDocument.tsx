import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/lifecycle";
import ePub from "@polar-app/epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import useTheme from "@material-ui/core/styles/useTheme";
import {PageNavigator} from "../../PageNavigator";
import {useDocViewerCallbacks} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import Section from '@polar-app/epubjs/types/section';
import blue from '@material-ui/core/colors/blue';
import {EPUBFindRenderer} from "./EPUBFindRenderer";
import {EPUBFindControllers} from "./EPUBFindControllers";
import {useDocFindCallbacks} from "../../DocFindStore";

interface IProps {
    readonly docURL: URLStr;
    readonly docMeta: IDocMeta;
}

interface ExtendedSpine {
    readonly items: ReadonlyArray<Section>;
}

export const EPUBDocument = React.memo((props: IProps) => {

    const {docURL, docMeta} = props;
    const theme = useTheme();
    const {setDocDescriptor, setPageNavigator} = useDocViewerCallbacks();
    const {setFinder} = useDocFindCallbacks();
    const [active, setActive] = React.useState(false);

    function createCSS(): object {

        return {
            'body, html': {
                'color': `${theme.palette.text.primary} !important`,
                'background-color': `${theme.palette.background.default} !important`,
                'font-family': `${theme.typography.fontFamily} !important`,
                'padding': '10px',
                'padding-bottom': '10px !important'
            },
            'h1, h2, h3': {
                'color': `${theme.palette.text.primary}`
            },

            'header h2': {

            },

            'header > figure': {
                margin: '0px',
                display: 'flex'
            },

            'header > figure > img': {
                // height: '100%',
                // width: '100%',
                // 'object-fit': 'contain'
                'margin-left': 'auto',
                'margin-right': 'auto',
                'max-height': '100% !important',
                'max-width': '100% !important',
            },

            "a:link": {
                color: blue[300],
            },
            "a:visited": {
                color: blue[600],
            },
            "a:hover": {
                color: blue[400],
            },
            "a:active": {
                color: blue[500],
            },

        }

    }

    async function doLoad() {

        const book = ePub(docURL);

        const pageElement = document.querySelector(".page")!;

        // TODO:
        //
        // test no width but set the iframe CSS style to width


        const rendition = book.renderTo(pageElement, {
            flow: "scrolled-doc",
            width: '100%',
            // height: '100%',
            // layout: 'pre-paginated'
        });

        function applyCSS() {

            const css = createCSS();

            console.log("Using epub css: ", css);

            rendition.themes.default(css);

        }

        rendition.on('locationChanged', (event: any) => {
            // noop... this is called when the location of the book is changed
            // so we can use it to re-attach annotations.
        });

        await rendition.display();
        applyCSS();

        const metadata = await book.loaded.metadata;

        const spine = (await book.loaded.spine) as any as ExtendedSpine;

        function createPageNavigator(): PageNavigator {

            const pages = spine.items.filter(current => current.linear);

            function set(page: number) {

                const newPage = pages[page - 1];

                async function doAsync() {
                    await rendition.display(newPage.index)
                }

                doAsync()
                    .catch(err => console.error("Could not set page: ", err));

            }

            return {
                set,
                count: spine.items.length
            };

        }

        const pageNavigator = createPageNavigator();
        setPageNavigator(pageNavigator);

        setDocDescriptor({
            fingerprint: docMeta.docInfo.fingerprint,
            nrPages: pageNavigator.count
        });

        const finder = EPUBFindControllers.createFinder();
        setFinder(finder);

        console.log({metadata});

        const navigation = await book.loaded.navigation;

        console.log("landmarks: ", navigation.landmarks);

        console.log("toc: ", navigation.toc);

        const pageList = await book.loaded.pageList;

        console.log("pageList: ", pageList);

        const manifest = await book.loaded.manifest;

        console.log("manifest: ", manifest);

        console.log("Loaded epub");

        setActive(true);

    }

    useComponentDidMount(() => {
        doLoad()
            .catch(err => console.error("Could not load EPUB: ", err));
    })

    return (
        <>
            {active && <EPUBFindRenderer/>}
        </>
    );

})
