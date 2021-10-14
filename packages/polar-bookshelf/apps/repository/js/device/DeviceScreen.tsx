import * as React from 'react';
import {DefaultPageLayout} from "../page_layout/DefaultPageLayout";
import {ExtendedDeviceInfo} from "../repo_header/DeviceInfo";
import {useHistory} from "react-router-dom";
import {FullWidthButton} from '../configure/settings/FullWidthButton';
import {RoutePathNames} from '../../../../web/js/apps/repository/RoutePathNames';
import SubjectIcon from '@material-ui/icons/Subject';
import {Divider} from '@material-ui/core';


const LogsButton = () => {

    const history = useHistory();

    const onLogs = React.useCallback(() => {
        history.push(RoutePathNames.LOGS);
    }, [history]);


    return (
        <FullWidthButton icon={<SubjectIcon />} onClick={onLogs}>
            Logs
        </FullWidthButton>
    )

}

export const DeviceScreen = React.memo(function DeviceScreen() {
    return (

        <DefaultPageLayout>

            <div className="text-lg" style={{ margin: 16 }}>

                <div>
                    <p>
                        Information about the user's current device.
                    </p>

                    <div className="mt-1">
                        <ExtendedDeviceInfo/>
                    </div>


                </div>

            </div>
            <Divider style={{ margin: '16px 0' }} />
            <LogsButton/>

        </DefaultPageLayout>

    );
});
