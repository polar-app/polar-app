declare module '@trendmicro/react-dropdown' {

    export default class Dropdown extends React.Component<any, any, any> {

        public readonly onSelect: (eventKey: any) => void;
        public readonly children?: any;

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

