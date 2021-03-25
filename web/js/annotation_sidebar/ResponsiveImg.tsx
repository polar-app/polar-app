import * as React from 'react';
import {Img} from 'polar-shared/src/metadata/Img';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import { deepMemo } from '../react/ReactUtils';

interface IProps {
    readonly id: string;
    readonly img?: Img;
    readonly color?: HighlightColor;
    readonly defaultText?: string;
    readonly style?: React.CSSProperties;
}

/**
 * Shows a and image and re-sizes it to its parent properly.
 */
export const ResponsiveImg = deepMemo(function ResponsiveImg(props: IProps) {

    const {img, id, color} = props;

    if (img) {

        const width = Math.floor(img.width);
        const height = Math.floor(img.height);

        return (

            // TODO: we need the ability to scroll to the most recent
            // annotation that is created but I need a functional way to do
            // this because how do I determine when it loses focus?

            <div className="area-highlight m-1"
                 data-annotation-id={id}
                 data-annotation-color={color}
                 style={{
                     display: 'block',
                     textAlign: 'center',
                     position: 'relative',
                     ...props.style
                 }}>

                <img style={{

                         // core CSS properties for the image so that it
                         // is responsive.

                         width: '100%',
                         height: 'auto',
                         objectFit: 'contain',
                         objectPosition: '50% top',
                         maxWidth: width,
                         maxHeight: height,

                         // border around the image

                         boxSizing: 'content-box',
                         // border: `1px solid #c6c6c6`,

                     }}
                     draggable={false}
                     className=""
                     width={width}
                     height={height}
                     alt="screenshot"
                     src={img.src}/>

            </div>

        );
    } else {
        return (
            <div>
                {props.defaultText || 'No image'}
            </div>
        );
    }

});
