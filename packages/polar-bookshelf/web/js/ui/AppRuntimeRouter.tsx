import * as React from 'react';
import {AppRuntime, AppRuntimeID} from "polar-shared/src/util/AppRuntime";

export class AppRuntimeRouter extends React.Component<IProps> {

    private readonly runtime: AppRuntimeID;

    constructor(props: IProps, context: any) {
        super(props, context);
        this.runtime = AppRuntime.get();
    }

    public render() {

        switch (this.runtime) {
            case "electron":
                return this.props.electron || null;
            case "browser":
                return this.props.browser || null;
            default:
                return null;
        }

    }

    public static Electron = (props: any) => {

        if (AppRuntime.isElectron()) {
            return props.children;
        } else {
            return null;
        }

    };

    public static Browser = (props: any) => {

        if (AppRuntime.isBrowser()) {
            return props.children;
        } else {
            return null;
        }

    }


}

export interface IProps {

    readonly browser?: React.ReactElement | null;

    readonly electron?: React.ReactElement | null;

}
