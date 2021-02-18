import React from 'react';

interface IProps {

    readonly spellCheck?: boolean;

    readonly defaultValue: string;

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly innerRef?: React.MutableRefObject<HTMLDivElement | null>;

    readonly onChange: (content: string) => void;

}

/**
 * Just a minimal contenteditable control that we can use to allow the suer to
 * delete content.
 */
export const MinimalContentEditable = React.memo((props: IProps) => {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        props.onChange(event.currentTarget.innerHTML)
    }, [props]);

    return (

        <div ref={props.innerRef}
             onKeyDown={handleKeyDown}
             contentEditable={true}
             spellCheck={props.spellCheck}
             className={props.className}
             style={{
                 outline: 'none',
                 ...props.style
             }}
             dangerouslySetInnerHTML={{__html: props.defaultValue}}/>

    );

});
