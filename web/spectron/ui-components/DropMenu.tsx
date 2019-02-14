import * as React from 'react';
import {Ref} from '../../js/metadata/Refs';
import {AnnotationType} from '../../js/metadata/AnnotationType';
import {CommentComponent} from '../../js/annotation_sidebar/child_annotations/CommentComponent';
import {DocAnnotation} from '../../js/annotation_sidebar/DocAnnotation';
import {HTMLString} from '../../js/util/HTMLString';
import {Screenshot} from '../../js/metadata/Screenshot';
import {Point} from '../../js/Point';
import {ISODateTimeString} from '../../js/metadata/ISODateTimeStrings';
import {Comment} from '../../js/metadata/Comment';
import {HighlightColor} from '../../js/metadata/BaseHighlight';
import {PageMeta} from '../../js/metadata/PageMeta';
import {Proxies} from '../../js/proxies/Proxies';
import {MockDocMetas} from '../../js/metadata/DocMetas';
import {FlashcardComponent} from '../../js/annotation_sidebar/child_annotations/FlashcardComponent';
import Dropdown from 'reactstrap/lib/Dropdown';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import DropdownMenu from 'reactstrap/lib/DropdownMenu';
import DropdownItem from 'reactstrap/lib/DropdownItem';

export class DropMenu extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onToggle = this.onToggle.bind(this);
        this.onClick = this.onClick.bind(this);

        this.state = {
            open: this.props.open ? true : false
        };

    }

    public render() {

        return (

            <Dropdown tag="div"
                      direction="right"
                      isOpen={this.state.open}
                      onClick={event => this.onClick(event)}
                      toggle={() => this.onToggle()}>

                <DropdownToggle className=""
                                color="light" caret>
                    Dropdown
                </DropdownToggle>

                {this.props.children}

            </Dropdown>

        );
    }

    private onToggle() {
        console.log("FIXME ontoggle called");
        this.setState({ ...this.state, open: !this.state.open });
    }

    private onClick(event: React.MouseEvent) {
        console.log("FIXME: Caought onClick");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

}

interface IProps {
    readonly open?: boolean;
}

interface IState {
    readonly open: boolean;
}


