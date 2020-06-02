import React from 'react';
import {useComponentDidMount} from "../../../../../web/js/hooks/lifecycle";
import ePub from "epubjs";
import {URLStr} from "polar-shared/src/util/Strings";

interface IProps {
    readonly docURL: URLStr;
}

export const EPUBDocument = React.memo((props: IProps) => {

    const {docURL} = props;

    function doLoad() {

        const book = ePub(docURL);

        const pageElement = document.querySelector(".page")!;

        // console.log("FIXME: InlineView: ", InlineView);

        // const rendition = book.renderTo(pageElement, { flow: "scrolled-doc"});
        // const rendition = book.renderTo(pageElement, { flow: "continuous", width: '100%', height: '100%'});
        const rendition = book.renderTo(pageElement, {
            flow: "scrolled-doc",
            width: '100%',
            height: '100%',
            // view: InlineView
        });

    }

    useComponentDidMount(() => {
        doLoad()
    })

    return null;

})
