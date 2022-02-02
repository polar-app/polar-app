/**
 * 
 * This is a partial reflection of @google-cloud/language types
 * helps us avoid adding the entirety of @google-cloud/language as a depedency in this module
 * 
 */

export namespace GCL {

    /** Properties of an AnalyzeEntitySentimentResponse. */
    export interface IAnalyzeEntitySentimentResponse {

        /** AnalyzeEntitySentimentResponse entities */
        readonly entities?: (ReadonlyArray<IEntity>|null);

        /** AnalyzeEntitySentimentResponse language */
        readonly language?: (string|null);
    }


    /** Properties of an Entity. */
    export interface IEntity {

        /** Entity name */
        readonly name?: (string|null);

        /** Entity type */
        readonly type?: (Entity.Type|keyof typeof Entity.Type|null);

        /** Entity metadata */
        readonly metadata?: ({ [k: string]: string }|null);

        /** Entity salience */
        readonly salience?: (number|null);

        /** Entity mentions */
        readonly mentions?: (ReadonlyArray<IEntityMention>|null);

        /** Entity sentiment */
        readonly sentiment?: (ISentiment|null);
    }

    export namespace Entity {
        /** Type enum. */
        export enum Type {
            UNKNOWN = 0,
            PERSON = 1,
            LOCATION = 2,
            ORGANIZATION = 3,
            EVENT = 4,
            WORK_OF_ART = 5,
            CONSUMER_GOOD = 6,
            OTHER = 7,
            PHONE_NUMBER = 9,
            ADDRESS = 10,
            DATE = 11,
            NUMBER = 12,
            PRICE = 13
        }
    }

    /** Properties of a Sentiment. */
    export interface ISentiment {

        /** Sentiment magnitude */
        readonly magnitude?: (number|null);

        /** Sentiment score */
        readonly score?: (number|null);
    }

    /** Properties of an EntityMention. */
    export interface IEntityMention {

        /** EntityMention text */
        readonly text?: (ITextSpan|null);

        /** EntityMention type */
        readonly type?: (EntityMention.Type|keyof typeof EntityMention.Type|null);

        /** EntityMention sentiment */
        readonly sentiment?: (ISentiment|null);
    }
    
    export namespace EntityMention {

        /** Type enum. */
        export enum Type {
            TYPE_UNKNOWN = 0,
            PROPER = 1,
            COMMON = 2
        }
    }

    /** Properties of a TextSpan. */
    export interface ITextSpan {

        /** TextSpan content */
        readonly content?: (string|null);

        /** TextSpan beginOffset */
        readonly beginOffset?: (number|null);
    }
}