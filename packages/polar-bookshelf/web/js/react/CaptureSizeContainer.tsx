import * as React from 'react';
import { IDimensions } from 'polar-shared/src/util/IDimensions';

interface IProps {
    readonly children: JSX.Element;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

export type CapturedSizeCalculator = () => IDimensions;

const Context = React.createContext<CapturedSizeCalculator | undefined>(undefined);

export const CaptureSizeContainer = (props: IProps) => {

    const [mounted, setMounted] = React.useState(false);

    const elementRef = React.useRef<HTMLDivElement>();

    const handleRef = React.useCallback((element: HTMLDivElement) => {
        elementRef.current = element;
        setMounted(true)
    }, []);

    const calculator = React.useCallback(() => {
        const width = elementRef.current!.clientWidth;
        const height = elementRef.current!.clientHeight;

        return {
            width, height
        };
    }, []);

    return (
        <Context.Provider value={calculator}>
            <div ref={handleRef}
                 style={props.style}
                 className={props.className}>
                {mounted && props.children}
            </div>
        </Context.Provider>
    );
}

export function useCaptureSizeCalculator() {
    return React.useContext(Context)!;
}