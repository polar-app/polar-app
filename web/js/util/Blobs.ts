export class Blobs {

    public static async toArrayBuffer(blob: Blob): Promise<ArrayBuffer> {

        return new Promise<ArrayBuffer>((resolve, reject) => {

            const reader = new FileReader();

            reader.addEventListener("loadend", () => {
                // reader.result contains the contents of blob as a typed array
                resolve(<ArrayBuffer> reader.result);
            });

            reader.addEventListener("error", (err) => {
                // reader.result contains the contents of blob as a typed array
                reject(err);
            });

            reader.readAsArrayBuffer(blob);

        });

    }

    public static async toText(blob: Blob): Promise<string> {

        return new Promise<string>((resolve, reject) => {

            const reader = new FileReader();

            reader.addEventListener("loadend", () => {
                // reader.result contains the contents of blob as a typed array
                resolve(<string> reader.result);
            });

            reader.addEventListener("error", (err) => {
                // reader.result contains the contents of blob as a typed array
                reject(err);
            });

            reader.readAsText(blob);

        });

    }


}
