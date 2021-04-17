import {AlertType, ConfirmDialogProps} from "../../ui/dialogs/ConfirmDialog";
import {DialogManager} from "../dialogs/MUIDialogController";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";

export namespace MUIDeleteAction {

    export interface IProps {

        readonly title: string;
        readonly subtitle: string | JSX.Element;
        readonly type?: AlertType;
        readonly onCancel?: Callback;
        readonly onAccept: Callback;
    }

    export function create(props: IProps) {

        return (dialogs: DialogManager) => {

            const dialogProps: ConfirmDialogProps = {
                title: props.title,
                subtitle: props.subtitle,
                type: props.type || 'danger',
                onCancel: props.onCancel || NULL_FUNCTION,
                onAccept: props.onAccept
            };

            dialogs.confirm(dialogProps);

        };

    }

}

