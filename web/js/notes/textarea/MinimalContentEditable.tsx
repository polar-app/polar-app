import { HTMLStr } from 'polar-shared/src/util/Strings';
import React from 'react';
import {ContentEditableWhitespace} from "../ContentEditableWhitespace";

interface IProps {

    readonly spellCheck?: boolean;

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
 */
export const MinimalContentEditable = React.memo((props: IProps) => {

    const [content, setContent] = React.useState(props.content);
    const contentRef = React.useRef(props.content);

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        // note that we have to first use trim on this because sometimes
        // chrome uses &nbsp; which is dumb

        const newContent = ContentEditableWhitespace.trim(event.currentTarget.innerHTML);

        contentRef.current = newContent;
        props.onChange(newContent);

    }, [props]);

    React.useEffect(() => {

        if (props.content !== contentRef.current) {
            contentRef.current = props.content;
            setContent(props.content);
        }

    }, [props.content]);

    return (

        <div ref={props.innerRef}
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
