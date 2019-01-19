import * as React from 'react';
import {Ref} from '../metadata/Refs';
import {AnnotationType} from '../metadata/AnnotationType';
import {CommentComponent} from '../annotation_sidebar/child_annotations/CommentComponent';
import {DocAnnotation} from '../annotation_sidebar/DocAnnotation';
import {HTMLString} from '../util/HTMLString';
import {Screenshot} from '../metadata/Screenshot';
import {Point} from '../Point';
import {ISODateTimeString} from '../metadata/ISODateTimeStrings';
import {Comment} from '../metadata/Comment';
import {HighlightColor} from '../metadata/BaseHighlight';
import {PageMeta} from '../metadata/PageMeta';
import {Proxies} from '../proxies/Proxies';
import {MockDocMetas} from '../metadata/DocMetas';
import {FlashcardComponent} from '../annotation_sidebar/child_annotations/FlashcardComponent';
import Button from 'reactstrap/lib/Button';

export class ToggleButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {value: this.props.initialValue !== undefined ? this.props.initialValue : false};

        this.toggle = this.toggle.bind(this);

    }

    public render() {

        const bgClassName = this.state.value ? 'bg-primary' : 'bg-secondary';
        const iconClassName = this.state.value ? 'fas fa-check' : 'fas fa-minus';

        return (

            <Button id={this.props.id || ""}
                    color="light p-0 pr-1 border rounded"
                    onClick={() => this.toggle()}
                    size="sm">

                <div style={{display: 'flex'}}>

                    <div className={bgClassName + " p-1 text-light rounded-left"}
                         style={{verticalAlign: 'middle', textAlign: 'center', width: '2.5em'}}>

                        &nbsp;<i className={iconClassName}></i>&nbsp;

                    </div>

                    <div className="p-1"
                         style={{verticalAlign: 'middle'}}>
                        &nbsp;{this.props.label}
                    </div>

                </div>

            </Button>

        );
    }

    public toggle() {

        const value = !this.state.value;
        this.setState({...this.state, value});

        this.props.onChange(value);

    }


}


interface IProps {
    readonly id?: string;
    readonly initialValue?: boolean;
    readonly label: string;
    readonly onChange: (value: boolean) => void;
}

interface IState {

    readonly value: boolean;

}


