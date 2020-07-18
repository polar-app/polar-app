import * as React from 'react';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlighterSVGIcon} from "../svg_icons/HighlighterSVGIcon";

export interface IProps {
    readonly dispatchColor: HighlightColor;
    readonly styleColor: string;
    readonly onHighlightedColor: (color: HighlightColor) => void;
}

export const AnnotationHighlightButton = (props: IProps) =>
    <button color="clear"
            className=""
            title=""
            aria-label=""
            onClick={() => props.onHighlightedColor(props.dispatchColor)}
            style={{
                backgroundColor: 'transparent',
                border: 'none',
                margin: '0',
                padding: '5px',
            }}>

        <span aria-hidden="true"
              style={{ color: props.styleColor }}>
            <HighlighterSVGIcon style={{width: '20px', height: '20px'}}/>
        </span>

    </button>;


