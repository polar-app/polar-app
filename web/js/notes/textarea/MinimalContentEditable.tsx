import { HTMLStr } from 'polar-shared/src/util/Strings';
import React from 'react';
import {ContentEditableWhitespace} from "../ContentEditableWhitespace";
import { observer } from "mobx-react-lite"
import {NoteIDStr, useNotesStore} from '../store/NotesStore';

interface IProps {

    readonly spellCheck?: boolean;

    readonly id: NoteIDStr;

    readonly content: HTMLStr;

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly innerRef?: React.MutableRefObject<HTMLDivElement | null>;

    readonly onChange: (content: HTMLStr) => void;

    readonly onClick?: (event: React.MouseEvent) => void;

    readonly onKeyDown?: (event: React.KeyboardEvent) => void;

}

/**
 * Just a minimal contenteditable control that we can use to allow the suer to
 * delete content.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 */
export const MinimalContentEditable = observer((props: IProps) => {

    const [content, setContent] = React.useState(props.content);

    const divRef = React.useRef<HTMLDivElement | null>();

    const contentRef = React.useRef(props.content);

    const store = useNotesStore();

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        // note that we have to first use trim on this because sometimes
        // chrome uses &nbsp; which is dumb

        const newContent = ContentEditableWhitespace.trim(event.currentTarget.innerHTML);

        contentRef.current = newContent;
        props.onChange(newContent);

    }, [props]);

    React.useEffect(() => {

        if (store.active === props.id) {

            if (divRef.current) {
                divRef.current.focus();
            }

        }

    }, [props.id, store.active]);

    React.useEffect(() => {

        if (props.content.valueOf() !== contentRef.current.valueOf()) {

            // console.log("content differs: ");
            // console.log(`    props.content:      '${props.content}'`);
            // console.log(`    contentRef.current: '${contentRef.current}'`);
            // console.log(`    value of equals:    `, props.content.valueOf() === contentRef.current.valueOf());

            contentRef.current = props.content;

            setContent(props.content);
        }

    }, [props.content]);

    const handleRef = React.useCallback((current: HTMLDivElement | null) => {

        divRef.current = current;

        if (props.innerRef) {
            props.innerRef.current = current;
        }

    }, [props]);

    return (

        <div ref={handleRef}
             onKeyDown={props.onKeyDown}
             onKeyUp={handleKeyUp}
             contentEditable={true}
             spellCheck={props.spellCheck}
             className={props.className}
             onClick={props.onClick}
             style={{
                 outline: 'none',
                 ...props.style
             }}
             dangerouslySetInnerHTML={{__html: content}}/>

    );

});
