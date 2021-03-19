import * as React from 'react';
import {useRef} from 'react';
import {RichTextArea} from "../../RichTextArea";
import {Comment} from '../../../metadata/Comment';
import Button from '@material-ui/core/Button';
import {MUIButtonBar} from "../../../mui/MUIButtonBar";
import {deepMemo} from "../../../react/ReactUtils";
import {InputCompleteListener} from "../../../mui/complete_listeners/InputCompleteListener";
import {CancelButton} from "../CancelButton";


interface IProps {

    readonly id?: string;

    /**
     * When given a comment we're editing an existing comment.
     */
    readonly existingComment?: Comment;

    readonly onCancel: () => void;

    readonly onComment: (html: string) => void;

}

export const EditComment2 = deepMemo((props: IProps) => {

    const htmlRef = useRef<string>(props.existingComment?.content.HTML || "");
    const onComplete = React.useCallback(() => {
        props.onComment(htmlRef.current);
    }, [props]);

    const id = 'rich-text-editor-' + props.id;

    return (
        <>

            <div id="annotation-comment-box" className="m-1">

                <InputCompleteListener type='meta+enter'
                                       onComplete={onComplete}
                                       onCancel={props.onCancel}>

                    <RichTextArea id={id}
                                  value={htmlRef.current}
                                  autofocus={true}
                                  onChange={(html) => htmlRef.current = html}/>

                </InputCompleteListener>

                <div className="pt-1 pb-1">

                    <MUIButtonBar style={{
                                      flexGrow: 1,
                                      justifyContent: "flex-end"
                                   }}>

                        <CancelButton onClick={props.onCancel}/>

                        <Button color="primary"
                                variant="contained"
                                onClick={onComplete}>

                            {props.existingComment ? 'Update' : 'Comment'}

                        </Button>

                    </MUIButtonBar>

                </div>

            </div>

        </>

    );

});

