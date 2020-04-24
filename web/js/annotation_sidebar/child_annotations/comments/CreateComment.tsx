import * as React from 'react';
import {EditComment} from "./EditComment";
import {CancelButton} from "../CancelButton";


interface IProps {
    readonly id: string;
    readonly active: boolean;
    readonly onComment: (html: string) => void;
    readonly onCancel: () => void;
}

export const CreateComment  = (props: IProps) => {

    if (! props.active) {
        return null;
    }

    const cancelButton = <CancelButton onClick={() => props.onCancel()}/>;

    return (

        <EditComment id={'edit-comment-for' + props.id}
                     onComment={(html) => props.onComment(html)}
                     cancelButton={cancelButton}/>
    );

}
