import React from 'react';

interface IProps {

    readonly spellCheck?: boolean;

    readonly defaultValue: string;

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly onChange: (content: string) => void;

}

/**
 * Just a minimal contenteditable control that we can use to allow the suer to
 * delete content.
 */
export const MinimalContentEditable = React.memo((props: IProps) => {

    const ref = React.useRef<HTMLDivElement | null>(null);

    const handleKeyDown = React.useCallback(() => {

        if (ref.current) {
            props.onChange(ref.current.innerHTML)
        }

    }, [props]);

    return (
        <div ref={ref}
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
