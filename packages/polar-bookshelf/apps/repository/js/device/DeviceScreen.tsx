import * as React from 'react';
import {PersistenceLayerController} from '../../../../web/js/datastore/PersistenceLayerManager';
import {PersistenceLayerProvider} from "../../../../web/js/datastore/PersistenceLayer";
import {DefaultPageLayout} from "../page_layout/DefaultPageLayout";
import {ExtendedDeviceInfo} from "../repo_header/DeviceInfo";

interface IProps {
    readonly persistenceLayerProvider: PersistenceLayerProvider;
    readonly persistenceLayerController: PersistenceLayerController;
}

export const DeviceScreen = (props: IProps) => (

    <DefaultPageLayout {...props}>

        <div className=" text-lg">

            <div className="">
                <h2>Device</h2>

                <p>
                    Information about the user's current device.
                </p>

                <div className="mt-1">
                    <ExtendedDeviceInfo/>
                </div>

            </div>

        </div>

    </DefaultPageLayout>

);
