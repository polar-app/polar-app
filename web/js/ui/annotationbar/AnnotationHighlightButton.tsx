import * as React from 'react';
import {Button} from 'reactstrap';
import {HighlightColor} from "polar-shared/src/metadata/IBaseHighlight";

/**
 */
export class AnnotationHighlightButton extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <Button size="lg"
                    type="button"
                    className="btn p-1 m-1 annotationbar-btn"
                    title=""
                    aria-label=""
                    onClick={() => this.props.onHighlightedColor(this.props.dispatchColor)}
                    style={{ }}>

                <span className="fas fa-highlighter"
                      aria-hidden="true"
                      style={{ color: this.props.styleColor }}/>

            </Button>
        );

    }

}

export interface IProps {
    readonly dispatchColor: HighlightColor;
    readonly styleColor: string;
    readonly onHighlightedColor: (color: HighlightColor) => void;
}

export interface IState {
}

