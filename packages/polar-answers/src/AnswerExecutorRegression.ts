import {assert} from 'chai';
import {AnswerExecutor} from "./AnswerExecutor";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Mappers} from "polar-shared/src/util/Mapper";
import {IAnswerExecutorError, IAnswerExecutorResponse} from "polar-answers-api/src/IAnswerExecutorResponse";
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
import {AsyncCaches} from "polar-cache/src/AsyncCaches";
import ResultStatus = RegressionEngines.ResultStatus;

// TODO: implement a filter function witin the regression engine to ust run ONE
// test to enable us to quickly add new tests

// TODO: compute the costs based on tokens

// TODO: implement a cache with a 'fuzz' factor so we can test OpenAI
// non-determinism

// TODO: run the query in the cluster via the cloud function so we can record
// timings as latency is going to be an issue.

// TODO: maybe refactor this as accepted answers and rejected answers... IE that they are not confirmed as passing
// or failing by answer key.  This way we could also have pass, fail, unknown. unknown is only specified if it is
// neither in accepted or rejected.

function createRegressionEngine(opts: ExecutorOpts) {

    const engine = RegressionEngines.create<string, 'failed' | 'no-answer'>({
        config: opts.request
    });

    // TODO: we need a name of confirmed/failing tests by ID based on the opts here...
    // when confirmed as failing the supervisor of the regression knows they don't
    // need to update this one.
    const executor = createExecutor(opts);

    // TODO: this fails now with 'Sera drawn between 7 and 17 days after a second dose of' for some reason.
    engine.xregister("covid 1", executor.create("What happened after a single dose of BNT162b2 vaccine?",
        "Neutralization was on average comparable to that of an asymptomatically infected cohort (NT50 53.8 and 38.5, respectively, P = 0.36), but lower than sera from those who had recovered from mild infection (NT50 438.3, P = 0.003)."));

    engine.xregister("covid 2", executor.create("What do two doses of SARS-CoV-2 vaccination induce?", ""));

    engine.xregister("covid 3", executor.create("What neutralized the prototype B virus?", ""));

    engine.register("astronomy #1",
        executor.create("Compare Mars with Mercury and the Moon in terms of overall properties.  What are the similarities and differences?", {
            pass: [
                "Mars is similar to Mercury and the Moon in that it has no atmosphere, and its surface is heavily cratered.",
                "Mars is similar to Mercury and the Moon in many ways.  It has no atmosphere, and its surface is heavily cratered.  As described later in this chapter, it also shares with the Moon the likelihood of a violent birth.",
                // TODO: this one is wrong but it might be a bug in the indexer not the executor.
                "Mars is similar to Mercury and the Moon in that it has no atmosphere, it is heavily cratered, and it has a",
                "Mars is similar to the Moon in that it has no atmosphere and is heavily cratered.  It is different from the Moon in that it has a much larger iron core and a much smaller fraction of silicates.  Mars is also different from Mercury in that it has a much larger iron core and a much smaller fraction of silicates."
            ],
            fail: [
                "Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet.  Mars is a terrestrial planet, and Mercury is a terrestrial planet",
                "The similarities are that they are all rocky planets with a thin atmosphere.  The differences are that Mars has a much thicker atmosphere, and the Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere.  The Moon has a much thinner atmosphere"
            ]
        }));

    engine.register("astronomy #2",
        executor.create("Contrast the mountains on Mars and Venus with those on Earth and the Moon.", {
            pass: [
                "The mountains on Mars and Venus are much higher than those on Earth and the Moon.",
                "On Mars, the mountains are volcanoes, produced by repeated eruptions of lava from the same vents. On Earth, the mountains are the result of compression and uplift of the surface. On the Moon and Mercury, the major mountains are ejecta thrown up by the large basin-forming impacts that took place billions of years ago.",
                "The mountains on Mars and Venus are higher than those on Earth and the Moon.",
                "The mountains on Mars and Venus are the result of compression and uplift of the surface.  On Earth, this crustal compression results from collisions of one continental plate with another.",
                "The mountains on Mars and Venus are the result of compression and uplift of the surface.  On Earth, this crustal compression results from collisions of one continental plate with another.  The mountains on the terrestrial planets owe their origins to different processes.  On the surfaces of solid worlds, mountains can result from impacts, volcanism, or uplift.  The label “sea level” refers only to Earth, of course, since the other two planets don’t have oceans.  Mauna Loa and Mt.  Everest are on Earth, Olympus Mons is on Mars, and the Maxwell",
                "The mountains on Mars and Venus are much higher than those on Earth and the Moon."
            ],
            fail: [
                "Mars and Venus are similar because they are both rocky, differentiated objects.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a moon of Jupiter.  Mars is a terrestrial planet, while Venus is a"
            ]
        }));


    engine.register("US history chap 1 #1",
        executor.create("Which native peoples built homes in cliff dwellings that still exist?", [
            "Anasazi",
            "The Anasazi.",
            "The Anasazi, whose name means “ancient enemy” or “ancient ones.”"
        ]));

    engine.register("US history chap 1 #2",
        executor.create("Which culture developed the first writing system in the Western Hemisphere?", [
            "Olmec",
            "The Olmec.",
            "The Olmec developed the first writing system in the Western Hemisphere."
        ]));


    engine.register("US history chap 1 #3", executor.create("Which culture developed a road system rivaling that of the Romans?", [
        "Inca",
        "The Inca."
    ]));


    engine.register("US history chap 1 #4",
        executor.create("What were the major differences between the societies of the Aztec, Inca, and Maya and the Native peoples of North America?", {
            pass: [
                "North American Indians were fewer in number, more widely dispersed, and did not have the population size or organized social structures of the Maya, Aztec, or Inca societies.",
                "The Native peoples of North America were more widely dispersed than the Mayan, Aztec, and Incan societies, and did not have their population size or organized social structures.",
                "The Native peoples of North America were much more widely dispersed than the Mayan, Aztec, and Incan societies, and did not have their population size or organized social structures.  Although the cultivation of corn had made its way north, many Native people still practiced hunting and gathering.  Horses, first introduced by the Spanish, allowed the Plains Natives to more easily follow and hunt the huge herds of bison.  A few societies had evolved into relatively complex forms, but they were already in decline at the time of Christopher Columbus’s arrival.",
                "The Native peoples of North America were not as advanced as the Aztec, Inca, and Maya.",
                "The Native peoples of North America were more widely dispersed than the Mayan, Aztec, and Incan societies.",
                "The Native peoples of North America were not as large in population size or as organized in social structure.",
                "The Native peoples of North America were much more widely dispersed than the Mayan, Aztec, and Incan societies, and did not have their population size or organized social structures."
            ],
            fail: [
                "The major differences between the societies of the Aztec, Inca, and Maya and the Native peoples of North America were:"
            ]
        }));

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
            "Jews and Muslims",
            "The Spanish forced the Jews and Muslims to either convert or leave."
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
            "Europe’s feudal society was a mutually supportive system.",
            "The lords owned the land; knights gave military service to a lord and carried out his justice; serfs worked the land in return for the protection offered by the lord."
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
        executor.create("Why did the authors of probanzas de méritos choose to write in the way that they did?", {
            pass: [
                "To convince the Spanish crown to fund more voyages",
                "They wanted to win royal favor.",
                "They wanted to win royal patronage.",
                "They wanted to win royal patronage.",
                "They chose to write in the way that they did because they wanted to show the reader the importance of the work that they were doing."
            ],
            fail: [
                "The authors of probanzas de méritos chose to write in the way that they did because they believed that the best way to achieve literary success was to write in the way that they did."
            ]
        }));


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
        executor.create("What was the chief goal of the Puritans?", {
            pass: [
                "To eliminate any traces of Catholicism from the church of England.",
                "The eliminatation of Catholicism",
                "To purify the Church of England of Roman Catholic practices",
                "To reform the Church of England.",
            ],
            fail: [
                // I think this is wrong... it had to do with the church of england
                "To spread the Christian gospel to the Indians."
            ]
        }));

    engine.register("US history chap 2 #8",
        // TODO: parser- the PDF is not parsing the document out properly
        // and is having two spaces sometimes which then confused OpenAI.
        // One hack is to replace two spaces with a single but the PDF text
        // extraction just doesn't work.

        executor.create("Why didn’t England make stronger attempts to colonize the New World before the late sixteenth to early seventeenth century?", {
            pass: [
                "English attention was turned to internal struggles and the encroaching Catholic menace to Scotland and Ireland",
                "English attention was turned to internal struggles and the encroaching Catholic menace to Scotland and Ireland.",
                "England lacked the financial resources for such endeavors.",
                "England was embroiled in a civil war and experienced a period of republicanism in the 1640s and 1650s."
            ],
            fail: [
                "England was not a major power in the Atlantic World in the early sixteenth century.  It was not until the late sixteenth century that England became a major power in the Atlantic World.  The English Crown was not interested in colonizing the New World until the late sixteenth century.  The English Crown was not interested in colonizing the New World until the late sixteenth century.",
                "England was a weak imperial power in the early seventeenth century.  It had only a few infant colonies in the Americas in the early 1600s.  The English never found treasure equal to that of the Aztec city of Tenochtitlán, and England did not quickly grow rich from its small American outposts.  The English colonies also differed from each other; Barbados and Virginia had a decidedly commercial orientation from the start, while the Puritan colonies of New England were intensely religious at their inception.  All English settlements in America, however, marked the increasingly important role of England in the Atlantic World.",
                "England was in a period of  economic decline, and the English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown was in a period of  financial crisis.  The English Crown"
            ]
        }));

    engine.register("US history chap 2 #9",
        executor.create("What was the main goal of the French in colonizing the Americas?", [
            "Trading, especially for furs",
            "To create trading posts for the fur trade",
            "establishing a colony with French subjects",
            "To establish commercially viable colonial outposts.",
            "To establish a foothold in the Americas through trade and commerce.",
            "To establish commercial and political control over the New World."
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
            "by serving the Spanish crown",
            "They could obtain encomiendas by serving in the Spanish army."
        ]));

    engine.register("US history chap 2 #13",
        executor.create("Why did diseases like smallpox affect Native Americans so badly?", [
            "Native Americans had no immunity to European diseases",
            "The immunity system of native americans was not ready for European diseases",
            "Native Americans were less robust than Europeans.",
            "They had no immunity to diseases from across the Atlantic, to which they had never been exposed.",
            "They had no immunity to diseases from across the Atlantic.",
            "Because almost all diseases that affect humans are mutated strains of diseases affecting domestic animals, and all of the large animal species that can be domesticated are Eurasian in origin except llamas, Eurasians and Africans had spent thousands of years both suffering from and building up resistance to epidemics while Native Americans had not.",
            "Because almost all diseases that affect humans are mutated strains of diseases affecting domestic animals, and all of the large animal species that can be domesticated were Eurasian in origin except llamas, Europeans, and Africans had spent thousands of years both suffering from and building up resistance to epidemics while Native Americans had not."
        ]));

    engine.register("US history chap 3 #2",
        executor.create("Why did the Spanish build Castillo de San Marcos?", {
            pass: [
                "To defend against imperial challengers",
                "To protect the local Timucua.",
                "To defend St. Augustine against challengers.",
                "To better defend St. Augustine against challengers."
            ],
            fail: [
                "The Spanish wanted to defend their new colony from the English.  The Spanish had been building forts in the Caribbean for centuries, but the English had been building forts in the Caribbean for centuries.  The Spanish wanted to defend their new colony from the English.  The Spanish had been building forts in the Caribbean for centuries, but the English had been building forts in the Caribbean for centuries.  The Spanish wanted to defend their new colony from the English.  The Spanish had been building forts in the Caribbean for centuries, but the English had been building forts in the Caribbean for centuries.  The Spanish wanted to defend their new colony from the English.  The Spanish had been building forts in the Caribbean for centuries, but the English had been building forts in the Caribbean for centuries.  The Spanish had been building forts in the Caribbean for centuries, but the English had been building forts in the Caribbean for centuries.  The Spanish had been building forts in the Caribbean for centuries, but the English had been building forts in the Caribbean for centuries.  The Spanish had been building forts in the Caribbean for centuries, but the English had been building forts in the Caribbean for centuries.  The Spanish"
            ]
        }));


    engine.register("US history chap 3 #3",
        executor.create("How did the Pueblo attempt to maintain their autonomy in the face of Spanish settlement?", {
            pass: [
                "Through revolt",
                "They attempted to maintain their autonomy in the face of Spanish settlement by launching a coordinated rebellion against the Spanish.",
                "They attempted to maintain their autonomy in the face of Spanish settlement by attempting to fold Christian traditions into their own practices. However, Spanish priests insisted that natives discard their old ways entirely and angered the Pueblo by focusing on the young, drawing them away from their parents. This deep insult, combined with an extended period of drought and increased attacks by local Apache and Navajo in the 1670s—troubles that the Pueblo came to believe were linked to the Spanish presence—moved the Pueblo to push the Spanish and their religion from the area."
            ],
            fail: [
                "The Pueblo Revolt of 1680 was a failure.  The Spanish, who had been the dominant power in the region for centuries, were unable to convert the Pueblo to Catholicism.  The Pueblo Revolt of 1680 was a failure.  The Spanish, who had been the dominant power in the region for centuries, were unable to convert the Pueblo to Catholicism.  The Pueblo Revolt of 1680 was a failure.  The Spanish, who had been the dominant power in the region for centuries, were unable to convert the Pueblo to Catholicism.  The Spanish, who had been the dominant power in the region for centuries, were unable to convert the Pueblo to Catholicism.  The Spanish, who had been the dominant power in the region for centuries, were unable to convert the Pueblo to Catholicism.  The Spanish, who had been the dominant power in the region for centuries, were unable to convert the Pueblo to Catholicism.  The Spanish, who had been the dominant power in the region for centuries, were unable to convert the Pueblo to Catholicism.  The Spanish, who had been the dominant power in the region for centuries, were unable to convert"
            ]
        }));

    engine.register("US history chap 3 #4",
        executor.create("What was patroonship?", {
            pass: [
                "A Dutch system of granting tracts of land in New Netherland to encourage colonization",
                "A system of granting tracts of land in New Netherland",
                "A patroonship was a large tract of land in the colony of New Netherland, which was granted by the Dutch West India Company to a patroon, or patron, in exchange for settling a specified number of colonists there.",
                "A patroonship was a large tract of land in the New Netherland colony that was granted to a patroon, or lord, by the Dutch West India Company.",
                "A patroonship was a large tract of land in the Hudson Valley that was granted to a patroon, or lord, by the Dutch West India Company.",
                "Patroonship was a system of land distribution in the colony of New Netherland.",
                "A patroonship was a large tract of land in the New Netherland colony that was granted to a patroon, or patron, by the Dutch West India Company.",
                "Patroonship was a system of land ownership in the Dutch colony of New Netherland."
            ],
            fail: [
                "The Dutch West India Company granted patroonships to large estates in the Hudson River Valley.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in the colony.  The patroonships were granted to Dutch merchants who invested heavily in"
            ]
        }));

    engine.register("US history chap 3 #5",
        executor.create("Which religious order joined the French settlement in Canada and tried to convert the natives to Christianity?", {
            pass: [
                "Jesuits",
                "The Jesuits."
            ],
            fail: [
                "The Society of Jesus."
            ]
        }));

    engine.register("US history chap 3 #7",
        executor.create("What was the most lucrative product of the Chesapeake colonies?", {
            pass: [
                "tobacco",
                "Tobacco.",
                "The tabacco trade"
            ],
            fail: [
                "Tobacco.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the Chesapeake colonies.  The tobacco industry was the most lucrative of all the industries in the"
            ]
        }));

    engine.register("US history chap 3 #8",
        executor.create("What was the primary cause of Bacon’s Rebellion ?", {
            pass: [
                "former indentured servants wanted more opportunities to expand their territory",
                "Former indentured servants wanted more opportunities to expand their territory.",
                "Bacon and his followers, who saw all Native peoples as an obstacle to their access to land, pursued a policy of extermination",
                "Bacon’s Rebellion was caused by the English settlers’ desire for more land.",
                "Bacon’s Rebellion was caused by the Virginia government’s Indian policy.",
                "Bacon’s Rebellion stemmed from a small dispute between a Virginia land owner and the Doeg, but its causes ran much deeper.",
                "The primary cause of Bacon’s Rebellion was the governor’s attempt to force the Indians to move to the west side of the James River.",
                "The primary cause of Bacon’s Rebellion was the governor’s policy of encouraging the settlement of the colony by Englishmen."
            ],
            fail: [
                "Berkeley’s refusal to let the people go out against the Indians.  The  source of the rebellion was Berkeley’s refusal to let the people go out against the Indians.  The  source of the rebellion was Berkeley’s refusal to let the people go out against the Indians.  36  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go out against the Indians.  Berkeley’s refusal to let the people go"
            ]
        }));

    engine.register("US history chap 3 #9",
        executor.create("The founders of the Plymouth colony were?", {
            pass: [
                "Puritans",
                "Puritans ",
                "Puritans.",
                "Pilgrims",
                "The Pilgrims.",
                "Separatists."
            ],
            fail: [
                "_____________"
            ]
        }));

    engine.register("US history chap 3 #12",
        executor.create("What was the Middle Passage?", {
            pass: [
                "The transatlantic journey that enslaved Africans made to America",
                "The Middle Passage was the transatlantic journey that enslaved Africans made to America.",
                "the journey slaves took from Africa to the Americas",
                "The Middle Passage was the stage of the Atlantic slave trade in which millions of enslaved Africans were forcibly transported to the Americas as part of the triangular slave trade",
                "The Middle Passage was the leg of the triangle trade that connected Africa and the Americas.",
                "The Middle Passage was the name given to the transportation of enslaved Africans across the Atlantic Ocean to the Americas.",
                "The Middle Passage was the voyage across the Atlantic from Africa to the Americas.",
                "The Middle Passage was a hellish experience. The growing slave trade with Europeans had a profound impact on the people of West Africa, giving prominence to local chieftains and merchants who traded enslaved people for European textiles, alcohol, guns, tobacco, and food."
            ],
            fail: [
                "The Middle Passage was a part of the Indian Ocean trade network."
            ]
        }));

    engine.register("US history chap 3 #14",
        executor.create("How did European muskets change life for native peoples in the Americas?", {
            pass: [
                "Tribes with ties to Europeans had a distinct advantage in wars",
                "Guns changed the balance of power among different groups and tribes",
                "Muskets made combat more deadly",
                "They made warfare more lethal and changed traditional patterns of authority among tribes.",
                "European muskets changed life for native peoples in the Americas by making warfare more lethal and changing traditional patterns of authority among tribes."
            ],
            fail: [
                "They changed life for native peoples in the Americas.",
                "The muskets were introduced to the American Indians by Europeans.  The muskets were made of metal, and the muskets were used to kill animals.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people.  The muskets were also used to kill people."
            ]
        }));

    // // Chapter 2
    engine.register("astronomy Chapter 2 #1",
        executor.create("What fraction of the sky can be seen from the North Pole?", {
            pass: [
                "Approximately 50% like anywhere else on the planet.",
                "Only half the sky can be seen from the North Pole.",
                "Only half the sky can be seen from the North Pole, and that half does not change throughout the year."
            ],
            fail: [
                "____"
            ]
        }));
    engine.register("astronomy Chapter 2 #2",
        executor.create("How quickly we can learn about events in the universe?", {
            pass: [
                "As soon as the light from that universe reaches us",
                "Information about the universe comes to us almost exclusively through various forms of light, and all such light travels at the speed of light",
                "If a star is 100 light-years away, the light we see from it tonight left that star 100 years ago and is just now arriving in our neighborhood.  The soonest we can learn about any changes in that star is 100 years after the fact.  For a star 500 light-years away, the light we detect tonight left 500 years ago and is carrying 500-year- old news."
            ],
            fail: [
                "The speed of light is a natural unit of distance for astronomers.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum.  The speed of light is the speed of light in a vacuum"
            ]
        }));

    engine.register("astronomy Chapter 2 #3", executor.create("The Sun was once thought to be a planet. Explain why.", [
        "In the geocentric system, all of the objects that moved in the sky relative to the fixed stars were considered to be “wanderers” and the Sun was no exception, so it was classified as a planet.",
        "It was so because of the geocentric model, it was thought that the sun was just an object like other planets orbiting the earth",
        "The Sun is much closer to Earth than are the nearest stars, yet it is not possible to measure accurately the diurnal parallax of the Sun relative to the stars by measuring its position relative to background objects in the sky directly."
    ]));

    engine.register("astronomy Chapter 2 #4", executor.create("How far is the nearest galaxy from the sun?", {
        pass: [
            "75,000 light-years from the Sun",
            "75,000 light-years",
            "75,000 light-years from the Sun in the direction of the constellation Sagittarius"
        ],
        fail: [
            "____"
        ]
    }));

    engine.register("astronomy Chapter 2 #5", executor.create("What is an asterism?", [
        "A prominent pattern or group of stars, typically having a popular name but smaller than a constellation.",
        "Some people use the term asterism to denote an especially noticeable star pattern within a constellation",
        "An asterism is a pattern of stars that is not a constellation.",
        "Asterisms are patterns of stars that are not constellations.",
        "An asterism is a kind of star pattern that is visible in the sky.",
        "An asterism is a pattern of stars that is not part of a constellation."
    ]));

    engine.register("astronomy Chapter 2 #6", executor.create("Give at least one of Aristotle's arguments why he considered the earth to be round", {
        pass: [
            "First is the fact that as the Moon enters or emerges from Earth’s shadow during an eclipse of the Moon, the shape of the shadow seen on the Moon is always round",
            "Travelers who go south a significant distance are able to observe stars that are not visible farther north",
            "Aristotle reasoned that the Sun has to be farther away from Earth than is the Moon because occasionally the Moon passed exactly between Earth and the Sun and hid the Sun temporarily from view.  We call this a solar eclipse.",
        ],
        fail: [
            // TODO: this one is VERY close and if we changed the token count and removed the redundant sentences it would be way better.
            "Aristotle cited convincing arguments that Earth must be round.  First is the fact that as the Moon enters or emerges from Earth’s shadow during an eclipse of the Moon, the shape of the shadow seen on the Moon is always round (Figure 2.9).  Only a spherical object always produces a round shadow.  If Earth were a disk, for example, there would be some occasions when the sunlight would strike it edge-on and its shadow on the Moon would be a line. The more distant an object, the more nearly parallel the rays of light coming from it.  Of course, the Sun is not infinitely far away, but given its distance of 150 million kilometers, light rays striking Earth from a point on the Sun diverge from one another by an angle far too small to be observed with the unaided eye.  As a consequence, if people all over Earth who could see the Sun were to point at it, their fingers would appear to be at different distances from the Sun.  As a second argument, Aristotle explained that travelers who go south a significant distance are able to observe stars that are not visible farther north.  15.  How did Aristotle deduce that the Sun is farther away from Earth than the"
        ]
    }));

    engine.register("astronomy Chapter 2 #7", executor.create("How are the zodiacal constellations different from the other constellations?",  {
        pass: [
            "Zodiac constellations are the constellations which give the zodiac signs to people. Constellations are groups of stars that form a specific pattern and are recognized by mythological figures and have names attributed to them.",
            "Zodiac constellations are those through which the Sun appears to travel during the year",
            "The zodiacal constellations are the constellations that lie along the ecliptic.",
            "The zodiacal constellations are the constellations that the Sun, Moon, and planets appear to move through in the course of a year."
        ],
        fail: [
            "The zodiacal constellations are different from the other constellations in that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constellations are arranged in a way that they are not all in the same place.  The constell",
            "The zodiacal constellations are different from the other constellations because they are not in the same place in the sky.  The other constellations are in the same place in the sky as the Sun.  The zodiacal constellations are in the same place in the sky as the Sun, but they are not in the same place in the sky as the other constellations.  The zodiacal constellations are in the same place in the sky as the Sun, but they are not in the same place in the sky as the other constellations.  The zodiacal constellations are in the same place in the sky as the Sun, but they are not in the same place in the sky as the other constellations.  The zodiacal constellations are in the same place in the sky as the Sun, but they are not in the same place in the sky as the other constellations.  The zodiacal constellations are in the same place in the sky as the Sun, but they are not in the same place in the sky as the other constellations.  The zodiacal constellations are in the same place in the"
        ]
    }));

    // Chapter 3
    engine.register("astronomy Chapter 3 #1", executor.create("What is the orbital speed?", {
        pass: [
            "the speed with which each planet moves along its ellipse",
            "Kepler’s second law deals with the speed with which each planet moves along its ellipse, also known as its orbital speed.",
            // "48 kilometers per second."
            // "48 km/s"
        ],
        fail: [
            // this might sort of be right
            "48 kilometers per second."
        ]
    }));

    engine.register("astronomy Chapter 3 #2", executor.create("What's Newton's first law?", [
        "Every object will continue to be in a state of rest or move at a constant speed in a straight line unless it is compelled to change by an outside force.",
        "Unless it is compelled to change by an outside force, every object will continue to be in a state of rest or move at a constant speed",
        "An object in motion tends to remain in motion.",
        "An object at rest will remain at rest unless acted upon by an unbalanced force.",
        "The law of inertia."
    ]));

    engine.register("astronomy Chapter 3 #3", executor.create("Which major planet has the largest semimajor axis?", [
        "Jupiter",
        "Jupiter, The Solar System's Largest Planet"
    ]));

    engine.register("astronomy Chapter 3 #4", executor.create("Which major planet has the largest average orbital speed around the Sun?", [
        "Mercury",
        "Mercury."
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
    engine.register("astronomy Chapter 4 #1", executor.create("Why does longitude have no meaning at the North and South Poles?", {
        pass: [
            "All longitude lines meet at the pole",
            "All longitude lines meet at the poles; therefore, they have no defined longitude.",
            "Because the North and South Poles are the points on Earth where the directions north, south, east, and west are ambiguous."
        ],
        fail: [
            "Because the Sun is always above the horizon at the North Pole, and the Sun is always below the horizon at the South Pole."
        ]
    }));

    engine.register("astronomy Chapter 4 #2", executor.create("What are the main advantage and disadvantage of apparent solar time?", {
        pass: [
            "The main advantage is that we can tell the exact time with a sundial (assuming it's sunny). The disadvantage is that every locality has its own time.",
            "The main advantage is that it is simple. The main disadvantage is that it is not very convenient to use.",
            "The main advantage is that it is based on the actual position of the Sun in the sky.  The main disadvantage is that it is not very convenient to use."
        ],
        fail: [
            "The main advantage of apparent solar time is that it is easy to use.  It is based on the position of the Sun in the sky, and it is easy to tell what time it is by looking at the Sun.  The main disadvantage of apparent solar time is that it is not very accurate.  The length of an apparent solar day varies slightly during the year.  The length of a mean solar day is constant.  The length of a sidereal day is defined by the positions of the stars in the sky.  The length of a sidereal day is constant.  The length of a sidereal day is defined by the positions of the stars in the sky.  The length of a sidereal day is constant.  The length of a sidereal day is defined by the positions of the stars in the sky.  The length of a sidereal day is constant.  The length of a sidereal day is defined by the positions of the stars in the sky.  The length of a sidereal day is constant.  The length of a sidereal day is defined by the positions of the stars in the sky.  The length of a sidereal day is constant.  The length of a sidereal day is"
        ]
    }));

    engine.register("astronomy Chapter 4 #3", executor.create("What's the rotation period of Earth?", [
        "One day",
        "1 day",
        "A single day",
        "1.00 day"
    ]));

    engine.register("astronomy Chapter 4 #4", executor.create("Why is it difficult to construct a practical calendar based on the Moon’s cycle of phases?", [
        "Because the period required by the moon to complete its cycle of phases is 29.5306 days",
        "Because it's not a whole number",
        "Because the Moon’s cycle of phases is not commensurable with the day, month, or year.",
        "Because the Moon’s period of rotation is the same as its period of revolution, the Moon’s phases are not commensurable with the solar year."
    ]));

    engine.register("astronomy Chapter 4 #5", executor.create("What is the phase of the Moon during a total solar eclipse?", [
        "new moon",
        "when the moon passes directly between the sun and Earth",
        "A solar eclipse can only take place at the phase of new moon",
        "The Moon blocks the Sun during new moon phase as seen from some parts of Earth and casts a shadow on our planet."
    ]));

    engine.register("astronomy Chapter 4 #6", executor.create("Why is the leap year necessary?", {
        pass: [
            "to help synchronize the calendar year with the solar year",
            "The leap year is necessary to make the average length of the year in the Julian calendar 365.25 days.",
            "The leap year is necessary because the year is not exactly 365.25 days."
        ],
        fail: [
            "The Gregorian calendar was adopted in 1582, and the year 1800 was not a leap year."
        ]
    }));

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
        "Because the Moon’s orbit is tilted with respect to the ecliptic plane.",
        "Because the Moon’s orbit is tilted relative to the plane of Earth’s orbit about the Sun by about 5°.  As a result, during most months, the Moon is sufficiently above or below the ecliptic plane to avoid an eclipse.  But when the two paths cross (twice a year), it is then “eclipse season” and eclipses are possible."
    ]));

    engine.register("astronomy Chapter 4 #9", executor.create("Why some places have very small tides while in other places huge tides?", {
        pass: [
            "the presence of land masses stopping the flow of water",
            "the friction in the oceans and between oceans and the ocean floors",
            "the rotation of Earth",
            "the wind",
            "the variable depth of the ocean."
        ],
        fail: [
            "The tides are caused by the Moon’s gravitational pull on the oceans.  The Moon’s pull is strongest at the points where the Moon is closest to Earth.  The Moon’s pull is weakest at the points where the Moon is farthest from Earth.  The Moon’s pull is strongest at the points where the Moon is at its closest to Earth.  The Moon’s pull is weakest at the points where the Moon is at its farthest from Earth.  The Moon’s pull is strongest at the points where the Moon is at its closest to Earth.  The Moon’s pull is weakest at the points where the Moon is at its farthest from Earth.  The Moon’s pull is strongest at the points where the Moon is at its closest to Earth.  The Moon’s pull is weakest at the points where the Moon is at its farthest from Earth.  The Moon’s pull is strongest at the points where the Moon is at its closest to Earth.  The Moon’s pull is weakest at the points where the Moon is at its farthest from Earth.  The Moon’s pull is strongest at the points where"
        ]
    }));

    engine.xregister("Who founded the Elmer Candy Corporation?", executor.create("Who founded the Elmer Candy Corporation?", [
        "Christopher Henry Miller"
    ]));

    engine.xregister("When did the Elmer brothers came up with cornmeal based cheese curl?",
        executor.create("When did the Elmer brothers came up with cornmeal based cheese curl?", [
            "In 1936."
        ]));

    engine.xregister('When was the CheeWees trademark registered?',
        executor.create("When was the CheeWees trademark registered?", [
            "__UNKNOWN__"
        ]));

    engine.xregister('president of Elmer Candy Corporation', executor.create("president of Elmer Candy Corporation", [
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

    engine.xregister("Venezuela visa exemption #2",
        executor.create("How long is the Visa exemption for Venezuela for holders of passports from Turkey?", [
            '30 days'
        ]));

    return engine;

}

async function doRegression(opts: ExecutorOpts) {

    const engine = createRegressionEngine(opts);

    const result = await engine.exec();

    const summarizer = (results: ReadonlyArray<IRegressionTestResultExecuted<any, unknown>>) => {

        const cost
            = results.map(current => (current.metadata || {}).cost as number || 0)
                     .reduce(Reducers.SUM);

        // eslint-disable-next-line camelcase
        const cost_max
            = results.map(current => (current.metadata || {}).cost as number || 0)
            .reduce(Reducers.MAX);

        return {
            cost: Numbers.toFixedFloat(cost, 2),
            cost_max: Numbers.toFixedFloat(cost_max, 2)
        };

    }

    const report = result.createReport(['cost', 'question', 'answer'], summarizer);

    async function writeReportToConsole() {
        console.log(report);
    }

    async function writeReportToFile() {
        const path = `regression-report-${opts.request.id}.txt`;
        await Files.writeFileAsync(path, report);
    }

    await writeReportToConsole();
    await writeReportToFile();

}

export interface IRegressionAnswerExecutorRequest extends Required<Pick<IAnswerExecutorRequest, 'search_model' | 'model' | 'rerank_elasticsearch' | 'rerank_elasticsearch_size' | 'rerank_elasticsearch_model' | 'rerank_truncate_short_head' | 'prune_contiguous_records' | 'filter_question'>> {

    /**
     * A unique ID for this executor so that we can keep track of the config
     * options by name.
     */
    readonly id: IDStr;

}



// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExecutorOpts {
    readonly request: IRegressionAnswerExecutorRequest;
}

export interface IRegressionExpectations {

    readonly pass: ReadonlyArray<string>;

    readonly fail: ReadonlyArray<string>;

}

interface IExecutor {
    readonly create: (question: string, expectedAnswer: string | ReadonlyArray<string> | IRegressionExpectations) => () => Promise<IRegressionTestResultPass<string> | IRegressionTestResultError<'failed' | 'no-answer'>>;
    readonly executeQuestion: (question: string, forEmail?: string) => Promise<string>;
    readonly assertQuestionAndAnswer: (question: string, expectedAnswer: string | ReadonlyArray<string>) => Promise<void>;
}

function createExecutor(opts: ExecutorOpts) : IExecutor {

    function create(question: string,
                    expectations: string | ReadonlyArray<string> | IRegressionExpectations,
                    forEmail = 'burton@inputneuron.io'): () => Promise<IRegressionTestResultPass<string> | IRegressionTestResultError<'failed' | 'no-answer'>> {

        return async () => {

            const uid = await getUID(forEmail);

            // create a delegate that runs the requests to the AnswerExecutor directly
            // eslint-disable-next-line camelcase
            const answer_executor_delegate = async () => await AnswerExecutor.exec({
                uid,
                question,
                ...opts.request
            });

            // now create an executor that uses the cache which uses the answer_executor_delegate
            // NOTE/IMPORTANT: if we change the answer-executor algorithm we can purge the cache
            // by just using a new namespace  Technically this would be using a *new* cache and
            // just not caring about the old data.

            // eslint-disable-next-line camelcase
            const answer_executor_with_cache
                = AsyncCaches.wrapper<AnswerExecutor.IAnswerExecutorRequestWithUID,
                                      IAnswerExecutorResponse |  IAnswerExecutorError>('answer-executor',
                                                                                       ['disk', 'google-cloud-storage'],
                                                                                       'test-only')
                             .create(answer_executor_delegate);

            // eslint-disable-next-line camelcase
            const answer_response = await answer_executor_with_cache({
                uid,
                question,
                ...opts.request
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

                function computeStatus(): ResultStatus {

                    function toRegressionExpectations(): IRegressionExpectations {

                        if (typeof expectations === 'string') {

                            return {
                                pass: [expectations],
                                fail: []
                            }

                        } else if (Array.isArray(expectations)) {

                            return {
                                pass: [...expectations],
                                fail: []
                            }
                        } else if (typeof expectations === 'object') {
                            return expectations as any;
                        }

                        throw new Error();

                    }

                    const regressionExpectations = toRegressionExpectations();

                    if (regressionExpectations.pass.map(canonicalize).includes(canonicalize(answer))) {
                        return 'pass';
                    }

                    if (regressionExpectations.fail.map(canonicalize).includes(canonicalize(answer))) {
                        return 'fail';
                    }

                    return 'unknown';

                }

                const status = computeStatus();

                return {
                    status,
                    actual: answer,
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
            request: {
                id: 'v1',
                search_model: 'ada',
                model: 'ada',
                rerank_elasticsearch: false,
                rerank_elasticsearch_size: 10000,
                rerank_elasticsearch_model: 'ada',
                rerank_truncate_short_head: false,
                prune_contiguous_records: false,
                filter_question: 'part-of-speech',
            }
        },
        {
            request: {
                id: 'v2',
                model: 'curie',
                search_model: 'curie',
                rerank_elasticsearch: true,
                rerank_elasticsearch_size: 10000,
                rerank_elasticsearch_model: 'ada',
                rerank_truncate_short_head: true,
                prune_contiguous_records: true,
                filter_question: 'part-of-speech',
            }
        },
        {
            request: {
                id: 'v3',
                model: 'curie',
                search_model: 'curie',
                rerank_elasticsearch: true,
                rerank_elasticsearch_size: 10000,
                rerank_elasticsearch_model: 'ada',
                rerank_truncate_short_head: true,
                prune_contiguous_records: true,
                filter_question: 'part-of-speech-noun',
            }
        }

    ]

    for (const opts of options) {
        console.log("===== Running regression with opts: " + JSON.stringify(opts, null, '  '));
        await doRegression(opts);
    }

}

main()
    .catch(err => console.error("Failed to run regression: ", err));
