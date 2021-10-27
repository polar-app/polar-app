import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import {useBlocksAnnotationRepoStore} from "./BlocksAnnotationRepoStore";
import {BlocksAnnotationTypeSelector} from "./filter_bar/BlocksAnnotationTypeSelector";
import {observer} from "mobx-react-lite";
import {BlocksHighlightColorFilterButton} from "./filter_bar/BlocksHighlightColorFilterButton";
import {MUISearchBox2} from "../../../../web/js/mui/MUISearchBox2";
import {BlocksExportDropdown} from "./filter_bar/BlocksExportDropdown";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.text.secondary,
            '& > * + *': {
                marginLeft: 5,
            }
        },
    }),
);

export const BlocksAnnotationRepoFilterBar = observer(function BlocksAnnotationRepoFilterBar() {

    const classes = useStyles();
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();


    return (
        <div className={classes.root}>
            <BlocksAnnotationTypeSelector
                selected={blocksAnnotationRepoStore.filter.annotationTypes || []}
                onSelected={annotationTypes => blocksAnnotationRepoStore.setFilter({ annotationTypes })}/>

            <BlocksHighlightColorFilterButton
                selected={blocksAnnotationRepoStore.filter.colors || []}
                onSelected={colors => blocksAnnotationRepoStore.setFilter({ colors })} />

            <MUISearchBox2 id="filter_title"
                           placeholder="Filter by text"
                           onChange={text => blocksAnnotationRepoStore.setFilter({ text })}/>

            <BlocksExportDropdown />
        </div>
    );

});
