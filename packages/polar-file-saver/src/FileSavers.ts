import filesaver from 'file-saver';

/**
 * FileSaver interface for saving data to disk.
 *
 * https://github.com/eligrey/FileSaver.js
 */
export namespace FileSavers {

    /**
     * Trigger a file download using the specified filename and blob.
     */
    export function saveAs(blob: Blob | string | File, filename: string) {
        filesaver.saveAs(blob, filename);
    }

    /**
     * An alternative mechanism that use link click.
     */
    export function downloadURL(url: string, name: string) {

        const link = document.createElement("a");
        link.download = name;
        link.href = url;
        document.body.appendChild(link);

        try {
            link.click();
        } finally {
            document.body.removeChild(link);
        }
    }

}
