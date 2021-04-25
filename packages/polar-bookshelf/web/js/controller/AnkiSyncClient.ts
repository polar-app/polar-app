export namespace AnkiSyncClient {
    export function start() {
        window.postMessage({type: 'start-anki-sync'}, '*');
    }
}
