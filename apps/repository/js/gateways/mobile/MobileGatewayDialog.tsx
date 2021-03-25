import * as React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import {MobileGatewayContent} from "./MobileGatewayContent";


export const MobileGatewayDialog = React.memo(function MobileGatewayDialog() {

    return (

        <Dialog maxWidth='md'
                open={true}>

            <DialogContent>
                <MobileGatewayContent/>
            </DialogContent>

        </Dialog>

    );

});
