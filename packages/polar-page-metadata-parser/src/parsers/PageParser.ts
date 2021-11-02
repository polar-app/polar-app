const { makeUrlAbsolute, parseUrl } = require("./url-utils");

function getProvider(host: string) {
    return host
        .replace(/www[a-zA-Z0-9]*\./, "")
        .replace(".co.", ".")
        .split(".")
        .slice(0, -1)
        .join(" ");
}

function buildRuleSet(ruleSet: RuleSet) {
    return (doc: Document, context: Context) => {
        let maxScore = 0;
        let maxValue;

        for (let currRule = 0; currRule < ruleSet.rules.length; currRule++) {
            const [query, handler] = ruleSet.rules[currRule];

            const elements = Array.from(doc.querySelectorAll<HTMLElement>(query));

            if (elements.length) {
                for (const element of elements) {
                    let score = ruleSet.rules.length - currRule;

                    if (ruleSet.scorers) {
                        for (const scorer of ruleSet.scorers) {
                            const newScore = scorer(element, score);

                            if (newScore) {
                                score = newScore;
                            }
                        }
                    }

                    if (score > maxScore) {
                        maxScore = score;
                        maxValue = handler(element);
                    }
                }
            }
        }

        if (!maxValue && ruleSet.defaultValue) {
            maxValue = ruleSet.defaultValue(context);
        }

        if (maxValue) {
            if (ruleSet.processors) {
                for (const processor of ruleSet.processors) {
                    maxValue = processor(maxValue, context);
                }
            }

            if (maxValue.trim) {
                maxValue = maxValue.trim();
            }

            return maxValue;
        }
    };
}

const metadataRuleSets: MetadataRuleSet = {
    description: {
        rules: [
            [
                'meta[property="og:description"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[name="description" i]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
        ],
    },

    icon: {
        rules: [
            [
                'link[rel="apple-touch-icon"]',
                (element: HTMLElement) => element.getAttribute("href"),
            ],
            [
                'link[rel="apple-touch-icon-precomposed"]',
                (element: HTMLElement) => element.getAttribute("href"),
            ],
            [
                'link[rel="icon" i]',
                (element: HTMLElement) => element.getAttribute("href"),
            ],
            [
                'link[rel="fluid-icon"]',
                (element: HTMLElement) => element.getAttribute("href"),
            ],
            [
                'link[rel="shortcut icon"]',
                (element: HTMLElement) => element.getAttribute("href"),
            ],
            [
                'link[rel="Shortcut Icon"]',
                (element: HTMLElement) => element.getAttribute("href"),
            ],
            [
                'link[rel="mask-icon"]',
                (element: HTMLElement) => element.getAttribute("href"),
            ],
        ],
        scorers: [
            // Handles the case where multiple icons are listed with specific sizes ie
            // <link rel="icon" href="small.png" sizes="16x16">
            // <link rel="icon" href="large.png" sizes="32x32">
            (element: HTMLElement, score: any) => {
                const sizes = element.getAttribute("sizes");

                if (sizes) {
                    const sizeMatches = sizes.match(/\d+/g);
                    if (sizeMatches) {
                        return sizeMatches[0];
                    }
                }
                return undefined;
            },
        ],
        defaultValue: (context: any) => "favicon.ico",
        processors: [
            (icon_url: string, context: any) =>
                makeUrlAbsolute(context.url, icon_url),
        ],
    },

    image: {
        rules: [
            [
                'meta[property="og:image:secure_url"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[property="og:image:url"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[property="og:image"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[name="twitter:image"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[property="twitter:image"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[name="thumbnail"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
        ],
        processors: [
            (image_url: string, context: Context) =>
                makeUrlAbsolute(context.url, image_url),
        ],
    },

    keywords: {
        rules: [
            [
                'meta[name="keywords" i]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
        ],
        processors: [
            (keywords: string, context: Context) =>
                keywords.split(",").map((keyword) => keyword.trim()),
        ],
    },

    title: {
        rules: [
            [
                'meta[property="og:title"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[name="twitter:title"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[property="twitter:title"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            [
                'meta[name="hdl"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
            ["title", (element: HTMLElement) => element.innerText],
        ],
    },

    language: {
        rules: [
            ["html[lang]", (element: HTMLElement) => element.getAttribute("lang")],
            [
                'meta[name="language" i]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
        ],
        processors: [(language: string, context: any) => language.split("-")[0]],
    },

    type: {
        rules: [
            [
                'meta[property="og:type"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
        ],
    },

    url: {
        rules: [
            ["a.amp-canurl", (element: HTMLElement) => element.getAttribute("href")],
            [
                'link[rel="canonical"]',
                (element: HTMLElement) => element.getAttribute("href"),
            ],
            [
                'meta[property="og:url"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
        ],
        defaultValue: (context: Context) => context.url,
        processors: [
            (url: string, context: Context) => makeUrlAbsolute(context.url, url),
        ],
    },

    provider: {
        rules: [
            [
                'meta[property="og:site_name"]',
                (element: HTMLElement) => element.getAttribute("content"),
            ],
        ],
        defaultValue: (context: Context) => getProvider(parseUrl(context.url)),
    },
};

export function getMetadata(doc: Document, url: string): PageMetadata {
    const metadata: any = {};
    const context: Context = {
        url,
    };

    const ruleSets: MetadataRuleSet = metadataRuleSets;

    Object.keys(ruleSets).forEach((ruleSetKey: string) => {
        const ruleSet = ruleSets[<MetadataKey>ruleSetKey];

        const builtRuleSet = buildRuleSet(ruleSet);

        metadata[<MetadataKey>ruleSetKey] = builtRuleSet(doc, context);
    });

    return metadata as PageMetadata;
}

interface Context {
    url: string;
}

interface RuleSet {
    rules: Rule[];
    processors?: any[];
    scorers?: any[];
    defaultValue?: any;
}

type Rule = [
    string,
    (element: HTMLElement) => string | null
];

interface MetadataRuleSet {
    readonly description: RuleSet;
    readonly icon: RuleSet;
    readonly image: RuleSet;
    readonly keywords: RuleSet;
    readonly title: RuleSet;
    readonly language: RuleSet;
    readonly type: RuleSet;
    readonly url: RuleSet;
    readonly provider: RuleSet;
}

type MetadataKey = keyof MetadataRuleSet | keyof PageMetadata;
 
export interface PageMetadata {
    readonly description: string;
    readonly icon: string;
    readonly image: string;
    readonly keywords: string[];
    readonly title: string;
    readonly language: string;
    readonly type: string;
    readonly url: string;
    readonly provider: string;
}
