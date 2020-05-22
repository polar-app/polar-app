import * as React from 'react';
import {useCallback, useRef} from 'react';
import {RichTextArea} from "../../RichTextArea";
import {Comment} from '../../../metadata/Comment';
import {RichTextFeatureIntro} from '../../RichTextFeatureIntro';
import Button from '@material-ui/core/Button';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import isEqual from "react-fast-compare";
import {MUIButtonBar} from "../../../mui/MUIButtonBar";


interface IProps {

    readonly id?: string;

    /**
     * When given a comment we're editing an existing comment.
     */
    readonly existingComment?: Comment;

    /**
     *
     */
    readonly cancelButton: JSX.Element;

    readonly onComment: (html: string) => void;

}

export const EditComment2 = React.memo((props: IProps) => {

    const htmlRef = useRef<string>(props.existingComment?.content.HTML || "");

    const id = 'rich-text-editor-' + props.id;

    const onKeyDown = useCallback((event: KeyboardEvent) => {

        // if (event.key === "Escape") {
        //     this.toggle();
        // }

        if (event.getModifierState("Control") && event.key === "Enter") {
            // FIXME no execution here...
        }

    }, []);

    return (
        <div>

            {/*<RichTextFeatureIntro/>*/}

            <div id="annotation-comment-box"
                 className="mt-1">

                <div className="">

                    <RichTextArea id={id}
                                  value={htmlRef.current}
                                  autofocus={true}
                                  onKeyDown={onKeyDown}
                                  onChange={(html) => htmlRef.current = html}/>

                </div>

                <div className="pt-1 pb-1">

                    <MUIButtonBar style={{
                                      flexGrow: 1,
                                      justifyContent: "flex-end"
                                   }}>

                        {props.cancelButton}

                        <Button color="primary"
                                variant="contained"
                                onClick={() => props.onComment(htmlRef.current)}>

                            {props.existingComment ? 'Update' : 'Comment'}

                        </Button>

                    </MUIButtonBar>

                </div>

            </div>


        </div>

    );

}, isEqual);

