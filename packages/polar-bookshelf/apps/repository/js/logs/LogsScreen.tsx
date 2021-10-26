import * as React from 'react';
import {LogsContent} from './LogsContent';
import {CopyLogsToClipboardButton} from './CopyLogsToClipboardButton';
import {ClearLogsButton} from './ClearLogsButton';
import {DefaultPageLayout} from "../page_layout/DefaultPageLayout";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import Box from '@material-ui/core/Box';
import { AdaptivePageLayout } from '../page_layout/AdaptivePageLayout';

export const LogsScreen = () => (
    <AdaptivePageLayout title="Logs">
        <DefaultPageLayout>
            <>

                <Box mb={1} mt={2}>

                    <MUIButtonBar>
                        <CopyLogsToClipboardButton/>
                        <ClearLogsButton/>
                    </MUIButtonBar>

                </Box>

                <div>
                    <LogsContent/>
                </div>
            </>

        </DefaultPageLayout>
    </AdaptivePageLayout>
);