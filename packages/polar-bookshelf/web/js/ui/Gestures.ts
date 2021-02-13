export class Gestures {

}

const DISABLER = (e: Event) => {
    e.preventDefault();
};

export class PinchToZoom {

    public static enable() {
        document.addEventListener('gesturestart', DISABLER);
    }


    public static disable() {
        // document.removeEventListener('gesturestart', DISABLER);
    }

}
