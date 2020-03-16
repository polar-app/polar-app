import * as React from 'react';
import {Button} from 'reactstrap';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlighterSVGIcon} from "../svg_icons/HighlighterSVGIcon";

export interface IProps {
    readonly dispatchColor: HighlightColor;
    readonly styleColor: string;
    readonly onHighlightedColor: (color: HighlightColor) => void;
}

export const AnnotationHighlightButton = (props: IProps) =>
    <Button size="lg"
            type="button"
            color="clear"
            className=""
            title=""
            aria-label=""
            onClick={() => props.onHighlightedColor(props.dispatchColor)}
            style={{
                backgroundColor: 'transparent',
                border: 'none',
                margin: '0',
                padding: '5px'
            }}>

        <span aria-hidden="true"
              style={{ color: props.styleColor, fontSize: '14px' }}>
            <HighlighterSVGIcon style={{width: '15px', height: '15px'}}/>
        </span>

    </Button>;


