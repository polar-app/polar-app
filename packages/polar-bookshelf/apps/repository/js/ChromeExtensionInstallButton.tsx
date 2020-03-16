import * as React from 'react';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import Button from 'reactstrap/lib/Button';
import {Nav} from '../../../web/js/ui/util/Nav';
import {AppRuntime} from '../../../web/js/AppRuntime';
import {Platforms} from "polar-shared/src/util/Platforms";
import {Browsers} from "polar-browsers/src/Browsers";
import {Analytics} from "../../../web/js/analytics/Analytics";

const log = Logger.create();

export class ChromeExtensionInstallButton extends React.Component<IProps, IState> {

    private open: boolean = false;

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onClick = this.onClick.bind(this);

        this.state = {
            open: this.open,
        };

    }

    public render() {

        const isChrome = ['chrome', 'chromium'].includes(Browsers.get()?.id || '');
        const hidden = AppRuntime.isElectron() || ! Platforms.isDesktop() || ! isChrome;

        return (

            <div className="ml-1 mr-1 d-none-mobile">

                <Button hidden={hidden}
                        onClick={() => this.onClick()}
                        color="light"
                        className="border"
                        size="md">

                    <div style={{display: 'flex'}}>

                        <div>
                            {/*TODO: make this a inline SVG button not a URL*/}
                            <img style={{
                                    height: '22px',
                                    marginRight: '5px'
                                 }}
                                 src="/web/assets/images/chrome.svg" title="chrome"/>
                        </div>

                        <div>
                            Install Chrome Extension
                        </div>

                    </div>

                </Button>

            </div>

        );

    }

    private onClick(): void {

        Analytics.event({category: 'chrome-extension', action: 'manual-installation-triggered'});

        Nav.openLinkWithNewTab("https://chrome.google.com/webstore/detail/polar-pdf-web-and-documen/jkfdkjomocoaljglgddnmhcbolldcafd");

    }

    private onSuccess() {
        Toaster.success("Chrome extension installed successfully!");
    }

    private onFailure(error: string) {
        Toaster.error("Failed to install chrome extension: " + error);
    }

}

interface IProps {
}

interface IState {

}

