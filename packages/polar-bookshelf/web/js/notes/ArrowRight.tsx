import * as React from 'react';

interface IArrowRightProps {
    readonly style?: React.CSSProperties;
}

export const ArrowRight: React.FC<IArrowRightProps> = React.memo(function ArrowRight({ style = {} }) {
    return (
        <div style={{...style}}>
            &#x25B8;
        </div>
    );
});
