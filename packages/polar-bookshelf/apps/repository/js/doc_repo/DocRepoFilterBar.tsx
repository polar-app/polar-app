import * as React from 'react';
import {MUIToggleButton} from "../../../../web/js/ui/MUIToggleButton";
import FlagIcon from '@material-ui/icons/Flag';
import {MUISearchBox2} from "../../../../web/js/mui/MUISearchBox2";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {UserAvatar} from '../../../../web/js/ui/cloud_auth/UserAvatar';
import {useUserInfoContext} from "../../../../web/js/apps/repository/auth_handler/UserInfoProvider";
import {useHistory} from 'react-router-dom';
import { RoutePathnames } from '../../../../web/js/apps/repository/RoutePathnames';
export interface IProps {

    /**
     * When defined, a JSX element to display on the right of the
     * FilterBar.
     */
    readonly right?: JSX.Element;
}

export const DocRepoFilterBar = deepMemo(function DocRepoFilterBar(props: IProps) {

    const {filters} = useDocRepoStore(['filters']);
    const callbacks = useDocRepoCallbacks();
    const userInfoContext = useUserInfoContext()
    const history = useHistory();

    const {setFilters} = callbacks;

    const Right = () => {

        if (props.right) {
            return props.right;
        } else {
            return <div/>;
        }

    };

    return (
        <>
            <DeviceRouters.NotDesktop>
                <div style={{display: 'flex',  width: '100%', alignItems: 'center'}}>

                    <span>My workspace</span>

                    <UserAvatar onClick={()=>history.push(RoutePathnames.ACCOUNT_MOBILE)} style={{marginLeft: 'auto'}} photoURL={userInfoContext?.userInfo?.photoURL} displayName={userInfoContext?.userInfo?.displayName}/>

                </div>
            </DeviceRouters.NotDesktop>
            <DeviceRouters.Desktop>
                <MUIButtonBar>
                    <MUIToggleButton id="toggle-flagged"
                                        tooltip="Show only flagged docs"
                                        size="medium"
                                        label="Flagged"
                                        icon={<FlagIcon/>}
                                        initialValue={filters.flagged}
                                        onChange={value => setFilters({...filters, flagged: value})}/>
                        <MUIToggleButton id="toggle-archived"
                                        tooltip="Toggle archived docs"
                                        size="medium"
                                        label="Archived"
                                        initialValue={filters.archived}
                                        onChange={value => setFilters({...filters, archived: value})}/>
                        <MUISearchBox2 id="filter_title"
                                    placeholder="Search by title"
                                    initialValue={filters.title}
                                    autoComplete="off"
                                    onChange={text => setFilters({...filters, title: text})}/>
                </MUIButtonBar>
            </DeviceRouters.Desktop>
        </>
    );

});

