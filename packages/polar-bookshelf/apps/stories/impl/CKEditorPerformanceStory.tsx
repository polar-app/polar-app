import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CKEditor5BalloonEditor} from './ckeditor5/CKEditor5BalloonEditor';
import {CKEditor5GlobalCss} from "./ckeditor5/CKEditor5GlobalCss";
import { Numbers } from 'polar-shared/src/util/Numbers';

// interface EditorsProps {
//     readonly
// }

const EDITOR_COUNT = 50;

const Editors = React.memo(() => {

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
                <CKEditor5BalloonEditor key={idx}
                                        content={`${idx} this is the <b>content</b> there are many like it but this one is mine.`}
                                        preEscaped={true}
                                        onChange={NULL_FUNCTION}
                                        onEditor={handleEditor}/>))}
        </>
    );
});

export const CKEditorPerformanceStory = () => {

    return (
        <div>
            <CKEditor5GlobalCss/>

            <Editors/>

        </div>
    );

}
