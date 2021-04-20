import * as React from 'react';

interface IProps {
    readonly url: string;
    readonly width: number;
    readonly height: number;
    readonly style?: React.CSSProperties;
}

export const MUIImageBottomFade = (props: IProps) => {

    const style: React.CSSProperties = {
        // backgroundImage: `url(${props.url})`,
        // backgroundImage: `url(${props.url}) linear-gradient(transparent, inherit)`,
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.65) 100%), url('${props.url}') no-repeat`,
        width: props.width,
        height: props.height,
        ...props.style
    };

    return (
        <div style={style}>

        </div>
    );

}