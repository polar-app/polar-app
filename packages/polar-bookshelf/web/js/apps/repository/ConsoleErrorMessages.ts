export namespace ConsoleErrorMessages {

    export function isExpected(message: string): string | undefined {

        const expectations: ReadonlyArray<string> = [
            "@firebase/firestore:", // this is a hack but I don't care
            "@firebase/firestore: Firestore (8.10.0): You are overriding the original host. If you did not intend to override your settings, use {merge: true}.",
            "Material-UI: The `css` function is deprecated. Use the `styleFunctionSx` instead.",
            'Warning: React.createFactory() is deprecated and w…SX or use React.createElement() directly instead.',
            'Warning: forwardRef render functions accept exactly two parameters: props and ref. %s',
            'Not registering service worker - localhost/webpack-dev-server',
            "Warning: React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.",
            "Material-UI: useResizeContainer - The parent of the grid has an empty height."
        ];

        for (const current of expectations) {
            if (message.indexOf(current) !== -1) {
                return current;
            }
        }

        return undefined;

    }

}
