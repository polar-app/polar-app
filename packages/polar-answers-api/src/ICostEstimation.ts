import {AIModel} from "./AIModel";

/**
 * US dollar cost as a floating point of dollars and cents.
 */
export type USD = number;

export interface ICostEstimation {
    readonly tokens: number;
    readonly cost: USD;
}

export interface ICostEstimationWithModel extends ICostEstimation {
    readonly model: AIModel;
}

export interface IAnswersCostEstimation extends ICostEstimation {
    readonly search: ICostEstimationWithModel,
    readonly completion: ICostEstimationWithModel;
}
