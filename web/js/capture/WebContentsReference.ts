export interface WebContentsReference {

    readonly webContents: Electron.WebContents;

    /**
     * Destroy this reference including any windows it created or other
     * resources.
     */
    destroy(): void;

}
