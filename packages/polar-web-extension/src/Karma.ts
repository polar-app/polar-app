export namespace Karma {

    export function isKarma() {
        return (window as any).__karma__ !== undefined;
    }
}
