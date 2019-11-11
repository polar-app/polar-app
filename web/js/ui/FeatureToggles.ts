const PREFIX = 'feature:';

export class FeatureToggles {

    public static isEnabled(name: string) {
        return localStorage.getItem(PREFIX + name) === 'true';
    }

    public static enable(name: string) {
        localStorage.setItem(PREFIX + name, 'true');
    }

    public static disable(name: string) {
        localStorage.removeItem(PREFIX + name);
    }

    public static toggle(name: string) {
        if (this.isEnabled(name)) {
            this.disable(name);
        } else {
            this.enable(name);
        }
    }

}
