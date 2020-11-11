import { AsyncOptions } from 'react-async';
export declare function useComponentDidMount(delegate: () => void): void;
export declare function useComponentWillUnmount(delegate: () => void): void;
export declare function useAsyncWithError<T>(opts: AsyncOptions<T>): T | undefined;
