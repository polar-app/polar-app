import {Devices} from "polar-shared/src/util/Devices";
import React from "react";
import {debounce} from "throttle-debounce";
import {useRefWithUpdates} from "../../../../../web/js/hooks/ReactHooks";
import {useDocViewerCallbacks, useDocViewerStore} from "../../DocViewerStore";
import {useFakePinchToZoom} from "../../PinchHooks";
import {ScaleLevelTuple, ScaleLevelTuples} from "../../ScaleLevels";

type UseElemWidthChangedOpts = {
    readonly threshold?: number;
    readonly elemRef: React.RefObject<HTMLElement>;
};

export const useElemWidthChanged = (callback: () => void, opts: UseElemWidthChangedOpts) => {
    const {threshold = 5, elemRef} = opts;
    const oldWidthRef = React.useRef<number>(window.innerWidth);
    useResizeObserver(debounce(100, React.useCallback(({ contentRect: { width } }) => {
        if (Math.abs(oldWidthRef.current - width) > threshold) {
            oldWidthRef.current = width;
            callback();
        }
    }, [oldWidthRef, callback, threshold])), elemRef);
};

type UseResizeObserverCallback = (entry: ResizeObserverEntry) => void;

export const useResizeObserver = (callback: UseResizeObserverCallback, elemRef: React.RefObject<HTMLElement>) => {
    const callbackRef = useRefWithUpdates<UseResizeObserverCallback>(callback);

    React.useLayoutEffect(() => {
        if (!elemRef.current) {
            return;
        }
        let resizeObserver = new ResizeObserver(([entry]) => {
            callbackRef.current(entry);
        });
        resizeObserver.observe(elemRef.current);
        return () => {
            resizeObserver.disconnect();
        };
    }, [elemRef, callbackRef]);
};

interface IUsePDFPinchToZoomArgs {
    readonly containerRef: React.RefObject<HTMLElement>; 
    readonly wrapperRef: React.RefObject<HTMLElement>; 
}

export const usePDFPinchToZoom = ({ containerRef, wrapperRef }: IUsePDFPinchToZoomArgs) => {
    const {docScale} = useDocViewerStore(['docScale']);
    const {setScale} = useDocViewerCallbacks();
    const initialScale = React.useRef<number>();

    React.useEffect(() => {
        if (docScale && docScale?.scale.value === "page-width") {
            initialScale.current = docScale.scaleValue;
        }
    }, [docScale]);

    useElemWidthChanged(() => {
        const devices = Devices.get();
        if (~["phone", "tablet"].indexOf(devices)) {
            setScale(ScaleLevelTuples[1])
        }
    }, { elemRef: wrapperRef, threshold: 200 });

    const shouldUpdate = React.useCallback((zoom: number): boolean => {
        const min = initialScale.current!, max = 4;
        const scale = docScale!.scaleValue * zoom;
        return (scale >= min || zoom > 1) && (scale <= max || zoom < 1);
    }, [docScale, initialScale]);

    const onZoom = React.useCallback((zoom: number): void => {
        const newScale = zoom * docScale!.scaleValue;
        const newScaleLevel: ScaleLevelTuple = {
            label: `${Math.round(newScale * 100)}%`,
            value: `${newScale}`,
        };
        setScale(newScaleLevel);
    }, [docScale, setScale]);

    useFakePinchToZoom({
        onZoom,
        shouldUpdate: shouldUpdate,
        elemRef: containerRef,
        wrapperRef: wrapperRef,
        enabled: !! initialScale,
    });
};
