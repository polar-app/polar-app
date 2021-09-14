import * as stopwords from 'stopword';

export namespace Stopwords {

    export type StopwordsLang = 'af' | 'ar' | 'bn' | 'br' | 'da' | 'de' | 'en' | 'es' | 'fa' | 'fr' |
        'fi' | 'ha' | 'he' | 'hi' | 'id' | 'ja' | 'lgg' | 'lggo' |
        'my' | 'nl' | 'no' | 'pa' | 'pl' | 'pt' | 'ru' | 'so' | 'st' | 'sv' |
        'sw' |
        'vi' |
        'yo' |
        'zh' |
        'zu';


    export function words(lang: StopwordsLang) {
        return stopwords[lang];
    }

    export function removeStopwords(words: ReadonlyArray<string>, stops: ReadonlyArray<string>) {
        return stopwords.removeStopwords([...words], [...stops]);
    }

}
