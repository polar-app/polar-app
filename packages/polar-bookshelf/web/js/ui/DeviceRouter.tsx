import * as React from 'react';
import {Device, Devices} from "../util/Devices";

export class DeviceRouter extends React.Component<IProps> {

    private readonly device: Device;

    constructor(props: IProps, context: any) {
        super(props, context);
        this.device = Devices.get();
    }

    public render() {

        switch (this.device) {

            case "phone":
                return this.props.phone || this.props.handheld || null;
            case "tablet":
                return this.props.tablet || this.props.handheld || null;
            case "desktop":
                return this.props.desktop || null;
            default:
                return null;

        }

    }

    public static Desktop = (props: any) => {

        if (Devices.isDesktop()) {
            return props.children;
        } else {
            return null;
        }

    };

    public static Handheld = (props: any) => {

        if (Devices.isPhone() || Devices.isTablet()) {
            return props.children;
        } else {
            return null;
        }

    }


}

export interface IProps {

    readonly handheld?: React.ReactElement | null;

    readonly phone?: React.ReactElement | null;

    readonly tablet?: React.ReactElement | null;

    readonly desktop?: React.ReactElement | null;

}
