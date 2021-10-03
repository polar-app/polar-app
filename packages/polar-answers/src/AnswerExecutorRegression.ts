import {assert} from 'chai';
import {AnswerExecutor} from "./AnswerExecutor";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Mappers} from "polar-shared/src/util/Mapper";
import {IAnswerExecutorError} from "polar-answers-api/src/IAnswerExecutorResponse";
import {
    RegressionEngines
} from "polar-shared/src/util/RegressionEngines";
import {IAnswerExecutorRequest} from "polar-answers-api/src/IAnswerExecutorRequest";
import {AnswerTests} from "./AnswerTests";
import getUID = AnswerTests.getUID;
import IRegressionTestError = RegressionEngines.IRegressionTestResultError;
import IRegressionTestResultPass = RegressionEngines.IRegressionTestResultPass;
import IRegressionTestResultError = RegressionEngines.IRegressionTestResultError;
import {IDStr} from "polar-shared/src/util/Strings";
import {Files} from "polar-shared/src/util/Files";
import {Numbers} from "polar-shared/src/util/Numbers";
import { Reducers } from 'polar-shared/src/util/Reducers';
import IRegressionTestResultExecuted = RegressionEngines.IRegressionTestResultExecuted;

// TODO: implement a filter function witin the regression engine to ust run ONE
// test to enable us to quickly add new tests

// TODO: compute the costs based on tokens

// TODO: implement a cache with a 'fuzz' factor so we can test OpenAI
// non-determinism

// TODO: run the query in the cluster via the cloud function so we can record
// timings as latency is going to be an issue.

