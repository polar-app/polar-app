export interface Service extends StartableService, StoppableService{

}

export interface StoppableService {

    stop(): void;

}

export interface StartableService {

    start(): Promise<void>;

}
