
export function trace(message?: any, ...optionalParams: any[]) {

    const enabled = true;

    if (enabled) {
        console.log(message, ...optionalParams);
    }

}
