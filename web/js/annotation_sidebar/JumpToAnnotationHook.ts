import * as React from 'react';
import {AnnotationLinks} from "./AnnotationLinks";
import {useSideNavHistory} from "../sidenav/SideNavStore";
import {AnnotationPtrs, IAnnotationPtr} from "./AnnotationPtrs";
import {IDocAnnotationRef} from './DocAnnotation';

/**
 * This is the default jump to annotation button that's used in the document
 * repository
 */
export function useJumpToAnnotationHandler() {

    const history = useSideNavHistory();

    const nonceRef = React.useRef<string | undefined>(undefined);

    const doJump = React.useCallback((ptr: IAnnotationPtr) => {

        if (nonceRef.current !== ptr.n) {

            const url = AnnotationLinks.createRelativeURL(ptr);
            console.log("Jumping to annotation via history and doc viewer context: " + url);
            history.push(url);

        } else {
            console.warn("Wrong nonceRef");
        }

        nonceRef.current = ptr.n;

    }, [history]);

    return React.useCallback((ptr: IAnnotationPtr) => {

        doJump(ptr)

    }, [doJump]);
}

export function useAnnotationLink(annotation: IDocAnnotationRef): string {
    return React.useMemo(() => {
        const ptr = createAnnotationPointer(annotation);
        return AnnotationLinks.createRelativeURL(ptr);
    }, [annotation])
}

export function createAnnotationPointer(annotation: IDocAnnotationRef): IAnnotationPtr {
    return AnnotationPtrs.create({
        target: annotation.id,
        pageNum: annotation.pageNum,
        docID: annotation.docMetaRef.id,
    });
}