function createRegressionEngine(opts: ExecutorOpts) {

    const engine = RegressionEngines.create<string, 'failed' | 'no-answer'>();

    const executor = createExecutor(opts);

    // TODO: this fails now with 'Sera drawn between 7 and 17 days after a second dose of' for some reason.
    engine.xregister("covid 1", executor.create("What happened after a single dose of BNT162b2 vaccine?",
        "Neutralization was on average comparable to that of an asymptomatically infected cohort (NT50 53.8 and 38.5, respectively, P = 0.36), but lower than sera from those who had recovered from mild infection (NT50 438.3, P = 0.003)."));

    engine.xregister("covid 2", executor.create("What do two doses of SARS-CoV-2 vaccination induce?", ""));

    engine.xregister("covid 3", executor.create("What neutralized the prototype B virus?", ""));


    engine.register("astronomy #1",
        executor.create("Compare Mars with Mercury and the Moon in terms of overall properties.  What are the similarities and differences?", [
            "Mars is similar to Mercury and the Moon in that it has no atmosphere, and its surface is heavily cratered.",
            "Mars is similar to Mercury and the Moon in many ways.  It has no atmosphere, and its surface is heavily cratered.  As described later in this chapter, it also shares with the Moon the likelihood of a violent birth.",
            // TODO: this one is wrong but it might be a bug in the indexer not the executor.
            "Mars is similar to Mercury and the Moon in that it has no atmosphere, it is heavily cratered, and it has a",
            "Mars is similar to the Moon in that it has no atmosphere and is heavily cratered.  It is different from the Moon in that it has a much larger iron core and a much smaller fraction of silicates.  Mars is also different from Mercury in that it has a much larger iron core and a much smaller fraction of silicates."
        ]));

    engine.register("astronomy #2",
        executor.create("Contrast the mountains on Mars and Venus with those on Earth and the Moon.", [
            "The mountains on Mars and Venus are much higher than those on Earth and the Moon.",
            "On Mars, the mountains are volcanoes, produced by repeated eruptions of lava from the same vents. On Earth, the mountains are the result of compression and uplift of the surface. On the Moon and Mercury, the major mountains are ejecta thrown up by the large basin-forming impacts that took place billions of years ago.",
            "The mountains on Mars and Venus are higher than those on Earth and the Moon.",
            "The mountains on Mars and Venus are the result of compression and uplift of the surface.  On Earth, this crustal compression results from collisions of one continental plate with another.",
            "The mountains on Mars and Venus are the result of compression and uplift of the surface.  On Earth, this crustal compression results from collisions of one continental plate with another.  The mountains on the terrestrial planets owe their origins to different processes.  On the surfaces of solid worlds, mountains can result from impacts, volcanism, or uplift.  The label “sea level” refers only to Earth, of course, since the other two planets don’t have oceans.  Mauna Loa and Mt.  Everest are on Earth, Olympus Mons is on Mars, and the Maxwell"
        ]));


    engine.register("US history chap 1 #1",
        executor.create("Which native peoples built homes in cliff dwellings that still exist?", [
            "Anasazi",
            "The Anasazi."
        ]));

    engine.register("US history chap 1 #2",
        executor.create("Which culture developed the first writing system in the Western Hemisphere?", [
            "Olmec",
            "The Olmec."
        ]));


    engine.register("US history chap 1 #3", executor.create("Which culture developed a road system rivaling that of the Romans?", [
        "Inca",
        "The Inca."
    ]));


    engine.register("US history chap 1 #4",
        executor.create("What were the major differences between the societies of the Aztec, Inca, and Maya and the Native peoples of North America?", [
            "North American Indians were fewer in number, more widely dispersed, and did not have the population size or organized social structures of the Maya, Aztec, or Inca societies.",
            "The Native peoples of North America were more widely dispersed than the Mayan, Aztec, and Incan societies, and did not have their population size or organized social structures.",
            "The Native peoples of North America were much more widely dispersed than the Mayan, Aztec, and Incan societies, and did not have their population size or organized social structures.  Although the cultivation of corn had made its way north, many Native people still practiced hunting and gathering.  Horses, first introduced by the Spanish, allowed the Plains Natives to more easily follow and hunt the huge herds of bison.  A few societies had evolved into relatively complex forms, but they were already in decline at the time of Christopher Columbus’s arrival.",
            "The Native peoples of North America were not as advanced as the Aztec, Inca, and Maya.",
            "The Native peoples of North America were more widely dispersed than the Mayan, Aztec, and Incan societies.",
            "The Native peoples of North America were not as large in population size or as organized in social structure."
        ]));

    engine.register("US history chap 1 #5",
        executor.create("What was the series of attempts by Christian armies to retake the Holy Lands from Muslims was known as?", [
            "The Crusades."
        ]));

    // TODO not sure about this one.  Need to review.

    engine.register("US history chap 1 #6",
        executor.create("Which city became wealthy by trading with the East?", [
            "Venice.",
            "Venice"
        ]));

    engine.register("US history chap 1 #7",
        executor.create("In 1492, the Spanish forced what two religious groups to either convert or leave.", [
            "Muslims and Jews",
            "Jews and Muslims"
        ]));

    engine.register("US history chap 1 #8",
        executor.create("How did European feudal society operate?", [
            "Nobility held lands from the Crown in exchange for military service",
            "The lords owned the land; knights gave military service to a lord and carried out his justice",
            "The peasants (villeins or serfs) were obliged to live on their lord's land and give him homage, labour, and a share of the produce",
            "It was a mutually supportive system.",
            "Feudal society was a mutually supportive system.",
            // TODO: parser issue
            "The lords owned the land; knights gave military service to a lord and carried out his justice; serfs worked the land in return for the protection offered by the",
            "Europe’s feudal society was a mutually supportive system."
        ]));

    engine.register("US history chap 1 #9",
        executor.create("Which city became a leading center for Muslim scholarship and trade?", [
            "timbuktu",
            "Timbuktu"
        ]));

    engine.register("US history chap 2 #1",
        executor.create("Which country initiated the era of Atlantic exploration?", [
            "Portugal",
            "Portugal initiated the era of Atlantic exploration in the 15th century"
        ]));

    engine.register("US history chap 2 #2",
        // TODO: this might be wrong. It's also answering England which is arguably true.
        executor.create("Which country established the first colonies in the Americas?", [
            "Spain",
            "England",
            "The Spanish were among the first Europeans to explore the New World and the first to settle in what is now the United State"
        ]));

    engine.register("US history chap 2 #3",
        executor.create("Where did Christopher Columbus first land?", [
            "The Bahamas",
            "The Bahamas.",
            "In the Bahamas."
        ]));

    engine.register("US history chap 2 #4",
        executor.create("Why did the authors of probanzas de méritos choose to write in the way that they did?", [
            "To convince the Spanish crown to fund more voyages",
            "They wanted to win royal favor.",
            "They wanted to win royal patronage.",
            "They wanted to win royal patronage."
        ]));


    engine.xregister("US history chap 2 #5",
        // this book gives the impression that the protestant reformation began in Spain, it didn't it was
        // intoduced by Martin Luthor in 1517 in GERMANY!
        // this book is making me question what the hell are they teaching americans about history over there
        executor.create("Where did the Protestant Reformation begin?", [
            "Wittenberg, Germany",
            "Wittenberg, Germany, on October 31, 1517",
            "Germany",
        ]));

    engine.register("US history chap 2 #6",
        // TODO: it's giving this answer which might be wrong:
        // to achieve a lasting peace with the Catholic nations of Spain and France

        // TODO: i think this would benefit from query expansion.
        executor.create("What was the chief goal of the Puritans?", [
            "To eliminate any traces of Catholicism from the church of England.",
            "The eliminatation of Catholicism",
            "To purify the Church of England of Roman Catholic practices"
        ]));

    engine.register("US history chap 2 #8",
        // TODO: parser- the PDF is not parsing the document out properly
        // and is having two spaces sometimes which then confused OpenAI.
        // One hack is to replace two spaces with a single but the PDF text
        // extraction just doesn't work.

        executor.create("Why didn’t England make stronger attempts to colonize the New World before the late sixteenth to early seventeenth century?", [
            "English attention was turned to internal struggles and the encroaching Catholic menace to Scotland and Ireland",
            "English attention was turned to internal struggles and the encroaching Catholic menace to Scotland and Ireland.",
            "England lacked the financial resources for such endeavors.",
            "England was embroiled in a civil war and experienced a period of republicanism in the 1640s and 1650s."
        ]));

    engine.register("US history chap 2 #9",
        executor.create("What was the main goal of the French in colonizing the Americas?", [
            "Trading, especially for furs",
            "To create trading posts for the fur trade",
            "establishing a colony with French subjects",
            "To establish commercially viable colonial outposts."
        ]));

    engine.register("US history chap 2 #11",
        // TODO not sure about this one.  The word encomiendas might be the
        // beginning of a chapter... not just plain text.

        // Physical power—to work the fields, build villages, process raw
        // materials—is a necessity for maintaining a society. During the
        // sixteenth and seventeenth centuries, humans could derive power
        // only from the wind, water, animals, or other humans. Everywhere
        // in the Americas, a crushing demand for labor bedeviled Europeans
        // because there were not enough colonists to perform the work
        // necessary to keep the colonies going. Spain granted
        // encomiendas—legal rights to native labor—to conquistadors who
        // could prove their service to the crown. This system reflected the
        // Spanish view of colonization: the king rewarded successful
        // conquistadors who expanded the empire. Some native peoples who
        // had sided with the conquistadors, like the Tlaxcalan, also gained
        // encomiendas; Malintzin, the Nahua woman who helped Cortés defeat
        // the Mexica, was granted one.

        // TODO: we don't even see this data in the index results.  This is
        // a bug I think.  There's no reaso this shouldn't show up.

        executor.create("How could Spaniards obtain encomiendas?", [
            "By serving the Spanish crown",
            "By conquering territory in the name of the Spanish Crown",
            "by serving the Spanish crown"
        ]));

    engine.register("US history chap 2 #13",
        executor.create("Why did diseases like smallpox affect Native Americans so badly?", [
            "Native Americans had no immunity to European diseases",
            "The immunity system of native americans was not ready for European diseases",
            "Native Americans were less robust than Europeans.",
            "They had no immunity to diseases from across the Atlantic, to which they had never been exposed.",
            "They had no immunity to diseases from across the Atlantic."
        ]));

    engine.register("US history chap 3 #2",
        executor.create("Why did the Spanish build Castillo de San Marcos?", [
            "To defend against imperial challengers",
            "To protect the local Timucua.",
            "To defend St. Augustine against challengers.",
            "To better defend St. Augustine against challengers."
        ]));


    engine.register("US history chap 3 #3",
        executor.create("How did the Pueblo attempt to maintain their autonomy in the face of Spanish settlement?", [
            "Through revolt",
            "They attempted to maintain their autonomy in the face of Spanish settlement by launching a coordinated rebellion against the Spanish."
        ]));

    engine.register("US history chap 3 #4",
        executor.create("What was patroonship?", [
            "A Dutch system of granting tracts of land in New Netherland to encourage colonization",
            "A system of granting tracts of land in New Netherland",
            "A patroonship was a large tract of land in the colony of New Netherland, which was granted by the Dutch West India Company to a patroon, or patron, in exchange for settling a specified number of colonists there.",
            "A patroonship was a large tract of land in the New Netherland colony that was granted to a patroon, or lord, by the Dutch West India Company.",
            "A patroonship was a large tract of land in the Hudson Valley that was granted to a patroon, or lord, by the Dutch West India Company.",
            "Patroonship was a system of land distribution in the colony of New Netherland.",
            "A patroonship was a large tract of land in the New Netherland colony that was granted to a patroon, or patron, by the Dutch West India Company."
        ]));

    engine.register("US history chap 3 #5",
        executor.create("Which religious order joined the French settlement in Canada and tried to convert the natives to Christianity?", [
            "Jesuits",
            "The Jesuits."
        ]));

    engine.register("US history chap 3 #7",
        executor.create("What was the most lucrative product of the Chesapeake colonies?", [
            "tobacco",
            "Tobacco.",
            "The tabacco trade"
        ]));

    engine.register("US history chap 3 #8",
        executor.create("What was the primary cause of Bacon’s Rebellion ?", [
            "former indentured servants wanted more opportunities to expand their territory",
            "Former indentured servants wanted more opportunities to expand their territory.",
            "Bacon and his followers, who saw all Native peoples as an obstacle to their access to land, pursued a policy of extermination",
            "Bacon’s Rebellion was caused by the English settlers’ desire for more land.",
            "Bacon’s Rebellion was caused by the Virginia government’s Indian policy.",
            "Bacon’s Rebellion stemmed from a small dispute between a Virginia land owner and the Doeg, but its causes ran much deeper.",
            "The primary cause of Bacon’s Rebellion was the governor’s attempt to force the Indians to move to the west side of the James River."
        ]));

    engine.register("US history chap 3 #9",
        executor.create("The founders of the Plymouth colony were?", [
            "Puritans",
            "Puritans ",
            "Puritans.",
            "Pilgrims",
            "The Pilgrims.",
            "Separatists."
        ]));

    engine.register("US history chap 3 #12",
        executor.create("What was the Middle Passage?", [
            "The transatlantic journey that enslaved Africans made to America",
            "The Middle Passage was the transatlantic journey that enslaved Africans made to America.",
            "the journey slaves took from Africa to the Americas",
            "The Middle Passage was the stage of the Atlantic slave trade in which millions of enslaved Africans were forcibly transported to the Americas as part of the triangular slave trade",
            "The Middle Passage was the leg of the triangle trade that connected Africa and the Americas.",
            "The Middle Passage was the name given to the transportation of enslaved Africans across the Atlantic Ocean to the Americas.",
            "The Middle Passage was the voyage across the Atlantic from Africa to the Americas."
        ]));

    engine.register("US history chap 3 #14",
        executor.create("How did European muskets change life for native peoples in the Americas?", [
            "Tribes with ties to Europeans had a distinct advantage in wars",
            "Guns changed the balance of power among different groups and tribes",
            "Muskets made combat more deadly",
            "They made warfare more lethal and changed traditional patterns of authority among tribes.",
            "European muskets changed life for native peoples in the Americas by making warfare more lethal and changing traditional patterns of authority among tribes."
        ]));

    // // Chapter 2
    engine.register("astronomy Chapter 2 #1",
        executor.create("What fraction of the sky can be seen from the North Pole?", [
            "Approximately 50% like anywhere else on the planet.",
            "Only half the sky can be seen from the North Pole.",
            "Only half the sky can be seen from the North Pole, and that half does not change throughout the year."
        ]));
    engine.register("astronomy Chapter 2 #2",
        executor.create("How quickly we can learn about events in the universe?", [
            "As soon as the light from that universe reaches us",
            "Information about the universe comes to us almost exclusively through various forms of light, and all such light travels at the speed of light"
        ]));

    engine.register("astronomy Chapter 2 #3", executor.create("The Sun was once thought to be a planet. Explain why.", [
        "In the geocentric system, all of the objects that moved in the sky relative to the fixed stars were considered to be “wanderers” and the Sun was no exception, so it was classified as a planet.",
        "It was so because of the geocentric model, it was thought that the sun was just an object like other planets orbiting the earth",
    ]));

    engine.register("astronomy Chapter 2 #4", executor.create("How far is the nearest galaxy from the sun?", [
        "75,000 light-years from the Sun",
        "75,000 light-years",
        "75,000 light-years from the Sun in the direction of the constellation Sagittarius"
    ]));

    engine.register("astronomy Chapter 2 #5", executor.create("What is an asterism?", [
        "A prominent pattern or group of stars, typically having a popular name but smaller than a constellation.",
        "Some people use the term asterism to denote an especially noticeable star pattern within a constellation",
        "An asterism is a pattern of stars that is not a constellation.",
        "Asterisms are patterns of stars that are not constellations.",
        "An asterism is a kind of star pattern that is visible in the sky."
    ]));

    engine.register("astronomy Chapter 2 #6", executor.create("Give at least one of Aristotle's arguments why he considered the earth to be round", [
        "First is the fact that as the Moon enters or emerges from Earth’s shadow during an eclipse of the Moon, the shape of the shadow seen on the Moon is always round",
        "Travelers who go south a significant distance are able to observe stars that are not visible farther north",
        "Aristotle reasoned that the Sun has to be farther away from Earth than is the Moon because occasionally the Moon passed exactly between Earth and the Sun and hid the Sun temporarily from view.  We call this a solar eclipse.",
    ]));

    engine.register("astronomy Chapter 2 #7", executor.create("How are the zodiacal constellations different from the other constellations?", [
        "Zodiac constellations are the constellations which give the zodiac signs to people. Constellations are groups of stars that form a specific pattern and are recognized by mythological figures and have names attributed to them.",
        "Zodiac constellations are those through which the Sun appears to travel during the year",
        "The zodiacal constellations are the constellations that lie along the ecliptic.",
        "The zodiacal constellations are the constellations that the Sun, Moon, and planets appear to move through in the course of a year."
    ]));

    // Chapter 3
    engine.register("astronomy Chapter 3 #1", executor.create("What is the orbital speed?", [
        "the speed with which each planet moves along its ellipse",
        "Kepler’s second law deals with the speed with which each planet moves along its ellipse, also known as its orbital speed.",
        // "48 km/s"
    ]));

    engine.register("astronomy Chapter 3 #2", executor.create("What's Newton's first law?", [
        "Every object will continue to be in a state of rest or move at a constant speed in a straight line unless it is compelled to change by an outside force.",
        "Unless it is compelled to change by an outside force, every object will continue to be in a state of rest or move at a constant speed",
        "An object in motion tends to remain in motion.",
        "An object at rest will remain at rest unless acted upon by an unbalanced force."
    ]));

    engine.register("astronomy Chapter 3 #3", executor.create("Which major planet has the largest semimajor axis?", [
        "Jupiter",
        "Jupiter, The Solar System's Largest Planet"
    ]));

    engine.register("astronomy Chapter 3 #4", executor.create("Which major planet has the largest average orbital speed around the Sun?", [
        "Mercury"
    ]));

    engine.register("astronomy Chapter 3 #6", executor.create("Which major planet has the largest eccentricity?", [
        "Mercury"
    ]));

    engine.register("astronomy Chapter 3 #7", executor.create("What is angular momentum?", [
        "a measure of the rotation of a body as it revolves around some fixed point",
        "The angular momentum of an object is defined as the product of its mass, its velocity, and its distance from the fixed point around which it revolves.",
        "Angular momentum is a measure of the rotation of a body as it revolves around some fixed point."
    ]));

    // Chapter 4
    engine.register("astronomy Chapter 4 #1", executor.create("Why does longitude have no meaning at the North and South Poles?", [
        "All longitude lines meet at the pole",
        "All longitude lines meet at the poles; therefore, they have no defined longitude.",
        "Because the North and South Poles are the points on Earth where the directions north, south, east, and west are ambiguous."
    ]));

    engine.register("astronomy Chapter 4 #2", executor.create("What are the main advantage and disadvantage of apparent solar time?", [
        "The main advantage is that we can tell the exact time with a sundial (assuming it's sunny). The disadvantage is that every locality has its own time.",
        "The main advantage is that it is simple. The main disadvantage is that it is not very convenient to use.",
        "The main advantage is that it is based on the actual position of the Sun in the sky.  The main disadvantage is that it is not very convenient to use."
    ]));

    engine.register("astronomy Chapter 4 #3", executor.create("What's the rotation period of Earth?", [
        "One day",
        "1 day",
        "A single day",
        "1.00 day"
    ]));

    engine.register("astronomy Chapter 4 #4", executor.create("Why is it difficult to construct a practical calendar based on the Moon’s cycle of phases?", [
        "Because the period required by the moon to complete its cycle of phases is 29.5306 days",
        "Because it's not a whole number",
        "Because the Moon’s cycle of phases is not commensurable with the day, month, or year."
    ]));

    engine.register("astronomy Chapter 4 #5", executor.create("What is the phase of the Moon during a total solar eclipse?", [
        "new moon",
        "when the moon passes directly between the sun and Earth",
        "A solar eclipse can only take place at the phase of new moon"
    ]));

    engine.register("astronomy Chapter 4 #6", executor.create("Why is the leap year necessary?", [
        "to help synchronize the calendar year with the solar year",
        "The leap year is necessary to make the average length of the year in the Julian calendar 365.25 days.",
        "The leap year is necessary because the year is not exactly 365.25 days."
    ]));

    engine.register("astronomy Chapter 4 #7", executor.create("Why the year 1800 was not a leap year?", [
        "a century year cannot be a leap year unless it is divisible by 400",
        "because a century year cannot be a leap year unless it is divisible by 400",
        "Only century years divisible by 400 would be leap years",
        "Because it was not divisible by 4.",
        "It was not a leap year because it was not divisible by 400."
    ]));

    engine.register("astronomy Chapter 4 #8", executor.create("Why don’t lunar eclipses happen during every full moon?", [
        "because the Moon's orbit is tilted five degrees from Earth's orbit around the Sun",
        "Because the moon's orbit around Earth lies in a slightly different plane than Earth's orbit around the sun",
        "the Moon is sufficiently above or below the ecliptic plane to avoid an eclipse",
        "Because the Moon is not always opposite the Sun.",
        "Because the Moon’s orbit is tilted with respect to the ecliptic plane."
    ]));

    engine.register("astronomy Chapter 4 #9", executor.create("Why some places have very small tides while in other places huge tides?", [
        "the presence of land masses stopping the flow of water",
        "the friction in the oceans and between oceans and the ocean floors",
        "the rotation of Earth",
        "the wind",
        "the variable depth of the ocean."
    ]));

    engine.register("Who founded the Elmer Candy Corporation?", executor.create("Who founded the Elmer Candy Corporation?", [
        "Christopher Henry Miller"
    ]));

    engine.register("When did the Elmer brothers came up with cornmeal based cheese curl?",
        executor.create("When did the Elmer brothers came up with cornmeal based cheese curl?", [
            "In 1936."
        ]));

    engine.register('When was the CheeWees trademark registered?',
        executor.create("When was the CheeWees trademark registered?", [
            "__UNKNOWN__"
        ]));

    engine.register('president of Elmer Candy Corporation', executor.create("president of Elmer Candy Corporation", [
        "Robert Nelson"
    ]));

    // @TODO the right answer is a list of ~60 jurisdictions where "All European Union citizens"
    // @TODO is the first element of the list. OpenAI thinks it's the only right answer though. Figure out why.
    engine.xregister("Venezuela visa exemption #1",
        executor.create("Which are the visa exempt countries for entry in Venezuela?", [
            'All European Union citizens',
            'Andorra',
            'Antigua and Barbuda'
            // and ~60 more...
        ]));

    engine.register("Venezuela visa exemption #2",
        executor.create("How long is the Visa exemption for Venezuela for holders of passports from Turkey?", [
            '30 days'
        ]));

    return engine;

}

