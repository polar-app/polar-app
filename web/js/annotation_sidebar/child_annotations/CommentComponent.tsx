import * as React from 'react';
import Moment from 'react-moment';
import {DocAnnotation} from '../DocAnnotation';
import {AnnotationDropdown} from '../AnnotationDropdown';
import {CommentDropdown} from './CommentDropdown';
import {Logger} from '../../logger/Logger';
import {IStyleMap} from '../../react/IStyleMap';

const log = Logger.create();

const Styles: IStyleMap = {

    barBody: {
        display: 'flex'
    },

    barChild: {
        marginTop: 'auto',
        marginBottom: 'auto',
    }

};

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class CommentComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onDelete = this.onDelete.bind(this);
        this.state = {};

    }

    public render() {
        const { comment } = this.props;

        const key = 'comment-' + comment.id;

        return (

            <div className="m-1 mb-2">

                <div key={key} className="comment">

                    <div className="pb-1 pt-1">

                        <span dangerouslySetInnerHTML={{__html: comment.html!}}>

                        </span>

                    </div>

                    <div style={Styles.barBody}
                         className="flexbar comment-bar border-top pt-1 pb-2">

                        <div style={Styles.barChild} className="text-muted">
                            {/*TODO: make this into its own component... */}
                            <Moment withTitle={true} titleFormat="D MMM YYYY hh:MM A" fromNow>
                                {comment.created}
                            </Moment>
                        </div>

                        <div style={Styles.barChild} className="flexbar-right">

                            <CommentDropdown id={'comment-dropdown-' + comment.id}
                                             comment={comment}
                                             onDelete={() => this.onDelete(comment)}/>

                        </div>

                    </div>

                </div>

            </div>
        );

    }

    private onDelete(comment: DocAnnotation) {
        log.info("Comment deleted: ", comment);
        delete comment.pageMeta.comments[comment.id];
    }

}
interface IProps {
    comment: DocAnnotation;
}

interface IState {

}


