import * as React from 'react';
import {LogsContent} from './LogsContent';
import {CopyLogsToClipboardButton} from './CopyLogsToClipboardButton';
import {ClearLogsButton} from './ClearLogsButton';
import {DefaultPageLayout} from "../page_layout/DefaultPageLayout";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";

export const LogsScreen = () => (

    <DefaultPageLayout>
        <>
            <MUIButtonBar>
                <CopyLogsToClipboardButton/>
                <ClearLogsButton/>

            </MUIButtonBar>

            <div>
                <LogsContent/>
            </div>
        </>

    </DefaultPageLayout>
);