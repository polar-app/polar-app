import * as React from 'react';
import {Analytics} from "../../../web/js/analytics/Analytics";
import {Nav} from "../../../web/js/ui/util/Nav";

export class ChromeExtensionInstallButton extends React.Component<any, any> {

    private open: boolean = false;



    // constructor() {
    //
    //     this.onClick = this.onClick.bind(this);
    //
    //     this.state = {
    //         open: this.open,
    //     };
    //
    // }

    public render() {

        return null;

        // const isChrome = ['chrome', 'chromium'].includes(Browsers.get()?.id || '');
        // const hidden = AppRuntime.isElectron() || ! Platforms.isDesktop() || ! isChrome;
        //
        // return (
        //
        //     // <div className="d-none-mobile">
        //     //
        //     //     <Button hidden={hidden}
        //     //             onClick={() => this.onClick()}
        //     //             variant="contained">
        //     //
        //     //         <div style={{display: 'flex'}}>
        //     //
        //     //
        //     //             Install Chrome Extension
        //     //
        //     //     </Button>
        //     //
        //     // </div>
        //
        // );

    }

    private onClick(): void {

        Analytics.event({category: 'chrome-extension', action: 'manual-installation-triggered'});

        Nav.openLinkWithNewTab("https://chrome.google.com/webstore/detail/polar-pdf-web-and-documen/jkfdkjomocoaljglgddnmhcbolldcafd");

    }

    private onSuccess() {
        // Toaster.success("Chrome extension installed successfully!");
    }

    private onFailure(error: string) {
        // Toaster.error("Failed to install chrome extension: " + error);
    }

}
