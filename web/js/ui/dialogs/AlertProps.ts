import * as React from "react";

export interface AlertProps {

    readonly title: string;
    readonly body: string | React.ReactElement;
    readonly onConfirm: () => void;
    readonly type?: 'danger' | 'warning' | 'success' | 'info';

}
