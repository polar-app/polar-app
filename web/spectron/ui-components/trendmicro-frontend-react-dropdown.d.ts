
declare module '@trendmicro/react-dropdown' {

    export default class Dropdown extends React.Component<DropdownProps> {


    }

    export interface DropdownProps {

        // TODO: not sure about the event object yet.
        readonly onSelect?: (eventKey: number) => void;
        readonly onToggle?: (open: boolean) => void;

        // TODO: not sure about the event object yet.
        readonly onClose?: () => void;
        readonly defaultOpen?: boolean;
        readonly open?: boolean;
        readonly dropup?: boolean;
        readonly autoOpen?: boolean;
        readonly pullRight?: boolean;
        readonly role?: string;
        readonly rootcloseEvent?: RootCloseEvent;

        readonly children?: any;

    }

    export class DropdownToggle extends React.Component<DropdownToggleProps> {

    }

    export interface DropdownToggleProps {

        readonly btnSize?: 'lg' | 'md' | 'sm' | 'xs';

        readonly btnStyle?: 'default' | 'primary' | 'emphasis' | 'flat' | 'link';

        readonly noCaret?: boolean;

        readonly disabled?: boolean;

        readonly title?: string;

        readonly children?: any;

    }

    export class DropdownMenu extends React.Component<DropdownMenuProps> {

    }

    export interface DropdownMenuProps {

        readonly onSelect?: (eventKey: number) => void;

        // TODO: not sure about the event object yet.
        readonly onClose?: () => void;

        readonly rootcloseEvent?: RootCloseEvent;

        readonly children?: any;

    }

    export class DropdownMenuWrapper extends React.Component<any, any, any> {

    }

    export class MenuItem extends React.Component<MenuItemProps> {
    }

    export interface MenuItemProps {
        readonly onClose?: () => void;
        readonly onSelect?: (eventKey: number) => void;
        readonly eventKey?: number;
        readonly header?: boolean;
        readonly disabled?: boolean;
        readonly divider?: boolean;
        readonly active?: boolean;
        readonly title?: string;

        /**
         * Whether or not the dropdown submenu is visible.
         */
        readonly open?: boolean;


    }

    export class DropdownButton extends React.Component<any, any, any> {

    }

    export type RootCloseEvent = 'click' | 'mousedown';

}
