export namespace MockChrome {

    export function createChrome() {

        interface IOPChromeRuntimeSendMessageInteraction {
            op: 'chrome.runtime.sendMessage',
            message: any
        }

        interface IOPChromeTabsSendMessageInteraction {
            op: 'chrome.tabs.sendMessage',
            id: number,
            message: any
        }

        type IOPChromeInteraction = IOPChromeRuntimeSendMessageInteraction | IOPChromeTabsSendMessageInteraction;

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

    export function createChromeAndInject() {

        const [interactions, chrome] = MockChrome.createChrome();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).chrome = chrome;

        return interactions;

    }

}
