import React from 'react';
import {ipcRenderer} from "electron";
import Button from '@material-ui/core/Button';

// FIXME: this won't look right in MUI
export function RestartForUpdateButton() {

    return (

        <div style={{
            width: '500px',
            position: 'fixed',
            right: 10,
            bottom: 10,
            zIndex: 9999,
        }}
             className="border rounded shadow p-3 m-2 text-white bg-dark">

            <div style={{
                display: 'flex',
                verticalAlign: 'middle'
            }}
                 className="mb-3">

                <div className="mr-3 text-success mt-auto mb-auto">

                    <i style={{fontSize: '50px'}} className="fas fa-check"></i>

                </div>

                <div className="mt-1 mb-1">

                    <div className="mb-1" style={{fontSize: '18px'}}>
                        <b>Update available.</b> Please restart.
                    </div>

                    <div className="mt-1 mb-1 h6">
                        An update was downloaded and ready to be
                        installed. Please restart to install the latest
                        version.
                    </div>

                </div>

            </div>

            <div>

                <div className="text-center text-white">
                    <Button
                        onClick={() => ipcRenderer.send('app-update:quit-and-install')}
                        size="large"
                        variant="contained"
                        color="primary">
                        Restart
                    </Button>
                </div>

            </div>

        </div>

    );
}
