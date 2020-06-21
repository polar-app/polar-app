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
    const {setDocDescriptor, setPageNavigator, setResizer, setScaleLeveler, setDocScale} = useDocViewerCallbacks();

    interface EPUBTheme {
        readonly backgroundColor: string;
        readonly color: string;
        readonly fontFamily: string;
        readonly padding: string;
    }

    function createCSS(): object {

        return {
            'body, html': {
                color: theme.palette.text.primary,
                'font-family': theme.typography.fontFamily,
                padding: '10px',
                paddingBottom: '10px !important'
            },

            'h1, h2, h3': {
                color: theme.palette.text.primary
            },

            'header h2': {

            },

            'header > figure': {
                margin: '0px'
            },

            'header > figure > img': {
                // height: '100%',
                // width: '100%',
                // 'object-fit': 'contain'
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
        const css = createCSS();

        console.log("Using epub css: ", css);

        rendition.themes.default(css);

        await rendition.display();

        const metadata = await book.loaded.metadata;

        const spine = (await book.loaded.spine) as any as ExtendedSpine;

        function createPageNavigator(): PageNavigator {

            const pages = spine.items.filter(current => current.linear);

            // function get(): number {
            //
            //     const section = arrayStream(pages)
            //         .withIndex()
            //         .filter(current => current.value.index === rendition.location.start.index)
            //         .first();
            //
            //     if (! section) {
            //         throw new Error("No section found for index: " + rendition.location.start.index);
            //     }
            //
            //     return section.index + 1;
            //
            // }

            function set(page: number) {

                const newPage = pages[page - 1];

                rendition.display(newPage.index)
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

        console.log({metadata});

        const navigation = await book.loaded.navigation;

        console.log("landmarks: ", navigation.landmarks);

        console.log("toc: ", navigation.toc);

        const pageList = await book.loaded.pageList;

        console.log("pageList: ", pageList);

        const manifest = await book.loaded.manifest;

        console.log("manifest: ", manifest);

        console.log("Loaded epub");

    }

    useComponentDidMount(() => {
        doLoad()
            .catch(err => console.error("Could not load EPUB: ", err));
    })

    return null;

})
