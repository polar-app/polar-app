import * as React from 'react';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";
import {HighlighterSVGIcon} from "../svg_icons/HighlighterSVGIcon";
import {memoForwardRef} from "../../react/ReactUtils";
import makeStyles from '@material-ui/core/styles/makeStyles';

export interface IProps {
    readonly dispatchColor: HighlightColor;
    readonly styleColor: string;
    readonly onHighlightedColor: (color: HighlightColor) => void;
}

// https://material-ui.com/styles/basics/#adapting-based-on-props
//
// This doesn't seem to work because the <style> is injected in the root
// document and not the target document which is a in a react portal in an
// iframe.
const useStyles = makeStyles({
  root: (props: IProps) => ({
      color: `${props.styleColor}`
  }),
});

export const AnnotationHighlightButton = memoForwardRef((props: IProps) => {

    return (

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

            <span aria-hidden="true" style={{
                                         color: props.styleColor
                                     }}>
                <HighlighterSVGIcon style={{
                                        color: props.styleColor,
                                        width: '20px',
                                        height: '20px'
                                    }}/>
            </span>

        </button>
    );

});


