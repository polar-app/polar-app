import Paper from "@material-ui/core/Paper";
import React from "react";
import {DeviceRouters} from "../ui/DeviceRouter";

interface AdaptiveDialogProps {
    readonly children: React.ReactNode;
}

/**
 * Dialog that adapts itself to phones by not having itself wrapped in a 'paper' dialog.
 */
export const AdaptiveDialog = React.memo(function AdaptiveDialog(props: AdaptiveDialogProps) {

    return (
        <>
            <DeviceRouters.NotPhone>
                <div style={{
                         display: 'flex',
                         width: '100%',
                         height: '100%'
                     }}>

                    <Paper elevation={2}
                           style={{
                               margin: 'auto',
                               maxWidth: '450px',
                               minHeight: '450px',
                               maxHeight: '650px',
                               width: '100%',
                               display: 'flex',
                               flexDirection: 'column'
                           }}>

                        {props.children}

                    </Paper>
                </div>
            </DeviceRouters.NotPhone>

            <DeviceRouters.Phone>
                <>
                    {props.children}
                </>
            </DeviceRouters.Phone>
        </>
    );

});
