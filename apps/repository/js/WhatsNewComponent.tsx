import * as React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {Version} from '../../../web/js/util/Version';
import {app} from 'electron';
import {FilePaths} from '../../../web/js/util/FilePaths';
import {Files} from '../../../web/js/util/Files';
import {Logger} from '../../../web/js/logger/Logger';
import {WhatsNewContent} from './WhatsNewContent';
import {WhatsNewModal} from './WhatsNewModal';

const log = Logger.create();

export class WhatsNewComponent extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.hide = this.hide.bind(this);

        this.handleVersionState = this.handleVersionState.bind(this);
        this.isNewVersion = this.isNewVersion.bind(this);
        this.writeVersion = this.writeVersion.bind(this);

        this.state = {
            open: false
        };

    }

    public componentDidMount(): void {

        this.handleVersionState()
            .catch( err => log.error("Unable to read version: ", err));

    }

    public render() {

        // noinspection TsLint
        return (
            <WhatsNewModal open={this.state.open} accept={() => this.hide()}/>
        );
    }

    private hide(): void {
        this.setState({open: false});
    }

    private async handleVersionState() {

        const isNewVersion = await this.isNewVersion();

        this.setState({
            open: isNewVersion
        });

        await this.writeVersion();

    }

    private async isNewVersion(): Promise<boolean> {

        // TODO: migrate this to use a LocalSettings component
        //
        //

        const path = WhatsNewComponent.getDataPath();

        if (await Files.existsAsync(path)) {

            const data = await Files.readFileAsync(path);
            const versionData: VersionData = JSON.parse(data.toString("utf-8"));

            log.info("Got version data: ", versionData);

            return Version.get() !== versionData.version;

        } else {
            // file doesn't exist.. obviously new data.
            return true;
        }

    }

    private async writeVersion() {

        const path = WhatsNewComponent.getDataPath();

        const versionData: VersionData = {version: Version.get()};

        log.info("Writing version data to: " + path);

        await Files.writeFileAsync(path, JSON.stringify(versionData));

    }

    private static getDataPath() {

        // TODO: this is a major major hack but the renderer has no reliable way
        // to get the userData path from the renderer. In the future I need to
        // migrate to cookies for this...
        const userData = require('electron').remote.app.getPath('userData');

        return FilePaths.join(userData, 'whats-new.json');
    }

}

interface IProps {
}

interface IState {
    open: boolean;
}

interface VersionData {
    version?: string;
}

