import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/lifecycle";
import ePub from "epubjs";
import {URLStr} from "polar-shared/src/util/Strings";
import useTheme from "@material-ui/core/styles/useTheme";

interface IProps {
    readonly docURL: URLStr;
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

        await rendition.display();
        await rendition.next();

        const metadata = await book.loaded.metadata;

        console.log({metadata});

        const navigation = await book.loaded.navigation;

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
