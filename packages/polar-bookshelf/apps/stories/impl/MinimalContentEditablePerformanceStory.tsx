import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { Numbers } from 'polar-shared/src/util/Numbers';
import {BlockContentEditable} from "../../../web/js/notes/contenteditable/BlockContentEditable";

// interface EditorsProps {
//     readonly
// }

const EDITOR_COUNT = 50;

const Editors = React.memo(function Editors() {

    const epoch = React.useMemo(() => Date.now(), []);

    const loadedRef = React.useRef(0);

    const handleEditor = React.useCallback(() => {

        loadedRef.current = loadedRef.current + 1;

        if (loadedRef.current === EDITOR_COUNT) {
            const duration = Date.now() - epoch;
            console.log("Load editor duration: " + duration);
        }

    }, [epoch]);

    return (
        <>
            {Numbers.range(1, EDITOR_COUNT).map(idx => (
                <BlockContentEditable id="1234"
                                      parent={undefined}
                                      key={idx}
                                      content={`${idx} this is the <b>content</b> there are many like it but this one is mine.`}
                                      onChange={NULL_FUNCTION}/>))}
        </>
    );
});

export const MinimalContentEditablePerformanceStory = () => {

    return (
        <div>
            <Editors/>

        </div>
    );

}
