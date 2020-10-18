import * as React from 'react';
import {DefaultPageLayout} from "../page_layout/DefaultPageLayout";
import {ExtendedDeviceInfo} from "../repo_header/DeviceInfo";

interface IProps {
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
