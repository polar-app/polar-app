export interface ConfirmProps {

    readonly title: string;
    readonly subtitle: string | JSX.Element;
    readonly onCancel?: () => void;
    readonly onConfirm: () => void;
    readonly type?: 'danger' | 'error' | 'warning' | 'success' | 'info';
    readonly noCancel?: boolean;

}
