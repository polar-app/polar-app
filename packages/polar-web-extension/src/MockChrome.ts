export namespace MockChrome {

    export interface IOPChromeRuntimeSendMessageInteraction {
        readonly op: 'chrome.runtime.sendMessage',
        readonly message: any
    }

    export interface IOPChromeTabsSendMessageInteraction {
        readonly op: 'chrome.tabs.sendMessage',
        readonly id: number,
        readonly message: any
    }

    export interface IOPChromeTabsUpdateInteraction {
        readonly op: 'chrome.tabs.update',
        readonly id: number,
        readonly updateProperties: any
    }

    export type IOPChromeInteraction = IOPChromeRuntimeSendMessageInteraction | IOPChromeTabsSendMessageInteraction | IOPChromeTabsUpdateInteraction;

    export type IChrome = any;

    export function createChrome(): readonly [ReadonlyArray<IOPChromeInteraction>, IChrome] {

        const interactions: readonly IOPChromeInteraction[] = [];

        const chrome = {
            runtime: {
                onMessage: {
                    addListener: () => console.log('MOCK chrome: addListener called'),
                    removeListener: () => console.log('MOCK chrome: removeListener called')
                },
                sendMessage: (message: any) => {
                    console.log("MOCK chrome: chrome.runtime.sendMessage: ", message);
                    interactions.push({op: 'chrome.runtime.sendMessage', message});
                }
            },
            tabs: {
                sendMessage: (id: number, message: any) => {
                    console.log("MOCK chrome: chrome.tabs.sendMessage: ", message);
                    interactions.push({op: 'chrome.tabs.sendMessage', id, message});
                },
                query: (query: any, callback: (tabs: ReadonlyArray<any>) => void) => {
                    // eslint-disable-next-line node/no-callback-literal
                    callback([
                        {
                            active: true,
                            id: 1
                        }
                    ])
                },
                update: (id: number, updateProperties: any) => {
                    interactions.push({op: 'chrome.tabs.update', id, updateProperties});
                }
            }
        }

        return [interactions, chrome]

    }

    export function createChromeAndInject(): ReadonlyArray<IOPChromeInteraction> {

        const win = window as any;

        if (win.chrome) {
            // this is already defined...
            // purge the interactions for the next test.
            win.chromeInteractions.splice();
            return win.chromeInteractions;
        }

        const [chromeInteractions, chrome] = MockChrome.createChrome();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        win.chrome = chrome;
        win.chromeInteractions = chromeInteractions;

        return chromeInteractions;

    }

}
