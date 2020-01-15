import {Files} from "polar-shared/src/util/Files";
import {HackerNewsContents} from "./HackerNewsContents";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('HackerNewsContents', function() {

    it("basic", async function () {

        const path = '/Users/burton/projects/polar-app/packages/polar-app-private/polar-hacker-news-crawler/src/hacker-news.html';

        const buff = await Files.readFileAsync(path);

        const content = buff.toString('utf-8');

        const result = HackerNewsContents.parse(content);

        assertJSON(result, [
            {
                "title": "Mozilla lays off 70",
                "link": "https://techcrunch.com/2020/01/15/mozilla-lays-off-70-as-it-waits-for-subscription-products-to-generate-revenue/?guccounter=1",
                "score": 179,
                "commentURL": "https://news.ycombinator.com/item?id=22057737"
            },
            {
                "title": "The new Microsoft Edge is out of preview",
                "link": "https://blogs.windows.com/windowsexperience/2020/01/15/new-year-new-browser-the-new-microsoft-edge-is-out-of-preview-and-now-available-for-download/",
                "score": 314,
                "commentURL": "https://news.ycombinator.com/item?id=22055976"
            },
            {
                "title": "Letting slower passengers board airplane first is faster, study finds",
                "link": "https://arstechnica.com/science/2020/01/letting-slower-passengers-board-airplane-first-really-is-faster-study-finds/",
                "score": 53,
                "commentURL": "https://news.ycombinator.com/item?id=22057989"
            },
            {
                "title": "Climate threats now dominate long-term risks, survey of global leaders finds",
                "link": "http://news.trust.org/item/20200115150054-km9of/",
                "score": 54,
                "commentURL": "https://news.ycombinator.com/item?id=22057576"
            },
            {
                "title": "Glia – High-quality low-cost open source medical hardware",
                "link": "https://glia.org/",
                "score": 413,
                "commentURL": "https://news.ycombinator.com/item?id=22054163"
            },
            {
                "title": "Why Japan is so successful at returning lost property",
                "link": "https://www.bbc.com/future/article/20200114-why-japan-is-so-successful-at-returning-lost-property",
                "score": 128,
                "commentURL": "https://news.ycombinator.com/item?id=22055867"
            },
            {
                "title": "How Shopify implemented its secure authentication service",
                "link": "https://engineering.shopify.com/blogs/engineering/implement-secure-central-authentication-service-six-steps",
                "score": 58,
                "commentURL": "https://news.ycombinator.com/item?id=22057173"
            },
            {
                "title": "Everything I Know About SSDs",
                "link": "http://kcall.co.uk/ssd/index.html",
                "score": 222,
                "commentURL": "https://news.ycombinator.com/item?id=22054600"
            },
            {
                "title": "How to identify an immoral maze",
                "link": "https://thezvi.wordpress.com/2020/01/12/how-to-identify-an-immoral-maze/",
                "score": 68,
                "commentURL": "https://news.ycombinator.com/item?id=22041741"
            },
            {
                "title": "A GitHub repo of jobs listings with bounties",
                "link": "https://github.com/zcor/githubjobs",
                "score": 147,
                "commentURL": "https://news.ycombinator.com/item?id=22055125"
            },
            {
                "title": "Von Neumann and Turing's Universal Machine",
                "link": "https://cacm.acm.org/magazines/2020/1/241712-von-neumann-thought-turings-universal-machine-was-simple-and-neat/fulltext",
                "score": 8,
                "commentURL": "https://news.ycombinator.com/item?id=22053718"
            },
            {
                "title": "Security Architecture Anti-Patterns",
                "link": "https://www.ncsc.gov.uk/whitepaper/security-architecture-anti-patterns",
                "score": 103,
                "commentURL": "https://news.ycombinator.com/item?id=22054565"
            },
            {
                "title": "New study: The advertising industry is systematically breaking EU law",
                "link": "https://www.forbrukerradet.no/side/new-study-the-advertising-industry-is-systematically-breaking-the-law/",
                "score": 364,
                "commentURL": "https://news.ycombinator.com/item?id=22052796"
            },
            {
                "title": "Lessons Learned from Writing the San Diego Homeless Survival Guide",
                "link": "https://streetlifesolutions.blogspot.com/2020/01/lessons-learned-from-writing-san-diego.html",
                "score": 81,
                "commentURL": "https://news.ycombinator.com/item?id=22051911"
            },
            {
                "title": "Researchers find inverse correlation between advertising and life satisfaction",
                "link": "https://hbr.org/2020/01/advertising-makes-us-unhappy",
                "score": 335,
                "commentURL": "https://news.ycombinator.com/item?id=22054715"
            },
            {
                "title": "Firebase as a React Hook",
                "link": "https://pragli.com/blog/firebase-as-a-react-hook/",
                "score": 49,
                "commentURL": "https://news.ycombinator.com/item?id=22056536"
            },
            {
                "title": "Courting Haskell",
                "link": "https://honzajavorek.cz/blog/courting-haskell",
                "score": 23,
                "commentURL": "https://news.ycombinator.com/item?id=22044262"
            },
            {
                "title": "Physician burnout widespread, especially among those midcareer, report says",
                "link": "https://www.wsj.com/articles/physician-burnout-widespread-especially-among-those-midcareer-report-says-11579086008",
                "score": 146,
                "commentURL": "https://news.ycombinator.com/item?id=22055479"
            },
            {
                "title": "Kubernaughty: A collection of documentation, how-tos, tools for K8s",
                "link": "https://github.com/jnoller/kubernaughty",
                "score": 46,
                "commentURL": "https://news.ycombinator.com/item?id=22057682"
            },
            {
                "title": "Problems with TypeScript",
                "link": "https://blog.logrocket.com/is-typescript-worth-it/",
                "score": 70,
                "commentURL": "https://news.ycombinator.com/item?id=22055341"
            },
            {
                "title": "All the money in the world couldn’t make Kinect happen",
                "link": "https://www.polygon.com/2020/1/14/21064608/microsoft-kinect-history-rise-and-fall",
                "score": 5,
                "commentURL": "https://news.ycombinator.com/item?id=22047687"
            },
            {
                "title": "Finding Time to Invest in Yourself",
                "link": "https://nav.al/finding-time",
                "score": 84,
                "commentURL": "https://news.ycombinator.com/item?id=22055940"
            },
            {
                "title": "CollegeHumor shuts down",
                "link": "https://www.washingtonpost.com/nation/2020/01/09/collegehumor-shuts-down/",
                "score": 239,
                "commentURL": "https://news.ycombinator.com/item?id=22054867"
            },
            {
                "title": "SapphireDb – Open-Source Alternative to Firebase",
                "link": "https://sapphire-db.com",
                "score": 144,
                "commentURL": "https://news.ycombinator.com/item?id=22052450"
            },
            {
                "title": "Opening Up the Baseboard Management Controller",
                "link": "https://queue.acm.org/detail.cfm?id=3378404",
                "score": 21,
                "commentURL": "https://news.ycombinator.com/item?id=22056359"
            },
            {
                "title": "Show HN: CrossHair – SMT Assisted Testing for Python",
                "link": "https://github.com/pschanely/CrossHair",
                "score": 69,
                "commentURL": "https://news.ycombinator.com/item?id=22054433"
            },
            {
                "title": "Family turned a former Freemason temple in Indiana into a home",
                "link": "https://www.businessinsider.com/family-freemason-temple-indiana-into-home",
                "score": 106,
                "commentURL": "https://news.ycombinator.com/item?id=22054072"
            },
            {
                "title": "CursedFS – Disk image that is simultaneously ext2 and FAT",
                "link": "https://github.com/NieDzejkob/cursedfs/blob/master/README.md",
                "score": 76,
                "commentURL": "https://news.ycombinator.com/item?id=22055145"
            }
        ]);

    });

});
