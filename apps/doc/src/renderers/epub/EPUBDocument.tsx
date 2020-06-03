import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/lifecycle";
import ePub from "epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import useTheme from "@material-ui/core/styles/useTheme";
import Section from "epubjs/types/section";

interface IProps {
    readonly docURL: URLStr;
}

interface ExtendedSpine {
    readonly items: ReadonlyArray<Section>;
}

export const EPUBDocument = React.memo((props: IProps) => {

    const {docURL} = props;

    const theme = useTheme();

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

        console.log("FIXME: currentLocation: ", rendition.currentLocation())

        const metadata = await book.loaded.metadata;


        const spine = (await book.loaded.spine) as any as ExtendedSpine;

        for (const spineItem of spine.items) {
            console.log("FIXME: spineItem: ", spineItem);
        }

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
