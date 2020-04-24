import * as React from 'react';
import {DocAnnotation} from '../../DocAnnotation';
import {CommentDropdown} from '../CommentDropdown';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Doc} from '../../../metadata/Doc';
import {DocAuthor} from "../../DocAuthor";
import {DocAnnotationMoment} from "../../DocAnnotationMoment";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";
import {AnnotationTagInputButton} from '../AnnotationTagInputButton';
import {Tag} from 'polar-shared/src/tags/Tags';

const log = Logger.create();

/**
 * A generic wrapper that determines which sub-component to render.
 */
export class ViewComment extends React.Component<IProps, IState> {

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

                <div key={key} className="comment muted-color-root">

                    <div className="pb-1 pt-1" onDoubleClick={() => this.props.onEdit()}>

                        {/*TODO: based on the state determine if we should be*/}
                        {/*editing or just displaying the comment*/}

                        <span dangerouslySetInnerHTML={{__html: comment.html!}}>

                        </span>

                    </div>

                    <div style={{
                             display: 'flex',
                             alignItems: 'center',
                         }}
                         className="p-1">

                        <DocAuthor author={comment.author}/>

                        <div className="text-muted">
                            <DocAnnotationMoment created={comment.created}/>
                        </div>

                        <div style={{
                                 flexGrow: 1,
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'flex-end'
                             }}>

                            <AnnotationTagInputButton tagsProvider={this.props.tagsProvider}
                                                      annotation={this.props.comment}/>

                            <NullCollapse open={! comment.immutable}>
                                {this.props.editButton}
                            </NullCollapse>

                            <CommentDropdown id={'comment-dropdown-' + comment.id}
                                             disabled={comment.immutable}
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
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly doc: Doc;
    readonly comment: DocAnnotation;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

interface IState {

}


