import * as React from 'react';
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import { MUISearchBox2 } from 'polar-bookshelf/web/js/mui/MUISearchBox2';
import { MUIToggleButton } from 'polar-bookshelf/web/js/ui/MUIToggleButton';
import FlagIcon from '@material-ui/icons/Flag';
import ArchiveIcon from "@material-ui/icons/Archive";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";

import {
    useDocRepoStore, useDocRepoCallbacks
} from "./DocRepoStore2";

export const DocRepoFilterBar = deepMemo(function DocRepoFilterBar() {

    const {view, filters, selected} = useDocRepoStore(['view', 'filters', 'selected']);
    const callbacks = useDocRepoCallbacks();

    const {setFilters, setSelected} = callbacks;

    const handleCheckbox = React.useCallback((checked: boolean) => {
        // TODO: this is wrong... the '-' button should remove the checks...
        // just like gmail.
        if (checked) {
            setSelected('all')
        } else {
            setSelected('none');
        }
    }, [setSelected]);

    return (

        <MUIButtonBar>
            <DeviceRouters.NotDesktop>
                <span style={{textAlign:'center'}}>Your workspace</span>
            </DeviceRouters.NotDesktop>
            <DeviceRouters.Desktop>
                <div> 
                    <MUISearchBox2 id="filter_title"
                                placeholder="Search by title"
                                initialValue={filters.title}
                                autoComplete="off"
                                onChange={text => setFilters({...filters, title: text})}/>
                    <MUIToggleButton id="toggle-archived" 
                                        iconOnly
                                        tooltip="Toggle archived docs"
                                        size={'small'}
                                        icon={<ArchiveIcon/>}
                                        initialValue={filters.archived}
                                        onChange={(value: any) => setFilters({...filters, archived: value})}/>
                    <MUIToggleButton id="toggle-flagged" 
                                    iconOnly
                                    tooltip="Show only flagged docs"
                                    size={'small'}
                                    icon={<FlagIcon/>}
                                    initialValue={filters.flagged}
                                    onChange={(value: any) => setFilters({...filters, flagged: value})}/>                
                </div>
            </DeviceRouters.Desktop>
        </MUIButtonBar>
    );

});
