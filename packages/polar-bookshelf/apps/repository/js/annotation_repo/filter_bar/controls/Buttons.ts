

export interface ButtonProps {
    readonly outline: boolean;
    readonly color: 'primary' | 'secondary' | 'light' | 'clear';
}

const buttonActive: ButtonProps = {
    outline: true,
    color: 'primary'
};

const buttonInactive: ButtonProps = {
    outline: false,
    color: 'clear'
};

export class Buttons {

    public static activeProps(active: boolean): ButtonProps {
        return active ? buttonActive : buttonInactive;
    }

}
