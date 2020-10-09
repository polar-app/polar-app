import * as React from 'react';
import {MUIToggleButton} from "../../../../web/js/ui/MUIToggleButton";
import FlagIcon from '@material-ui/icons/Flag';
import Grid from "@material-ui/core/Grid";
import {MUISearchBox2} from "../../../../web/js/mui/MUISearchBox2";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import {deepMemo} from "../../../../web/js/react/ReactUtils";

export interface IProps {

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;

}

export const DocRepoFilterBar = deepMemo((props: IProps) => {

    const {filters} = useDocRepoStore(['filters']);
    const callbacks = useDocRepoCallbacks();

    const {setFilters} = callbacks;

    const Right = () => {

        if (props.right) {
            return props.right;
        } else {
            return <div/>;
        }

    };

    return (

        <div id="filter-bar"
             style={{}}>

            <Grid spacing={1}
                  container
                  direction="row"
                  justify="flex-start"
                  style={{flexWrap: 'nowrap'}}
                  alignItems="center">

                <Grid item>

                    <MUIToggleButton id="toggle-flagged"
                                     tooltip="Show only flagged documents."
                                     size="medium"
                                     label="flagged"
                                     icon={<FlagIcon/>}
                                     initialValue={filters.flagged}
                                     onChange={value => setFilters({...filters, flagged: value})}/>
                </Grid>

                <Grid item>
                    <MUIToggleButton id="toggle-archived"
                                     tooltip="Toggle showing archived documents"
                                     size="medium"
                                     label="archived"
                                     initialValue={filters.archived}
                                     onChange={value => setFilters({...filters, archived: value})}/>
                </Grid>

                <Grid item>
                    <MUISearchBox2 id="filter_title"
                                   placeholder="Search by title"
                                   initialValue={filters.title}
                                   autoComplete="off"
                                   onChange={text => setFilters({...filters, title: text})}/>

                </Grid>

            </Grid>

        </div>

    );

});

