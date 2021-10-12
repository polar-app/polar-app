import {PDFShingleParser} from "./PDFShingleParser";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("PDFShingleParser", function() {

    this.timeout(60000)

    xit("basic", async () => {

        // const targetPage = 1
        // const skipPages = Numbers.range(1, targetPage);
        // const maxPages = targetPage + 2;

        const skipPages = undefined;
        const maxPages = 2;

        const url = FilePaths.toURL('/Users/burton/plusone.pdf')

        const result: any[] = [];

        await PDFShingleParser.parse({url, skipPages, maxPages, filterCompleteSentences: true}, async (event) => {

            const {shingles} = event;

            result.push(shingles);

        })

        assertJSON(result, [
            [
                {
                    "text": "Baeten\n1 Department of Orthopaedic Surgery, Amsterdam UMC, University of Amsterdam, Amsterdam, The\nNetherlands, 2 Department of Rheumatology and Clinical Immunology, Amsterdam UMC, University of\nAmsterdam, Amsterdam Rheumatology and Immunology Center, Amsterdam, The Netherlands,\n3 Department of Intensive Care Medicine, Nijmegen Institute for Infection, Inflammation and Immunity,\nRadboudUMC Nijmegen, Nijmegen, The Netherlands, 4 Reade, Amsterdam Rheumatology and Immunology\nCenter, Amsterdam, The Netherlands, 5 Department of Rheumatology and Clinical Immunology, Amsterdam\nUMC, Vrije Universiteit Amsterdam, Amsterdam, The Netherlands, 6 Department of Rheumatology, Sint\nMaartenskliniek, Nijmegen, The Netherlands, 7 Department of Rheumatology, RadboudUMC Nijmegen,\nNijmegen, The Netherlands\n☯ These authors contributed equally to this work.  * g.a.buijze@amc.uva.nl\nAbstract\nObjectives\nThe primary objective of this trial was to assess safety and anti-inflammatory effects of an\nadd-on training program involving breathing exercises, cold exposure, and meditation in\npatients with axial spondyloarthritis\nMethods\nThis study was an open-label, randomised, one-way crossover clinical proof-of-concept\ntrial.  Twenty-four patients with moderately active axial spondyloarthritis(ASDAS >2.1) and\nhs-CRP �5mg/L were included and randomised to an intervention (n = 13) and control\ngroup (n = 11) group that additionally received the intervention after the control period.  The\nintervention period lasted for 8 weeks."
                },
                {
                    "text": "Twenty-four patients with moderately active axial spondyloarthritis(ASDAS >2.1) and\nhs-CRP �5mg/L were included and randomised to an intervention (n = 13) and control\ngroup (n = 11) group that additionally received the intervention after the control period.  The\nintervention period lasted for 8 weeks.  The primary endpoint was safety, secondary end-\npoints were change in hs-CRP, serum calprotectin levels and ESR over the 8-week period.  Exploratory endpoints included disease activity measured by ASDAS-CRP and BASDAI,\nquality of life (SF-36, EQ-5D, EQ-5D VAS), and hospital anxiety and depression (HADS)."
                },
                {
                    "text": "The primary endpoint was safety, secondary end-\npoints were change in hs-CRP, serum calprotectin levels and ESR over the 8-week period.  Exploratory endpoints included disease activity measured by ASDAS-CRP and BASDAI,\nquality of life (SF-36, EQ-5D, EQ-5D VAS), and hospital anxiety and depression (HADS).  Results\nWe found no significant differences in adverse events between groups, with one serious\nadverse event occurring 8 weeks after end of the intervention and judged ‘unrelated’.  During\nPLOS ONE | https://doi.org/10.1371/journal.pone.0225749 December 2, 2019 1 / 11\na1111111111\na1111111111\na1111111111\na1111111111\na1111111111\nOPEN ACCESS\nCitation: Buijze GA, De Jong HMY, Kox M, van de\nSande MG, Van Schaardenburg D, Van Vugt RM, et\nal. (2019) An add-on training program involving\nbreathing exercises, cold exposure, and meditation\nattenuates inflammation and disease activity in\naxial spondyloarthritis – A proof of concept trial."
                },
                {
                    "text": "Results\nWe found no significant differences in adverse events between groups, with one serious\nadverse event occurring 8 weeks after end of the intervention and judged ‘unrelated’.  During\nPLOS ONE | https://doi.org/10.1371/journal.pone.0225749 December 2, 2019 1 / 11\na1111111111\na1111111111\na1111111111\na1111111111\na1111111111\nOPEN ACCESS\nCitation: Buijze GA, De Jong HMY, Kox M, van de\nSande MG, Van Schaardenburg D, Van Vugt RM, et\nal. (2019) An add-on training program involving\nbreathing exercises, cold exposure, and meditation\nattenuates inflammation and disease activity in\naxial spondyloarthritis – A proof of concept trial.  https://doi.org/\n10.1371/journal.pone.0225749\nEditor: Johannes Fleckenstein, University of Bern,\nSWITZERLAND\nReceived: April 17, 2019\nAccepted: November 7, 2019\nPublished: December 2, 2019\nCopyright: © 2019 Buijze et al.  This is an open\naccess article distributed under the terms of the\nCreative Commons Attribution License, which\npermits unrestricted use, distribution, and\nreproduction in any medium, provided the original\nauthor and source are credited."
                },
                {
                    "text": "https://doi.org/\n10.1371/journal.pone.0225749\nEditor: Johannes Fleckenstein, University of Bern,\nSWITZERLAND\nReceived: April 17, 2019\nAccepted: November 7, 2019\nPublished: December 2, 2019\nCopyright: © 2019 Buijze et al.  This is an open\naccess article distributed under the terms of the\nCreative Commons Attribution License, which\npermits unrestricted use, distribution, and\nreproduction in any medium, provided the original\nauthor and source are credited.  Data Availability Statement: All relevant data are\nwithin the manuscript and its Supporting\nInformation files.  Funding: The authors received no specific funding\nfor this work."
                },
                {
                    "text": "This is an open\naccess article distributed under the terms of the\nCreative Commons Attribution License, which\npermits unrestricted use, distribution, and\nreproduction in any medium, provided the original\nauthor and source are credited.  Data Availability Statement: All relevant data are\nwithin the manuscript and its Supporting\nInformation files.  Funding: The authors received no specific funding\nfor this work.  Competing interests: The authors have declared\nthat no competing interests exist."
                }
            ],
            [
                {
                    "text": "the 8-week intervention period, there was a significant decline of ESR from (median [inter-\nquartile range] to 16 [9–26.5] to 9 [5–23] mm/hr, p = 0.040, whereas no effect was found in\nthe control group (from 14 [8.3–27.3] to 16 [5–37] m/hr, p = 0.406).  ASDAS-CRP declined\nfrom 3.1 [2.5–3.6] to 2.3 [1.9–3.2] in the intervention group (p = 0.044).  A similar trend was\nobserved for serum calprotectin (p = 0.064 in the intervention group versus p = 0.182 in the\ncontrol group), but not for hs-CRP.  Conclusions\nThis proof-of-concept study in axial spondyloarthritis met its primary endpoint with no safety\nsignals during the intervention."
                },
                {
                    "text": "A similar trend was\nobserved for serum calprotectin (p = 0.064 in the intervention group versus p = 0.182 in the\ncontrol group), but not for hs-CRP.  Conclusions\nThis proof-of-concept study in axial spondyloarthritis met its primary endpoint with no safety\nsignals during the intervention.  There was a significant decrease in ESR levels and ASDAS-\nCRP upon the add-on training program in the intervention group.  These findings warrant\nfull-scale randomised controlled trials of this novel therapeutic approach in patients with\ninflammatory conditions."
                },
                {
                    "text": "There was a significant decrease in ESR levels and ASDAS-\nCRP upon the add-on training program in the intervention group.  These findings warrant\nfull-scale randomised controlled trials of this novel therapeutic approach in patients with\ninflammatory conditions.  Trial registration\nClinicalTrials.gov; NCT02744014\nIntroduction\nPrevious research in healthy individuals exposed to experimental endotoxemia showed that\nthe innate immune response can be voluntarily modulated by a training program involving\nbreathing exercises, exposure to cold and meditation (further referred to as: ‘add-on training\nprogram’).[1,2] Practicing the techniques learned in the add-on training program induced\nintermittent respiratory alkalosis and hypoxia, as well as profoundly increased plasma epi-\nnephrine levels, indicating activation of the sympathetic nervous system.  These changes corre-\nlated with increased plasma levels of the anti-inflammatory cytokine IL-10 and attenuated\nlevels of pro-inflammatory mediators such as TNF-α, IL-6, and IL-8 during experimental\nendotoxemia.[2]\nThe study of Kox et al[2] evaluated short term effects of this add-on training program in a\ncontrolled experimental model of acute inflammation in healthy individuals."
                },
                {
                    "text": "Trial registration\nClinicalTrials.gov; NCT02744014\nIntroduction\nPrevious research in healthy individuals exposed to experimental endotoxemia showed that\nthe innate immune response can be voluntarily modulated by a training program involving\nbreathing exercises, exposure to cold and meditation (further referred to as: ‘add-on training\nprogram’).[1,2] Practicing the techniques learned in the add-on training program induced\nintermittent respiratory alkalosis and hypoxia, as well as profoundly increased plasma epi-\nnephrine levels, indicating activation of the sympathetic nervous system.  These changes corre-\nlated with increased plasma levels of the anti-inflammatory cytokine IL-10 and attenuated\nlevels of pro-inflammatory mediators such as TNF-α, IL-6, and IL-8 during experimental\nendotoxemia.[2]\nThe study of Kox et al[2] evaluated short term effects of this add-on training program in a\ncontrolled experimental model of acute inflammation in healthy individuals.  It is unknown\nwhether the same intervention could potentially lead to suppression of inflammation in\npatients with chronic inflammatory diseases.  And, more importantly, it is not known whether\nthis training program can safely be applied in patients with a chronic inflammatory disorder."
                },
                {
                    "text": "It is unknown\nwhether the same intervention could potentially lead to suppression of inflammation in\npatients with chronic inflammatory diseases.  And, more importantly, it is not known whether\nthis training program can safely be applied in patients with a chronic inflammatory disorder.  We designed a proof of concept (PoC) trial aimed to assess whether this well-defined add-\non training program could modulate innate immune responses in a prototypical chronic\ninflammatory disease.  We selected axial spondyloarthritis (axSpA)[3] as model disease since\nthis chronic rheumatic inflammation of the spine a) involves altered innate immune\nresponses,[4, 5] b) affects mainly young adults with few comorbidities and concomitant medi-\ncation, allowing for an unbiased efficacy and safety assessment, and c) persists often for years\nas stable mild-to-moderate disease."
                },
                {
                    "text": "We designed a proof of concept (PoC) trial aimed to assess whether this well-defined add-\non training program could modulate innate immune responses in a prototypical chronic\ninflammatory disease.  We selected axial spondyloarthritis (axSpA)[3] as model disease since\nthis chronic rheumatic inflammation of the spine a) involves altered innate immune\nresponses,[4, 5] b) affects mainly young adults with few comorbidities and concomitant medi-\ncation, allowing for an unbiased efficacy and safety assessment, and c) persists often for years\nas stable mild-to-moderate disease.  Despite recent advances in therapeutic options for axSpA\nit is still not possible to sufficiently control disease activity in all patients, as only 60–70% of the\npatients respond to treatment, of whom 30% only partially.  Remission is only achieved in 20%\nof the patients."
                },
                {
                    "text": "Despite recent advances in therapeutic options for axSpA\nit is still not possible to sufficiently control disease activity in all patients, as only 60–70% of the\npatients respond to treatment, of whom 30% only partially.  Remission is only achieved in 20%\nof the patients.  This indicates a clear opportunity for additional treatment options, such as the\nadd-on training program, to improve the outcome in these patients.  Add-on training program in axial spondyloarthritis\nPLOS ONE | https://doi.org/10.1371/journal.pone.0225749 December 2, 2019 2 / 11"
                }
            ]
        ])

    });

})
