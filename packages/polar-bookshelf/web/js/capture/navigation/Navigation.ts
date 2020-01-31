import {ISimpleReactor, SimpleReactor} from '../../reactor/SimpleReactor';
import {QueuedReactor} from '../../reactor/QueuedReactor';

export interface Navigation {

    readonly navigated: ISimpleReactor<NavigatedEvent>;
    readonly captured: ISimpleReactor<CapturedEvent>;

}

export class DefaultNavigation implements Navigation {

    public readonly navigated
        = new SimpleReactor<NavigatedEvent>(new QueuedReactor());

    public readonly captured
        = new SimpleReactor<CapturedEvent>(new QueuedReactor());

}

/**
 * Represents the navigation to a new URL.
 */
export interface NavigatedEvent {
    link: string;
}

export interface CapturedEvent {

}

export type NavigatedEventListener = (event: NavigatedEvent) => void;

export type CapturedEventListener = (event: CapturedEvent) => void;



