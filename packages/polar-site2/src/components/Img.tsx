import * as React from "react"

interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    readonly src: string;
}

function browserRequiresPNG() {

    if (navigator.userAgent.indexOf('Safari') !== -1) {
        return true;
    }

    return false;

}

export const Img = React.memo((props: IProps) => {

    function computeSrc() {

        if (browserRequiresPNG()) {
            return props.src.replace(/\.webp$/, ".png");
        }

        return props.src;

    }

    const src = computeSrc();

    return (
        <img {...props} src={src}/>
    )

});