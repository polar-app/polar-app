import React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap';
import {ExportFormat} from '../../metadata/exporter/Exporters';
import {remote} from 'electron';
import {AppRuntime} from '../../AppRuntime';
import {Logger} from "polar-shared/src/logger/Logger";

const log = Logger.create();

export class ExportButton extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.doExport = this.doExport.bind(this);

    }

    public render() {

        return (
            <div>

                <UncontrolledDropdown direction="down"
                                      hidden={AppRuntime.isBrowser()}
                                      className="mt-auto mb-auto"
                                      size="md">

                    <DropdownToggle color="secondary" caret>

                        <i className="fas fa-file-export" style={{ marginRight: '5px' }}/>

                    </DropdownToggle>

                    <DropdownMenu className="shadow">
                        <DropdownItem onClick={() => this.doExport('markdown')}>Markdown</DropdownItem>
                        <DropdownItem onClick={() => this.doExport('json')}>JSON</DropdownItem>
                    </DropdownMenu>

                </UncontrolledDropdown>

            </div>

        );

    }

    private toExtension(format: ExportFormat) {

        switch (format) {
            case 'markdown':
                return 'md';
            case 'html':
                return 'html';
            case 'json':
                return 'json';
        }

    }

    private doExport(format: ExportFormat) {

        const ext = this.toExtension(format);

        const opts: Electron.SaveDialogOptions = {

            title: "Export to " + format,
            filters: [
                {extensions: [ext], name: format}
            ]

        };

        const doSaveViaDialog = async () => {

            const saveDialogResult = await remote.dialog.showSaveDialog(opts);

            if (saveDialogResult.canceled) {
                return;
            }

            if (! saveDialogResult.filePath) {
                return;
            }

            if (! this.props.onExport) {
                return;
            }

            this.props.onExport(saveDialogResult.filePath, format);

        };

        doSaveViaDialog()
            .catch(err => log.error("Unable to save: ", err));

    }

}

interface IProps {
    readonly onExport?: (path: string, format: ExportFormat) => void;
}

interface IState {
}

