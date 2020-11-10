import * as React from 'react';
import {Img} from 'polar-shared/src/metadata/Img';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import { deepMemo } from '../react/ReactUtils';

interface IProps {
    readonly id: string;
    readonly img?: Img;
    readonly color?: HighlightColor;
    readonly defaultText?: string;
}

/**
 * Shows a and image and re-sizes it to its parent properly.
 */
export const FixedHeightImg = deepMemo((props: IProps) => {

    const {img, id, color} = props;

    if (img) {

        const height = Math.floor(img.height);

        return (

            <div className="area-highlight m-1"
                 data-annotation-id={id}
                 data-annotation-color={color}
                 style={{
                     display: 'block',
                     textAlign: 'center',
                     position: 'relative'
                 }}>

                <img style={{

                         // core CSS properties for the image so that it
                         // is responsive.

                         height,
                         objectFit: 'cover',
                         objectPosition: '50% top',
                         maxHeight: height,

                         boxSizing: 'content-box',
                         // border: `1px solid #c6c6c6`,

                     }}
                     draggable={false}
                     className=""
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
