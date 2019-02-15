declare module '@trendmicro/react-dropdown' {

    export default class Dropdown extends React.Component<DropdownProps, any, any> {


    }

    export interface DropdownProps {

        readonly onSelect: (eventKey: any) => void;
        readonly defaultOpen?: boolean;
        readonly open?: boolean;
        readonly children?: any;

    }

    export class DropdownToggle extends React.Component<any, any, any> {

    }

    export class DropdownMenu extends React.Component<any, any, any> {

    }

    export class DropdownMenuWrapper extends React.Component<any, any, any> {

    }

    export class MenuItem extends React.Component<any, any, any> {
        public readonly onSelect: (eventKey: any) => void;

    }

    export class DropdownButton extends React.Component<any, any, any> {

    }

}

