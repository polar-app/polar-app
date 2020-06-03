import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/lifecycle";
import ePub from "epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import useTheme from "@material-ui/core/styles/useTheme";
import Section from "epubjs/types/section";
import {PageNavigator} from "../../PageNavigator";
import {useDocViewerCallbacks} from "../../DocViewerStore";

interface IProps {
    readonly docURL: URLStr;
}

interface ExtendedSpine {
    readonly items: ReadonlyArray<Section>;
}

export const EPUBDocument = React.memo((props: IProps) => {

    const {docURL} = props;

    const theme = useTheme();
    const {setDocDescriptor, setPageNavigator, setResizer, setScaleLeveler, setDocScale} = useDocViewerCallbacks();

    async function doLoad() {

        const book = ePub(docURL);

        const pageElement = document.querySelector(".page")!;

        const rendition = book.renderTo(pageElement, {
            flow: "scrolled-doc",
            width: '100%',
        });

        rendition.themes.override('background-color', theme.palette.background.default);
        rendition.themes.override('color', theme.palette.text.primary);

        console.log("FIXME: contents, ", rendition.getContents())
        console.log("FIXME: views, ", rendition.views())

        await rendition.display();
        await rendition.next();

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

        setPageNavigator(createPageNavigator());

        // FIXME: build a navigator object from the spine now...

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
