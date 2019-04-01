import * as React from 'react';
import {Logger} from '../../../web/js/logger/Logger';
import {Toaster} from '../../../web/js/ui/toaster/Toaster';
import Button from 'reactstrap/lib/Button';
import {Nav} from '../../../web/js/ui/util/Nav';
import {RendererAnalytics} from '../../../web/js/ga/RendererAnalytics';

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

        // const hidden = ! ChromeExtensionInstallation.isSupported() ||
        // ChromeExtensionInstallation.isInstalled();

        const hidden = false;

        return (

            <div className="ml-1 mr-1">

                <Button hidden={hidden}
                        onClick={() => this.onClick()}
                        color="light"
                        className="border"
                        size="sm">

                    <div style={{display: 'flex'}}>

                        <div>
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

        RendererAnalytics.event({category: 'chrome-extension', action: 'manual-installation-triggered'});

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

