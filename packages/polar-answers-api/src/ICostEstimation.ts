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

/**
 * Holds the cost estimation in a cost_estimation variable.  This is not part of the OpenAI spec but we want
 * to return these results in our clients.
 */
export interface ICostEstimationHolder<C extends ICostEstimation> {
    // eslint-disable-next-line camelcase
    readonly cost_estimation: C;
}