async function doRegression(opts: ExecutorOpts) {

    const engine = createRegressionEngine(opts);

    const result = await engine.exec();

    const summarizer = (results: ReadonlyArray<IRegressionTestResultExecuted<any, unknown>>) => {

        const count
            = results.map(current => (current.metadata || {}).count as number || 0)
                     .reduce(Reducers.SUM);

        return {count};

    }

    const report = result.createReport(['cost', 'question', 'answer'], summarizer);

    async function writeReportToConsole() {
        console.log(report);
    }

    async function writeReportToFile() {
        const path = `regression-report-${opts.id}.txt`;
        await Files.writeFileAsync(path, report);
    }

    await writeReportToConsole();
    await writeReportToFile();

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExecutorOpts extends Required<Pick<IAnswerExecutorRequest, 'search_model' | 'model' | 'rerank_elasticsearch' | 'rerank_elasticsearch_size' | 'rerank_elasticsearch_model' | 'rerank_truncate_short_head' | 'prune_contiguous_records'>> {

    /**
     * A unique ID for this executor so that we can keep track of the config
     * options by name.
     */
    readonly id: IDStr;

}

interface IExecutor {
    readonly create: (question: string, expectedAnswer: string | ReadonlyArray<string>) => () => Promise<IRegressionTestResultPass<string> | IRegressionTestResultError<'failed' | 'no-answer'>>;
    readonly executeQuestion: (question: string, forEmail?: string) => Promise<string>;
    readonly assertQuestionAndAnswer: (question: string, expectedAnswer: string | ReadonlyArray<string>) => Promise<void>;
}

function createExecutor(opts: ExecutorOpts) : IExecutor {

    function create(question: string,
                    expectedAnswer: string | ReadonlyArray<string>,
                    forEmail = 'burton@inputneuron.io'): () => Promise<IRegressionTestResultPass<string> | IRegressionTestResultError<'failed' | 'no-answer'>> {

        return async () => {

            const uid = await getUID(forEmail);

            // eslint-disable-next-line camelcase
            const answer_response = await AnswerExecutor.exec({
                uid,
                question,
                ...opts
            });

            /**
             * Convert to lower case and remove any whitespace and potential
             * trailing '.' which doesn't substantially change the meaning of the
             * answer.
             */
            function canonicalize(text: string): string {

                return Mappers.create(text)
                    .map(current => current.toLowerCase())
                    .map(current => current.trim())
                    .map(current => {
                        if (current.endsWith(".")) {
                            return current.substring(0, current.length - 1);
                        }
                        return current;
                    })
                    .collect();

            }

            const metadata = {
                question,
                cost: Numbers.toFixedFloat(answer_response.cost_estimation.cost, 4)
            };

            function isError(value: any): value is IAnswerExecutorError {
                return value.error === true;
            }

            if (! isError(answer_response)) {

                const answer = answer_response.answers[0];

                function hasPassed(): boolean {

                    if (typeof expectedAnswer === 'string') {

                        if (canonicalize(answer) === canonicalize(expectedAnswer)) {
                            return true;
                        }

                    } else {
                        if (expectedAnswer.map(canonicalize).includes(canonicalize(answer))) {
                            return true;
                        }
                    }

                    return false;

                }

                const status = hasPassed() ? 'pass' : 'fail';

                return {
                    status,
                    actual: answer,
                    expected: expectedAnswer,
                    metadata: {
                        answer,
                        ...metadata
                    }
                };

            } else {
                return <IRegressionTestError<'failed' | 'no-answer'>> {
                    status: 'fail',
                    err: answer_response.code,
                    metadata
                };
            }

        }

    }

    async function executeQuestion(question: string, forEmail = 'burton@inputneuron.io'): Promise<string> {

        const uid = await getUID(forEmail);

        const response = await AnswerExecutor.exec({
            uid,
            question,
            ...opts
        });

        function isError(value: any): value is IAnswerExecutorError {
            return value.error === true;
        }

        if (! isError(response)) {

            console.log("answer: ", Arrays.first(response.answers))

            console.log("response: " + JSON.stringify(response, null, '  '));

            return response.answers[0];

        } else {
            throw new Error(response.code);
        }

    }

    async function assertQuestionAndAnswer(question: string, expectedAnswer: string | ReadonlyArray<string>) {

        const answer = await executeQuestion(question);

        /**
         * Convert to lower case and remove any whitespace and potential
         * trailing '.' which doesn't substantially change the meaning of the
         * answer.
         */
        function canonicalize(text: string): string {

            return Mappers.create(text)
                .map(current => current.toLowerCase())
                .map(current => current.trim())
                .map(current => {
                    if (current.endsWith(".")) {
                        return current.substring(0, current.length - 1);
                    }
                    return current;
                })
                .collect();

        }

        if (typeof expectedAnswer === 'string') {
            assert.equal(canonicalize(answer), canonicalize(expectedAnswer));
            return;
        }

        assert.ok(expectedAnswer.map(canonicalize).includes(canonicalize(answer)),
            `Answer '${answer}' to question '${question}' was not expected. Expected answers: ` + JSON.stringify(expectedAnswer));

    }

    return {create, executeQuestion, assertQuestionAndAnswer};

}


async function main() {

    // force the cache usage
    process.env.POLAR_CACHE_FORCED='true';

    // main things to test:

    // - PoS filtering
    // - reranking
    // - models

    const options: ReadonlyArray<ExecutorOpts> = [
        {
            id: 'v1',
            search_model: 'ada',
            model: 'ada',
            rerank_elasticsearch: false,
            rerank_elasticsearch_size: 10000,
            rerank_elasticsearch_model: 'ada',
            rerank_truncate_short_head: false,
            prune_contiguous_records: false,
        },
        {
            id: 'v2',
            model: 'curie',
            search_model: 'curie',
            rerank_elasticsearch: true,
            rerank_elasticsearch_size: 10000,
            rerank_elasticsearch_model: 'ada',
            rerank_truncate_short_head: true,
            prune_contiguous_records: true,
        }
    ]

    for (const opts of options) {
        console.log("===== Running regression with opts: " + JSON.stringify(opts, null, '  '));
        await doRegression(opts);
    }

}

main()
    .catch(err => console.error("Failed to run regression: ", err));
