export namespace Karma {

    export function isKarma() {
        return typeof window !== "undefined" && (window as any).__karma__ !== undefined;
    }

}
