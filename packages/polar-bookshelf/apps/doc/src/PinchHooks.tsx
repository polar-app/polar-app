import React from "react";

interface IGestureZoomProps {
    elemRef: React.RefObject<HTMLDivElement>;
    onZoom: (scale: number) => void;
    shouldUpdate: (scale: number) => boolean;
}

export type UsePinchMoveHandler = (arg: { delta: number, initial: [number, number] }) => void;

export const FakePinchToZoom: React.FC<IGestureZoomProps> = ({
    elemRef,
    shouldUpdate,
    onZoom,
}) => {
    const pinchingRef = React.useRef<boolean>(false);
    const zoomRef = React.useRef(1);

    const onMove: UsePinchMoveHandler = ({ delta }) => {
        const elem = elemRef.current!;
        const newScale = zoomRef.current + (delta / window.innerWidth);
        if (!shouldUpdate(newScale)) {
            return;
        }
        zoomRef.current = newScale;

        if (!pinchingRef.current) {
            const { top } = elem.getBoundingClientRect();
            elem.style.transformOrigin = `50% ${top * -1}px`;
            pinchingRef.current = true;
        }
        elem.style.transform = `scale(${newScale})`;
    };
    const onFinish = () => {
        const elem = elemRef.current!;
        pinchingRef.current = false;
        elem.removeAttribute('style');
        onZoom(zoomRef.current);
        zoomRef.current = 1;
    };

    usePinch({ elem: elemRef.current, onMove, onFinish });

    return null;
};

type UsePinchConfig = {
    elem: HTMLElement | null;
    onMove: UsePinchMoveHandler;
    onFinish: () => void;
};

export const usePinch = ({ elem, onMove, onFinish }: UsePinchConfig) => {

    React.useEffect(() => {
        if (!elem) {
            return;
        }
        let startX = 0, startY = 0;
        let initialDelta = 0;
        let prevDelta = 0;

        const reset = () => {
            startX = startY = initialDelta = 0;
        };

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                startX = (e.touches[0].pageX + e.touches[1].pageX) / 2;
                startY = (e.touches[0].pageY + e.touches[1].pageY) / 2;
                initialDelta = Math.hypot(
                    (e.touches[1].pageX - e.touches[0].pageX),
                    (e.touches[1].pageY - e.touches[0].pageY)
                );
                prevDelta = initialDelta;
            } else {
                initialDelta = 0;
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            if (initialDelta <= 0 || e.touches.length < 2) {
                return;
            }
            e.preventDefault();

            const delta = Math.hypot(
                (e.touches[1].pageX - e.touches[0].pageX),
                (e.touches[1].pageY - e.touches[0].pageY)
            );

            onMove({ delta: delta - prevDelta, initial: [startX, startY] });
            prevDelta = delta;
        };

        const onTouchEnd = (_: TouchEvent) => {
            if (initialDelta <= 0) {
                return;
            }

            onFinish();
            reset();
        };

        elem.addEventListener("touchstart", onTouchStart);
        elem.addEventListener("touchmove", onTouchMove, { passive: false });
        elem.addEventListener("touchend", onTouchEnd);

        return () => {
            elem.removeEventListener("touchstart", onTouchStart);
            elem.removeEventListener("touchmove", onTouchMove);
            elem.removeEventListener("touchend", onTouchEnd);
        };
    }, [elem, onFinish, onMove]);
}
