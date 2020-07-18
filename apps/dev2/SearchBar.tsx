import React from 'react';
import TextField from "@material-ui/core/TextField"
import {DOMTextSearch} from "polar-dom-text-search/src/DOMTextSearch";

export const SearchBar = () => {

    const value = React.useRef("");

    function doSearch(text: string) {
        // use the new search frame work to see if we can find the text on
        // the page...
        const index = DOMTextSearch.createIndex(document, document.getElementById('content')!);

        const hits = index.search(text);
        //
        // TextHighlighter.createTextHighlight()

        console.log("Found N hits: " + hits.length, hits);

    }

    function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {

        if (event.key === 'Enter') {
            // don't allow anything else to process this event.
            event.stopPropagation();
            event.preventDefault();

            doSearch(value.current);
        }

    }


    function handleChange(text: string) {
        value.current = text;
    }

    return (
        <TextField label="Enter a search: "
                   variant="outlined"
                   onChange={event => handleChange(event.currentTarget.value)}
                   onKeyPress={event => handleKeyPress(event)}/>
    )
}
