export namespace Base16 {

    export function encode(data: string): string {

        const te = new TextEncoder();
        const bytes = te.encode(data);
        return [...bytes]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('');

    }

}
