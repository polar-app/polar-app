import * as React from 'react';

export interface IPRops {
    readonly style?: React.CSSProperties;
}

export const HighlighterSVGIcon = (props: IPRops) => {
    const style = props.style || {};
    return <svg aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                style={style}
                data-icon="highlighter" role="img" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 544 512"
                className="svg-inline--fa fa-highlighter fa-w-17 fa-7x">
        <path fill="currentColor"
              d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z"
              className=""></path>
    </svg>;
};
