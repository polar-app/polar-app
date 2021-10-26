
export function trace(message?: any, ...optionalParams: readonly any[]) {

    const enabled = true;

    if (enabled) {
        console.log(message, ...optionalParams);
    }

}
