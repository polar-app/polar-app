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
import {CommentAnnotationControlBar} from "./CommentAnnotationControlBar";

const log = Logger.create();

interface IProps {
    readonly tagsProvider: () => ReadonlyArray<Tag>;
    readonly doc: Doc;
    readonly comment: DocAnnotation;
    readonly editButton: JSX.Element;
    readonly onEdit: () => void;
}

export const CommentAnnotationView = (props: IProps) => {

    const { comment } = props;

    return (

        <div className="ml-2">

            <div className="comment muted-color-root">

                <div className="p-1">

                    {/*TODO: based on the state determine if we should be*/}
                    {/*editing or just displaying the comment*/}

                    <span dangerouslySetInnerHTML={{__html: comment.html!}}>

                    </span>

                </div>

                <CommentAnnotationControlBar {...props}/>

            </div>

        </div>
    );

}



