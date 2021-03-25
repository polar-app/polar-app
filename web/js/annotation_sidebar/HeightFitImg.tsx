import * as React from 'react';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import { deepMemo } from '../react/ReactUtils';

interface IProps {
    readonly id: string;
    readonly src: string;
    readonly height: number;
    readonly color?: HighlightColor;
    readonly style?: React.CSSProperties;
}

/**
 * Shows a and image and re-sizes it to its parent properly.
 */
export const HeightFitImg = deepMemo(function HeightFitImg(props: IProps) {

    const {src, height, id, color} = props;

    return (

        <img className="area-highlight m-1"
             data-annotation-id={id}
             data-annotation-color={color}
             style={{

                 // core CSS properties for the image so that it
                 // is responsive.

                 // objectFit: 'cover',
                 objectFit: 'contain',
                 objectPosition: '50% top',

                 // height,
                 maxHeight: height,

                 // boxSizing: 'content-box',
                 // border: `1px solid #c6c6c6`,
                 ...props.style

             }}
             draggable={false}
             alt="screenshot"
             src={src}/>

    );

});
