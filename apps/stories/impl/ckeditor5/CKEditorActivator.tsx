import * as React from "react";
import {CKEditor5BalloonEditor} from "./CKEditor5BalloonEditor";
import {HTMLStr} from "polar-shared/src/util/Strings";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface ActiveProps {
    readonly content: HTMLStr;
    readonly offset: number;
    readonly onEditor: (editor: ckeditor5.IEditor) => void;
}


const Active = (props: ActiveProps) => {

    const positionCursorWithinEditor = React.useCallback((editor: ckeditor5.IEditor, offset: number) => {

        const doc = editor.model.document;

        editor.model.change((writer) => {

            const root = doc.getRoot();

            const position = writer.createPositionFromPath(root, [0, offset]);

            const range = writer.createRange(position, position);

            writer.setSelection(range);

        });

    }, []);

    const handleEditor = React.useCallback((editor: ckeditor5.IEditor) => {
        positionCursorWithinEditor(editor, props.offset);
        props.onEditor(editor);

        editor.editing.view.focus();

    }, [positionCursorWithinEditor, props]);

    return (

        <CKEditor5BalloonEditor content={props.content}
                                onChange={NULL_FUNCTION}
                                onEditor={handleEditor}/>

    );

}

interface InactiveProps {

    readonly content: HTMLStr;

    /**
     * Called when we've been activated by clicking.
     */
    readonly onActivated: (offset: number) => void;

}

const Inactive = (props: InactiveProps) => {

    const elementRef = React.useRef<HTMLDivElement |  null>(null);

    const handleClick = React.useCallback(() => {
        props.onActivated(0);
    }, [props]);

    return (
        <div ref={elementRef}
             onClick={handleClick}
             dangerouslySetInnerHTML={{__html: props.content}}>

        </div>
    );
}

export type Activator = (offset?: number) => void;

interface IProps {

    /**
     * Callback to provide an 'activator' that allows the caller to activate the
     * given component.
     *
     */
    readonly onActivator: (activator: Activator) => void;
    readonly onActivated: (editor: ckeditor5.IEditor) => void;

    readonly content: HTMLStr;

}

export const CKEditorActivator = (props: IProps) => {

    const [active, setActive] = React.useState(false);
    const offsetRef = React.useRef(0);

    const handleActivated = React.useCallback((offset?: number) => {

        if (! active) {

            if (offset !== undefined) {
                offsetRef.current = offset;
            }

            setActive(true);

        }

    }, [active]);

    const activator = React.useCallback((offset?: number) => {
        handleActivated(offset);
    }, [handleActivated]);

    React.useEffect(() => {
        props.onActivator(activator)
    }, [activator, props]);

    if (active) {

        return (
            <Active offset={offsetRef.current}
                    content={props.content}
                    onEditor={props.onActivated}/>
        );

    } else {

        return (
            <Inactive onActivated={activator}
                      content={props.content}/>
        );

    }

}
