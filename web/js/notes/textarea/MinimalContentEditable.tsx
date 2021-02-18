import { HTMLStr } from 'polar-shared/src/util/Strings';
import React from 'react';

/**
 * A data-format specific string like Markdown or HTML or JSON but that can be
 * converted to HTML
 */
export type DataStr = string;

export interface ContentEscaper {

    readonly escape: (input: DataStr) => HTMLStr;
    readonly unescape: (html: HTMLStr) => DataStr;

}

/**
 * NOOP/null content escaper pattern.
 */
export const DefaultContentEscaper: ContentEscaper = {
    escape: input => input,
    unescape: html => html
}

interface IProps {

    readonly spellCheck?: boolean;

    readonly content: string;

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly innerRef?: React.MutableRefObject<HTMLDivElement | null>;

    readonly onChange: (content: string) => void;

    readonly escaper?: ContentEscaper;
    readonly preEscaped?: boolean

}

/**
 * Just a minimal contenteditable control that we can use to allow the suer to
 * delete content.
 */
export const MinimalContentEditable = React.memo((props: IProps) => {

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {
        props.onChange(event.currentTarget.innerHTML)
    }, [props]);

    const escaper = props.escaper || DefaultContentEscaper;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const content = React.useMemo<HTMLStr>(() => props.preEscaped ? props.content : escaper.escape(props.content), []);

    return (

        <div ref={props.innerRef}
             onKeyUp={handleKeyUp}
             contentEditable={true}
             spellCheck={props.spellCheck}
             className={props.className}
             style={{
                 outline: 'none',
                 ...props.style
             }}
             dangerouslySetInnerHTML={{__html: content}}/>

    );

});
