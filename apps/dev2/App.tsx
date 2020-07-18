import React from 'react';
import {Content} from "./Content";
import {SearchBar} from "./SearchBar";
import {
    DOMTextHit,
    DOMTextSearch
} from "polar-dom-text-search/src/DOMTextSearch";
import { HitHighlights } from './HitHighlights';

export const App = () => {

    const [hits, setHits] = React.useState<ReadonlyArray<DOMTextHit>>([]);

    function handleSearch(text: string) {

        if (text.trim() === '') {
            setHits([]);
            return;
        }

        // use the new search frame work to see if we can find the text on
        // the page...
        const index = DOMTextSearch.createIndex(document, document.getElementById('content')!);

        const hits = index.search(text);
        setHits(hits);

        //
        // TextHighlighter.createTextHighlight()

        console.log("Found N hits: " + hits.length, hits);

    }

    return (
        <div style={{padding: '15px'}}>
            <SearchBar onSearch={handleSearch}/>
            <Content/>
            <HitHighlights hits={hits}/>
        </div>
    );
}
