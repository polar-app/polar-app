import { CIDProvider } from './CIDProvider';
export declare class CIDProviders {
    static getInstance(): CIDProvider | null;
    static setInstance(provider: CIDProvider): void;
}
