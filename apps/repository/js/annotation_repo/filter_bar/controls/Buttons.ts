

export interface ButtonProps {
    readonly outline: boolean;
    readonly color: 'primary' | 'light';
}

const buttonActive: ButtonProps = {
    outline: true,
    color: 'primary'
};

const buttonInactive: ButtonProps = {
    outline: false,
    color: 'light'
};

export class Buttons {

    public static activeProps(active: boolean): ButtonProps {
        return active ? buttonActive : buttonInactive;
    }

}
