import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/lifecycle";
import ePub from "@polar-app/epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import useTheme from "@material-ui/core/styles/useTheme";
import {PageNavigator} from "../../PageNavigator";
import {useDocViewerCallbacks} from "../../DocViewerStore";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import Section from '@polar-app/epubjs/types/section';

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

    function createEPUBTheme(): EPUBTheme {

        // rendition.themes.override('background-color', theme.palette.background.paper);
        // rendition.themes.override('color', theme.palette.text.primary);
        // rendition.themes.override('font-family', theme.typography.fontFamily!);

        return {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily!,
            padding: '10px'
        };
    }

    async function doLoad() {

        const book = ePub(docURL);

        const pageElement = document.querySelector(".page")!;

        const rendition = book.renderTo(pageElement, {
            flow: "scrolled-doc",
            width: '100%',
        });

        const epubTheme = createEPUBTheme();
        console.log("Using epub theme: ", epubTheme);

        // rendition.themes.override('background-color', epubTheme.backgroundColor);
        rendition.themes.override('color', epubTheme.color);
        rendition.themes.override('font-family', epubTheme.fontFamily);
        rendition.themes.override('padding', epubTheme.padding);

        rendition.themes.registerCss('default', `h1, h2, h3 {color: ${theme.palette.text.primary};}`)

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
