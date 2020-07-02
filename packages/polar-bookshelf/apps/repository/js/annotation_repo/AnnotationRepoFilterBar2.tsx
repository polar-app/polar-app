import {AnnotationTypeSelector} from "./filter_bar/controls/annotation_type/AnnotationTypeSelector";
import {HighlightColorFilterButton} from "./filter_bar/controls/color/HighlightColorFilterButton";
import * as React from "react";
import {
    useAnnotationRepoCallbacks,
    useAnnotationRepoStore
} from "./AnnotationRepoStore";
import {AnnotationRepoTableDropdown2} from "./AnnotationRepoTableDropdown2";
import {TextFilter2} from "./filter_bar/TextFilter2";

export const AnnotationRepoFilterBar2 = () => {

    const store = useAnnotationRepoStore();
    const callbacks = useAnnotationRepoCallbacks();

    const {filter} = store;
    const {setFilter} = callbacks;

    return (
        <div style={{display: 'flex'}}>
            <div className="mr-1 mt-auto mb-auto">
                <AnnotationTypeSelector
                    selected={filter.annotationTypes || []}
                    onSelected={annotationTypes => setFilter({annotationTypes})}/>
            </div>

            <div className="mr-1 mt-auto mb-auto">
                <HighlightColorFilterButton selected={filter.colors}
                                            onSelected={colors => setFilter({colors})}/>
            </div>

            <div className="ml-1 d-none-mobile mt-auto mb-auto">
                <TextFilter2 onChange={text => setFilter({text})}/>
            </div>

            <div className="ml-1 d-none-mobile mt-auto mb-auto">
                <AnnotationRepoTableDropdown2 onExport={callbacks.onExport}/>
            </div>
        </div>
    );

}
