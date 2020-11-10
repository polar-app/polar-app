import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import {AutoBlur} from "./AutoBlur";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import isEqual from "react-fast-compare";
import { MUIDocTagButton } from "./buttons/MUIDocTagButton";
import {MUIDocArchiveButton} from "./buttons/MUIDocArchiveButton";
import { MUIDocFlagButton } from "./buttons/MUIDocFlagButton";
import { MUIDocDeleteButton } from "./buttons/MUIDocDeleteButton";

export const DocRepoTableToolbar = React.memo(() => {

    const {view, selected}
        = useDocRepoStore(['view', 'selected']);

    const callbacks = useDocRepoCallbacks();

    const {setSelected} = callbacks;

    const handleCheckbox = (checked: boolean) => {
        // TODO: this is wrong... the '-' button should remove the checks...
        // just like gmail.
        if (checked) {
            setSelected('all')
        } else {
            setSelected('none');
        }
    }

    return (
        <>
            <Grid container
                  direction="row"
                  justify="space-between"
                  alignItems="center">

                <Grid item>

                    <Box pl={0}>

                        <Grid container
                              spacing={1}
                              direction="row"
                              justify="flex-start"
                              style={{
                                  flexWrap: 'nowrap'
                              }}
                              alignItems="center">

                            <Grid item>
                                <AutoBlur>
                                    <Checkbox
                                        size="medium"
                                        indeterminate={selected.length > 0 && selected.length < view.length}
                                        checked={selected.length === view.length && view.length !== 0}
                                        onChange={event => handleCheckbox(event.target.checked)}
                                        inputProps={{ 'aria-label': 'select all documents' }}
                                    />
                                </AutoBlur>
                            </Grid>

                            {selected.length > 0 && (
                                <>
                                    <Grid item>
                                        <MUIDocTagButton onClick={callbacks.onTagged} size="medium"/>
                                    </Grid>

                                    <Grid item>
                                        <MUIDocArchiveButton onClick={callbacks.onArchived} size="medium"/>
                                    </Grid>

                                    <Grid item>
                                        <MUIDocFlagButton onClick={callbacks.onFlagged} size="medium"/>
                                    </Grid>

                                     <Divider orientation="vertical" variant="middle" flexItem/>

                                    <Grid item>
                                        <MUIDocDeleteButton size="medium"
                                                            onClick={callbacks.onDeleted}/>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                </Grid>

            </Grid>
        </>
    );
}, isEqual);
