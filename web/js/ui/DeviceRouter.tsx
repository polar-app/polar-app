import * as React from 'react';
import {Device, Devices} from "polar-shared/src/util/Devices";
import isEqual from 'react-fast-compare';

export interface IProps {

    readonly handheld?: React.ReactNode | null;

    readonly phone?: React.ReactNode | null;

    readonly tablet?: React.ReactNode | null;

    readonly desktop?: React.ReactNode | null;

}

interface IChildrenProps {
    readonly children: React.ReactElement | null;
}

export class DeviceRouter extends React.Component<IProps> {

    private readonly device: Device;

    constructor(props: IProps, context: any) {
        super(props, context);
        this.device = Devices.get();
    }

    shouldComponentUpdate(nextProps: Readonly<IProps>, nextState: Readonly<{}>): boolean {
        // the device will never change so all we care about is props
        return ! isEqual(this.props, nextProps);
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

    /**
     * @Deprecated use DeviceRouters.Desktop
     */
    public static Desktop = React.memo((props: IChildrenProps) => {

        if (Devices.isDesktop()) {
            return props.children;
        } else {
            return null;
        }

    }, isEqual);

    /**
     * @Deprecated use DeviceRouters.Handheld
     */
    public static Handheld = React.memo((props: IChildrenProps) => {

        if (Devices.isPhone() || Devices.isTablet()) {
            return props.children;
        } else {
            return null;
        }

    }, isEqual);

}

export namespace DeviceRouters {

    export function createAccepts(acceptedDevices: ReadonlyArray<Device>) {

        return React.memo((props: IChildrenProps) => {
            const device = Devices.get();

            if (acceptedDevices.includes(device)) {
                return props.children;
            }

            return null;

        });


    }

    /**
     * HOC that creates a component that accepts the given list of devices.
     */
    function createRejects(rejectedDevices: ReadonlyArray<Device>) {

        return React.memo((props: IChildrenProps) => {
            const device = Devices.get();

            if (! rejectedDevices.includes(device)) {
                return props.children;
            }

            return null;

        });

    }

    export const Handheld = createAccepts(['phone', 'tablet']);
    export const Phone = createAccepts(['phone']);
    export const Tablet = createAccepts(['tablet']);
    export const Desktop = createAccepts(['desktop']);

    export const NotHandheld = createRejects(['phone', 'tablet']);
    export const NotPhone = createRejects(['phone']);
    export const NotTablet = createRejects(['tablet']);
    export const NotDesktop = createRejects(['desktop']);

}
