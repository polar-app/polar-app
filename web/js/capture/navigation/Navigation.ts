import {ISimpleReactor, SimpleReactor} from '../../reactor/SimpleReactor';

export interface Navigation {

    readonly navigated: ISimpleReactor<NavigatedEvent>;
    readonly captured: ISimpleReactor<CapturedEvent>;

}

export class DefaultNavigation implements Navigation {

    public readonly navigated = new SimpleReactor<NavigatedEvent>();

    public readonly captured = new SimpleReactor<CapturedEvent>();

}

/**
 * Represents the navigation to a new URL.
 */
export interface NavigatedEvent {
    url: string;
}

export interface CapturedEvent {

    /**
     * The current URL that is being captured.
     */
    url: string;

}

export type NavigatedEventListener = (event: NavigatedEvent) => void;

export type CapturedEventListener = (event: CapturedEvent) => void;



