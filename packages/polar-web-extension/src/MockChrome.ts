export namespace MockChrome {

    export interface IOPChromeRuntimeSendMessageInteraction {
        op: 'chrome.runtime.sendMessage',
        message: any
    }

    export interface IOPChromeTabsSendMessageInteraction {
        op: 'chrome.tabs.sendMessage',
        id: number,
        message: any
    }

    export type IOPChromeInteraction = IOPChromeRuntimeSendMessageInteraction | IOPChromeTabsSendMessageInteraction;

    export type IChrome = any;

    export function createChrome(): [ReadonlyArray<IOPChromeInteraction>, IChrome] {

        const interactions: IOPChromeInteraction[] = [];

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
