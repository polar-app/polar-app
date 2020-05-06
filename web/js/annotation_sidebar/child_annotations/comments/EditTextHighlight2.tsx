import * as React from 'react';
import {CancelButton} from "../CancelButton";
import {NullCollapse} from "../../../ui/null_collapse/NullCollapse";
import {RichTextFeatureIntro} from "../../RichTextFeatureIntro";
import {RichTextArea} from "../../RichTextArea";
import Button from "@material-ui/core/Button";
import {IDocAnnotation} from "../../DocAnnotation";
import { useAnnotationMutationContext } from '../../AnnotationMutationsContext';
import {useAnnotationActiveInputContext} from "../../AnnotationActiveInputContext";

interface IProps {
    readonly id: string;
    readonly html: string;
    readonly annotation: IDocAnnotation;

}

export const EditTextHighlight2 = (props: IProps) => {

    const {annotation} = props;

    const htmlRef = React.useRef<string>(props.html);

    const annotationInputContext = useAnnotationActiveInputContext();
    const annotationMutation = useAnnotationMutationContext();

    if (annotationInputContext.active !== 'text-highlight') {
        return null;
    }

    function handleKeyDown(event: KeyboardEvent) {

        // if (event.key === "Escape") {
        //     this.toggle();
        // }

        if (event.getModifierState("Control") && event.key === "Enter") {
            this.props.onChanged(this.html);
        }

    }

    function handleRevert() {
        annotationInputContext.reset();
        annotationMutation.onTextHighlightContentRevert(annotation);
    }

    return (
        <div>
            <RichTextFeatureIntro/>

            <div className="mt-1">

                <div className="">

                    <RichTextArea id={props.id}
                                  defaultValue={props.html}
                                  autofocus={true}
                                  onKeyDown={handleKeyDown}
                                  onChange={(html) => htmlRef.current = html}/>

                </div>

                <div className="flexbar w-100">


                    <div className="flexbar-right mt-1 mb-1">

                        <CancelButton onClick={annotationInputContext.reset}/>

                        <Button onClick={handleRevert}>

                            Revert

                        </Button>

                        <Button color="primary"
                                variant="contained"
                                onClick={() => annotationMutation.onTextHighlightContent(annotation, htmlRef.current)}>

                            Change

                        </Button>

                    </div>

                </div>

            </div>

        </div>
    );
};
