import {AnnotationTypeSelector} from "./filter_bar/controls/annotation_type/AnnotationTypeSelector";
import {HighlightColorFilterButton} from "./filter_bar/controls/color/HighlightColorFilterButton";
import * as React from "react";
import {
    useAnnotationRepoCallbacks,
    useAnnotationRepoStore
} from "./AnnotationRepoStore";
import {AnnotationRepoTableDropdown2} from "./AnnotationRepoTableDropdown2";
import {TextFilter2} from "./filter_bar/TextFilter2";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            color: theme.palette.text.secondary
        },
    }),
);

export const AnnotationRepoFilterBar2 = () => {

    const classes = useStyles();
    const {filter} = useAnnotationRepoStore(['filter']);
    const callbacks = useAnnotationRepoCallbacks();

    const {setFilter} = callbacks;

    return (
        <div className={classes.root}>
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
