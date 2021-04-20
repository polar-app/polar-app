import * as React from "react"

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Box, CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "../gatsby-theme-material-ui-top-layout/docsTheme";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    fontSize: "16px",
    "&:hover": {
      color: "rgb(102, 98, 217)",
    },
  },
});
const Landing = ({}) => {
  const classes = useStyles();
  return (
    <Layout>
      <SEO
        description="How PDFs appear in Polar App"
        title="Document Previews"
        lang="en"
      />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          style={{
            margin: 0,
            backgroundColor: "#525252",
          }}
        >
          <Box style={{ width: "85vw", maxWidth: "890px", margin: "0 auto" }}>
            <p style={{ marginTop: "0px", paddingTop: "5%" }}>
              <a
                className={classes.link}
                href="https://beta.getpolarized.io/d/A%20phenotypic%20in%C2%A0vitro%20model%20for%20the%20main%20determinants%20of%20human%20whole%20heart%20function/0x113GYakP1bLZzQvpNx9S"
              >
                A phenotypic in vitro model for the main determinants of human
                whole heart function
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Optimum%20Dataset%20method%20%E2%80%93%20examples%20of%20the%20application/0x116h1jMdrcyhr15a6VYp"
              >
                The Optimum Dataset method – examples of the application
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Limitation%20of%20Electron%20Density%20by%20the%20Patterson%20Function/0x117gQsBRqRy59Adru6yK"
              >
                Limitation of Electron Density by the Patterson Function
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/An%20Innovative%20Approach%20for%20E-Government%20Transformation/0x119QiPrqYDnmk9kYBWDs"
              >
                An Innovative Approach for E-Government Transformation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Tropical%20Sod%20Webworm%20(Lepidoptera%3A%20Crambidae)%3A%20a%20Pest%20of%20Warm%20Season%20Turfgrasses/0x11DEd4SVqXAbf1gvHEqp"
              >
                Tropical Sod Webworm (Lepidoptera: Crambidae): a Pest of Warm
                Season Turfgrasses
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Frais%20de%20d%C3%A9placement%20pour%20les%20conf%C3%A9rences%20des%20soci%C3%A9t%C3%A9s%20savantes/0x11KSJGXrpYMtxzyUfQaH"
              >
                Frais de déplacement pour les conférences des sociétés savantes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20inser%C3%A7%C3%A3o%20da%20imprensa%20no%20discurso%20do%20terceiro%20setor.%20An%C3%A1lise%20do%20Projeto%20Cidad%C3%A3o%202001%20-%20Correio%20Popular%20e%20Coluna%20Social%20-%20Folha%20de%20S.%20Paulo/0x11PWbJe7fEaMBrA8SLck"
              >
                A inserção da imprensa no discurso do terceiro setor. Análise do
                Projeto Cidadão 2001 - Correio Popular e Coluna Social - Folha
                de S. Paulo
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Electromagnetic%20Interference%20Shielding%20Effectiveness%20and%20Mechanical%20Properties%20of%20MWCNT-reinforced%20Polypropylene%20Nanocomposites/0x1216EyPJ35H6EbVas8om"
              >
                Electromagnetic Interference Shielding Effectiveness and
                Mechanical Properties of MWCNT-reinforced Polypropylene
                Nanocomposites
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Gene%20expression%20comparison%20of%20biopsies%20from%20Duchenne%20muscular%20dystrophy%20(DMD)%20and%20normal%20skeletal%20muscle/0x121MxsknHVHQ3S1C94LX"
              >
                Gene expression comparison of biopsies from Duchenne muscular
                dystrophy (DMD) and normal skeletal muscle
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Plasticity%20in%20lunar%20timing%20of%20larval%20release%20of%20two%20brooding%20pocilloporid%20corals%20in%20an%20internal%20tide%E2%80%91induced%20upwelling%20reef/0x121TCJZBfWTWkWjvJ2Dp"
              >
                Plasticity in lunar timing of larval release of two brooding
                pocilloporid corals in an internal tide‑induced upwelling reef
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20Dilute%20Acid%20-%20Alkaline%20Pretreatment%20on%20Rice%20Husk%20Composition%20and%20Hydrodynamic%20Modeling%20with%20CFD/0x121n1QBhYHF7AMv16igu"
              >
                Effect of Dilute Acid - Alkaline Pretreatment on Rice Husk
                Composition and Hydrodynamic Modeling with CFD
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/O%20conceito%20de%20Metadesign%3A%20O%20Colloquium%20on%20Metadesign%2C%20na%20Universidade%20Goldsmiths%20em%20Londres/0x1221i9SiTQkVrBjTLHUk"
              >
                O conceito de Metadesign: O Colloquium on Metadesign, na
                Universidade Goldsmiths em Londres
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Calculating%20Corporate%20Compliance%20%26%20The%20Foreign%20Corrupt%20Practices%20Act/0x1226DhsJiaD9qwZZfBBt"
              >
                Calculating Corporate Compliance & The Foreign Corrupt Practices
                Act
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Segmentation%20and%20localisation%20of%20whole%20slide%20images%20using%20unsupervised%20learning/0x1226unxakyUc1FuoHBZR"
              >
                Segmentation and localisation of whole slide images using
                unsupervised learning
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x122ao1Bcn2Yiyvnzb6jD"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/INFLUENCE%20DU%20POLOXAL%C3%88NE%20SUR%20LES%20M%C3%89T%C3%89ORISATIONS%2C%20LES%20QUANTIT%C3%89S%20D'ALIMENT%20ING%C3%89R%C3%89ES%20ET%20LA%20CROISSANCE%20DE%20TAURILLONS%20RECEVANT%20DES%20RATIONS%20CONDENS%C3%89ES/0x122oTeQhsqimBUrnyAsq"
              >
                INFLUENCE DU POLOXALÈNE SUR LES MÉTÉORISATIONS, LES QUANTITÉS
                D'ALIMENT INGÉRÉES ET LA CROISSANCE DE TAURILLONS RECEVANT DES
                RATIONS CONDENSÉES
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Stereochemistry%20of%20the%20Quaternization%20of%205-Methyl-5-nitro-1%2C%203-dialkylhexahydropyrimidines/0x1237M1xgVFaRwpHG5jEb"
              >
                The Stereochemistry of the Quaternization of 5-Methyl-5-nitro-1,
                3-dialkylhexahydropyrimidines
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Candidemia%20after%20cardiac%20surgery%20in%20the%20intensive%20care%20unit%3A%20an%20observational%20study/0x1238gTAd6qKs4K3nwYfc"
              >
                Candidemia after cardiac surgery in the intensive care unit: an
                observational study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Optimal%20function%20of%20the%20DNA%20repair%20enzyme%20TDP1%20requires%20its%20phosphorylation%20by%20ATM%20and%2For%20DNA-PK/0x1238pjJY7AgbthBeBfET"
              >
                Optimal function of the DNA repair enzyme TDP1 requires its
                phosphorylation by ATM and/or DNA-PK
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Chip%20Thickness%20and%20Microhardness%20Prediction%20Models%20during%20Turning%20of%20Medium%20Carbon%20Steel/0x123DAmr5c5UkHiVcgstb"
              >
                Chip Thickness and Microhardness Prediction Models during
                Turning of Medium Carbon Steel
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20New%20Penicillin%20(BRL%201241)%20Active%20Against%20Penicillin-resistant%20Staphylococci/0x123FhwxcqDTozZwZv4t9"
              >
                A New Penicillin (BRL 1241) Active Against Penicillin-resistant
                Staphylococci
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/DEATHLY%20SILENCE%20IMPROVES%20A%20BAT'S%20CHANCE/0x123QUz6NE2GTf8eBa1uQ"
              >
                DEATHLY SILENCE IMPROVES A BAT'S CHANCE
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Stability%20Region%20for%20Linear%20Systems%20with%20Generalized%20Frequency%20Variables/0x123SioZSvdpas4ZDtZT4"
              >
                Stability Region for Linear Systems with Generalized Frequency
                Variables
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/In-vitro%20activity%20of%20polycationic%20peptides%20against%20Cryptosporidium%20parvum%2C%20Pneumocystis%20carinii%20and%20yeast%20clinical%20isolates/0x123fxM6ifUmv3u4mJaSZ"
              >
                In-vitro activity of polycationic peptides against
                Cryptosporidium parvum, Pneumocystis carinii and yeast clinical
                isolates
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/TRENDS%20OF%20INNOVATION%20AND%20INVESTMENT%20DEVELOPMENT%20OF%20PRODUCTION%20OF%20ANIMAL%20PRODUCTION%20BY%20AGROINDUSTRIAL%20ENTERPRISES/0x123ottmDcG3cuWJMNg4A"
              >
                TRENDS OF INNOVATION AND INVESTMENT DEVELOPMENT OF PRODUCTION OF
                ANIMAL PRODUCTION BY AGROINDUSTRIAL ENTERPRISES
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effects%20of%20composition%20and%20exposure%20on%20the%20solar%20reflectance%20of%20portland%20cement%20concrete/0x123sNh6oyqqeXyJDaaAN"
              >
                Effects of composition and exposure on the solar reflectance of
                portland cement concrete
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Murine%20model%20of%20long-term%20obstructive%20jaundice/0x123vvc16k3m573ShuszA"
              >
                Murine model of long-term obstructive jaundice
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Kad%20ljubav%20ne%20mo%C5%BEe%20umrijeti...%20Ljubav%20i%20destruktivni%20diskurs%20u%20filmskim%20adaptacijama%20drame%20Friedricha%20D%C3%BCrrenmatta%20Posjet%20stare%20dame/0x12433MLd6G8Bq88WgnsY"
              >
                Kad ljubav ne može umrijeti... Ljubav i destruktivni diskurs u
                filmskim adaptacijama drame Friedricha Dürrenmatta Posjet stare
                dame
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Back%20Matters%20Vol.%202%20No.%202/0x124BMFg9P8cYqgb2iP3e"
              >
                Back Matters Vol. 2 No. 2
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Determination%20cases%20of%20bacterial%20meningitis%20in%20children%3A%20A%20clinical%20study/0x124Soyp62RDGQ1sW77Wb"
              >
                Determination cases of bacterial meningitis in children: A
                clinical study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Blockwise%20PPG%20Enhancement%20Based%20on%20Time-Variant%20Zero-Phase%20Harmonic%20Notch%20Filtering/0x124TfR6kq8Z3RQQc5SFa"
              >
                Blockwise PPG Enhancement Based on Time-Variant Zero-Phase
                Harmonic Notch Filtering
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Est%C3%A9tica%20spray%3A%20o%20grafite%20no%20campo%20da%20arte%20contempor%C3%A2nea/0x124UUixNM8juMKGWoht3"
              >
                Estética spray: o grafite no campo da arte contemporânea
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x124W8Aub73a3QTGFpZuY"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/G%C3%A9rer%20la%20victoire%3F%20Organisation%2C%20communication%2C%20strat%C3%A9gie%20de%20Robert%20Bernier%2C%20Boucherville%2C%20Ga%C3%ABtan%20Morin%20%C3%89diteur%2C%201991%2C%20344%C2%A0p./0x124YyweFkqcnhTmwc7wa"
              >
                Gérer la victoire? Organisation, communication, stratégie de
                Robert Bernier, Boucherville, Gaëtan Morin Éditeur, 1991, 344 p.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Tumor%20necrosis%20factor%20restricts%20hematopoietic%20stem%20cell%20activity%20in%20mice%3A%20involvement%20of%20two%20distinct%20receptors/0x124gojTgg75SvhULAqeN"
              >
                Tumor necrosis factor restricts hematopoietic stem cell activity
                in mice: involvement of two distinct receptors
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/DO%C4%9EU%20VE%20BATI%20T%C3%9CRK%C3%87ES%C4%B0%20KURAN%20TERC%C3%9CMELER%C4%B0NDE%20ESMA%E2%80%99%C3%9CL%20H%C3%9CSNA%E2%80%99NIN%20T%C3%9CRK%C3%87E%20S%C3%96YLEMLER%C4%B0/0x124hXERuqkSuyQj31A3g"
              >
                DOĞU VE BATI TÜRKÇESİ KURAN TERCÜMELERİNDE ESMA’ÜL HÜSNA’NIN
                TÜRKÇE SÖYLEMLERİ
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Design%20of%20magnetic%20navigation%20automatic%20guided%20vehicle%20system/0x124oqgk7VGXGeXc8nviU"
              >
                Design of magnetic navigation automatic guided vehicle system
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Tsunamigenic%20Earthquakes%20at%20Along-dip%20Double%20Segmentation%20and%20Along-strike%20Single%20Segmentation%20near%20Japan/0x124wbx8aKSzD3Mauzfnf"
              >
                Tsunamigenic Earthquakes at Along-dip Double Segmentation and
                Along-strike Single Segmentation near Japan
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%204%20from%3A%20Howell%20N%2C%20Krings%20A%2C%20Braham%20R%20(2016)%20Guide%20to%20the%20littoral%20zone%20vascular%20flora%20of%20Carolina%20bay%20lakes%20(U.S.A.).%20Biodiversity%20Data%20Journal%204%3A%20e7964.%20https%3A%2F%2Fdoi.org%2F10.3897%2FBDJ.4.e7964/0x1251x1XCDpktJ1yj8V8D"
              >
                Figure 4 from: Howell N, Krings A, Braham R (2016) Guide to the
                littoral zone vascular flora of Carolina bay lakes (U.S.A.).
                Biodiversity Data Journal 4: e7964.
                https://doi.org/10.3897/BDJ.4.e7964
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Applications%20of%20approximate%20gradient%20schemes%20for%20nonlinear%20parabolic%20equations/0x125DEcrwEi9sNFU7R7dT"
              >
                Applications of approximate gradient schemes for nonlinear
                parabolic equations
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/On%20Evaluating%20the%20Efficacy%20of%20Predictive%20Models%20for%20Cognitive%20Radio%20Spectrum%20Availability%20in%20Nigeria/0x125GXdoAn1vf7RGkRfkY"
              >
                On Evaluating the Efficacy of Predictive Models for Cognitive
                Radio Spectrum Availability in Nigeria
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Environmental%20and%20Agricultural%20Relevance%20of%20Humic%20Fractions%20Extracted%20by%20Alkali%20from%20Soils%20and%20Natural%20Waters/0x125H8UBwoH6d4ujXc46S"
              >
                Environmental and Agricultural Relevance of Humic Fractions
                Extracted by Alkali from Soils and Natural Waters
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Matching-to-sample%20accuracy%20on%20fixed-ratio%20schedules./0x125f5PgMCg8aNYUPHvyd"
              >
                Matching-to-sample accuracy on fixed-ratio schedules.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Delay%20Factors%20in%20Reconstruction%20Projects%3A%20A%20Case%20Study%20of%20Mataf%20Expansion%20Project/0x125kAP82UeJ4SVDc474w"
              >
                Delay Factors in Reconstruction Projects: A Case Study of Mataf
                Expansion Project
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Volumetric%20error%20field%20analysis%20in%20machine%20tool%20linear%20feed%20space/0x125kxGGEgP6GtsFHxScs"
              >
                Volumetric error field analysis in machine tool linear feed
                space
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%207%20Up%207%20Down%20Inventory%3A%20A%2014-item%20measure%20of%20manic%20and%20depressive%20tendencies%20carved%20from%20the%20General%20Behavior%20Inventory./0x126G2HnrcGwQFzVgswf1"
              >
                The 7 Up 7 Down Inventory: A 14-item measure of manic and
                depressive tendencies carved from the General Behavior
                Inventory.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Complete-arch%20implant-supported%20frameworks%20produced%20by%20different%20manufacturing%20techniques%20and%20materials%3A%20a%20stress%20deformation%20and%20internal%20fit%20analysis/0x126GsR1NVVeuM3dJCVVr"
              >
                Complete-arch implant-supported frameworks produced by different
                manufacturing techniques and materials: a stress deformation and
                internal fit analysis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Two%20mechanisms%20of%20ion%20selectivity%20in%20protein%20binding%20sites/0x126Yx1Hq7CpYeAmneGjE"
              >
                Two mechanisms of ion selectivity in protein binding sites
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Dorsal%20subcoeruleus%20nucleus%20(SubCD)%20involvement%20in%20context-associated%20fear%20memory%20consolidation/0x126c8LDZeE8bNhoZA856"
              >
                Dorsal subcoeruleus nucleus (SubCD) involvement in
                context-associated fear memory consolidation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Requirements%20engineering%20conferences%3A%20Wither%20industry%20tracks%3F/0x126jmotXEa9LaFi1uvf3"
              >
                Requirements engineering conferences: Wither industry tracks?
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1275RroWWJMVhEXCiPZ4"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluating%20Signalization%20and%20Channelization%20Selections%20at%20Intersections%20Based%20on%20an%20Entropy%20Method/0x127JBBz8TGRcVFb3bak3"
              >
                Evaluating Signalization and Channelization Selections at
                Intersections Based on an Entropy Method
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Knowledge%20and%20Risk%20Perception%20toward%20HIV%2FAIDS%20among%20Students%20of%20the%20University%20of%20Prishtina%20%E2%80%9CHasan%20Prishtina%E2%80%9D/0x127JYbMQxtgkJeX9Woa2"
              >
                Knowledge and Risk Perception toward HIV/AIDS among Students of
                the University of Prishtina “Hasan Prishtina”
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%C3%A7%C3%B5es%20locais%20e%20preven%C3%A7%C3%A3o%3A%20um%20estudo%20com%20adolescentes%20que%20vivem%20em%20%C3%A1reas%20de%20risco%20socioambiental/0x127TKdhTqFoEWoYCfoTP"
              >
                Ações locais e prevenção: um estudo com adolescentes que vivem
                em áreas de risco socioambiental
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Fractional%20integral%20associated%20with%20Schr%C3%B6dinger%20operator%20on%20vanishing%20generalized%20Morrey%20spaces/0x127XDMUs6pS8EPnmWbY1"
              >
                Fractional integral associated with Schrödinger operator on
                vanishing generalized Morrey spaces
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x127YqGyEsnBS4ppFunJn"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Digital%20sensor%20and%20controller%20for%20two-rail%20electrically%20driven%20vehicles/0x127mPRwGzXvFjRJgdXRH"
              >
                Digital sensor and controller for two-rail electrically driven
                vehicles
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Nightingales%20respond%20more%20strongly%20to%20vocal%20leaders%20of%20simulated%20dyadic%20interactions/0x127q1AuBVD4mg8C3DXic"
              >
                Nightingales respond more strongly to vocal leaders of simulated
                dyadic interactions
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Electronic%20Spectra%20and%20Photochemical%20Properties%20of%20Acetyldihydroquinolinones/0x127tdg7frLkRCc8kNzXp"
              >
                Electronic Spectra and Photochemical Properties of
                Acetyldihydroquinolinones
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Polar%20side%20chains%20drive%20the%20association%20of%20model%20transmembrane%20peptides/0x1286PRYyo9bjeQQbVQVA"
              >
                Polar side chains drive the association of model transmembrane
                peptides
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Binding%20of%20an%20anionic%20fluorescent%20probe%20with%20calf%20thymus%20DNA%20and%20effect%20of%20salt%20on%20the%20probe%E2%80%93DNA%20binding%3A%20a%20spectroscopic%20and%20molecular%20docking%20investigation/0x128M1qgHY8hZUCGaZFWq"
              >
                Binding of an anionic fluorescent probe with calf thymus DNA and
                effect of salt on the probe–DNA binding: a spectroscopic and
                molecular docking investigation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Impatiens%20parkinsonii%20C.E.C.Fisch.%20(Balsaminaceae)%2C%20a%20new%20addition%20to%20flora%20of%20India%20and%20notes%20on%20its%20typification/0x128Mh9PJtcHgR53qLZd5"
              >
                Impatiens parkinsonii C.E.C.Fisch. (Balsaminaceae), a new
                addition to flora of India and notes on its typification
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/OIA.%20%C3%A1dbhuta-%2C%20%C3%A1dabdha-%2C%20YAv.%20abda-%2C%20dapta-%2C%20and%20OIA.%20addh%C3%A1%2C%20OAv.%20OPers.%20azda/0x128NCurHs6zAdaJ4cbDA"
              >
                OIA. ádbhuta-, ádabdha-, YAv. abda-, dapta-, and OIA. addhá,
                OAv. OPers. azda
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Conceptual%20bases%20of%20the%20using%20of%20the%20international%20standards%20in%20accounting%20and%20internal%20audit%20of%20leasing%20operations/0x128dQtsRJ5C242UVz3oM"
              >
                Conceptual bases of the using of the international standards in
                accounting and internal audit of leasing operations
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Partitioning%20the%20etiology%20of%20hoarding%20and%20obsessive%E2%80%93compulsive%20symptoms/0x128xpikgu6DiLzwVPh9r"
              >
                Partitioning the etiology of hoarding and obsessive–compulsive
                symptoms
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20robot%20off-line%20programming%20system%20for%20welding%20intersecting%20pipe/0x1298AAm2XRoMpwmYNmv1"
              >
                A robot off-line programming system for welding intersecting
                pipe
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Well%20men%20clinic%20service%20in%20the%20primary%20health%20care%20setting/0x129Fgi8n2onooVQFDSGp"
              >
                Well men clinic service in the primary health care setting
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/CHEMICAL%20EXAMINATION%20OF%20THE%20BLOOD%20IN%20CHILDREN/0x129bE9bjZqy3AvZn1Ygb"
              >
                CHEMICAL EXAMINATION OF THE BLOOD IN CHILDREN
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Permeant%20Ion-dependent%20Changes%20in%20Gating%20of%20Kir2.1%20Inward%20Rectifier%20Potassium%20Channels/0x129cu1HiCjgM5FVV331E"
              >
                Permeant Ion-dependent Changes in Gating of Kir2.1 Inward
                Rectifier Potassium Channels
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20natural%20history%20of%20post-tubercular%20kyphosis%20in%20children/0x129i5smW5gnK2m6prbJ6"
              >
                The natural history of post-tubercular kyphosis in children
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Twisting%2C%20type-Nvacuum%20gravitational%20fields%20with%20symmetries/0x129o4jSNQX2aW5NKai6w"
              >
                Twisting, type-Nvacuum gravitational fields with symmetries
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Behavioral%20Couples%20Therapy%20for%20Alcoholism%20and%20Drug%20Abuse/0x129o5BxQy4pEcbeiJgDL"
              >
                Behavioral Couples Therapy for Alcoholism and Drug Abuse
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mental%20Health%20Screening%20Quality%20Improvement%20Learning%20Collaborative%20in%20Pediatric%20Primary%20Care/0x129p4SxnY4iQYUP5mfn5"
              >
                Mental Health Screening Quality Improvement Learning
                Collaborative in Pediatric Primary Care
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/FURNACE%20INJECTION%20OF%20ALKALINE%20SORBENTS%20FOR%20SULFURIC%20ACID%20CONTROL/0x129ryAx3puNnhTtMws2W"
              >
                FURNACE INJECTION OF ALKALINE SORBENTS FOR SULFURIC ACID CONTROL
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Flowable%20Composite%3A%20Add-On%20in%20Orthodontics/0x129wLSaxfTaajRLPFdwY"
              >
                Flowable Composite: Add-On in Orthodontics
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12A7M2hKtJe9oL8A48dL"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20New%20Paediatric%20Diabetes%20Knowledge%20Test%20%E2%80%93%20M-WIKAD%20Development%20and%20Factor%20Analysis/0x12AS4xrGbGCbbZxorZMR"
              >
                A New Paediatric Diabetes Knowledge Test – M-WIKAD Development
                and Factor Analysis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Preparing%20for%20the%20Future%20Seismic%20Hazards/0x12AWMjkJ3o4iAWTijgWh"
              >
                Preparing for the Future Seismic Hazards
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/OC07%20%E2%80%93%20Why%20should%20parents%20and%20health%20professionals%20collaborate%20to%20manage%20childhood%20long-term%20conditions%3F/0x12AYrxdqocCi75niQwWD"
              >
                OC07 – Why should parents and health professionals collaborate
                to manage childhood long-term conditions?
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/P01.07%20*%20IMPACT%20OF%20EXTRACELLULAR%20VESICLES%20RELEASED%20BY%20GLIOBLASTOMA%20CELLS%20AFTER%20IRRADIATION%20ON%20TUMOR%20MICROENVIRONMENT/0x12AezzJEKsu3CBhPRti3"
              >
                P01.07 * IMPACT OF EXTRACELLULAR VESICLES RELEASED BY
                GLIOBLASTOMA CELLS AFTER IRRADIATION ON TUMOR MICROENVIRONMENT
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Concession%20development%20as%20a%20tool%20to%20attract%20investment%20into%20the%20region%E2%80%99s%20economy/0x12Aj27NPHsnbL1MtGAgR"
              >
                Concession development as a tool to attract investment into the
                region’s economy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/ERRATA/0x12Ak2tJco3yA8o2HhsZ6"
              >
                ERRATA
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/GREEK%20AND%20ROMAN%20TOWNS-I.%20STREETS%3A%20%22Illustrated%22/0x12B41FJBTxyo7uKSQ6y7"
              >
                GREEK AND ROMAN TOWNS-I. STREETS: "Illustrated"
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Spatial%20and%20temporal%20variation%20in%20weather%20events%20critical%20for%20boreal%20agriculture%3A%20II%20Precipitation/0x12BWWsd1xmhQDAmNNANZ"
              >
                Spatial and temporal variation in weather events critical for
                boreal agriculture: II Precipitation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%E5%8F%82%E5%8A%A0%E7%AC%AC8%E6%AC%A1%E5%85%A8%E8%8B%8F%E5%8D%8A%E5%AF%BC%E4%BD%93%E4%BC%9A%E8%AE%AE%E8%AE%B0/0x12BdmciuRr5iuVof4XMv"
              >
                参加第8次全苏半导体会议记
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/XVI.%20Y%C3%BCzy%C4%B1l%20Do%C4%9Fu%20T%C3%BCrk%C3%A7esi%20ile%20Yaz%C4%B1lm%C4%B1%C5%9F%20Bir%20Kuran%20Tefsiri%3A%20Terc%C3%BCme-i%20Tefsir-i%20Yak/0x12BsUtgnNANnyAU3CbxS"
              >
                XVI. Yüzyıl Doğu Türkçesi ile Yazılmış Bir Kuran Tefsiri:
                Tercüme-i Tefsir-i Yak
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Practice%20Intentions%20of%20Family%20Physicians%20Trained%20in%20Teaching%20Health%20Centers%3A%20The%20Value%20of%20Community-Based%20Training/0x12By5GpM7x75xgK6pvjR"
              >
                Practice Intentions of Family Physicians Trained in Teaching
                Health Centers: The Value of Community-Based Training
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Propuesta%20de%20mejora%20para%20el%20control%20y%20la%20programaci%C3%B3n%20de%20la%20producci%C3%B3n%20en%20una%20f%C3%A1brica%20metal%20mec%C3%A1nica/0x12ByVionk57gRHNpw22B"
              >
                Propuesta de mejora para el control y la programación de la
                producción en una fábrica metal mecánica
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20Promising%20Prospect%20for%20Minority%20Retention%3A%20Students%20Becoming%20Peer%20Mentors/0x12CJNNfeRzwqwTWFRZr3"
              >
                A Promising Prospect for Minority Retention: Students Becoming
                Peer Mentors
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12CK6e6tQSoVqMRXSjbV"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Time%20to%20end%20the%20political%20rhetoric%20on%20health%20tourism/0x12CLMG4moUV8zzk3YGgz"
              >
                Time to end the political rhetoric on health tourism
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Older%20Romantic%20Partners%20and%20Depressive%20Symptoms%20During%20Adolescence/0x12CUtuhVdaondaYcGYnh"
              >
                Older Romantic Partners and Depressive Symptoms During
                Adolescence
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Aid%20by%20Tariff%20Reduction%3A%20Reconsideration%20from%20Dynamic%20View%20Points/0x12CnGzn6gLSyLMG2mVib"
              >
                Aid by Tariff Reduction: Reconsideration from Dynamic View
                Points
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Non-thermal%20plasma%20treatment%20improves%20chicken%20sperm%20motility%20via%20the%20regulation%20of%20demethylation%20levels/0x12Cp2cXNWcAhjkfdVt11"
              >
                Non-thermal plasma treatment improves chicken sperm motility via
                the regulation of demethylation levels
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Constrained%20Overcomplete%20Analysis%20Operator%20Learning%20for%20Cosparse%20Signal%20Modelling/0x12CtmXHUqdvHDTr1oA6F"
              >
                Constrained Overcomplete Analysis Operator Learning for Cosparse
                Signal Modelling
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluaci%C3%B3n%20del%20cultivo%20de%20Pleurotus%20ostreatus%20y%20Ganoderma%20lucidum%20(Agaricomicetes%2C%20Agaricales%20%E2%80%93%20Poyporales)%20empleando%20sustratos%20alternativos/0x12D5vvytuDNXkE4KGV6v"
              >
                Evaluación del cultivo de Pleurotus ostreatus y Ganoderma
                lucidum (Agaricomicetes, Agaricales – Poyporales) empleando
                sustratos alternativos
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Containing%20a%20Global%20Threat%3A%20The%20Virulence%20of%20Tuberculosis%20in%20Developed%20and%20Developing%20Countries/0x12DAGPebCtoGKf3DXYER"
              >
                Containing a Global Threat: The Virulence of Tuberculosis in
                Developed and Developing Countries
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Reaction%20plane%20angle%20dependence%20of%20dihadron%20azimuthal%20correlations%20from%20a%20multiphase%20transport%20model%20calculation/0x12DFGgUUBYodBuvrL3UM"
              >
                Reaction plane angle dependence of dihadron azimuthal
                correlations from a multiphase transport model calculation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Nuclear%20magnetic%20resonance%20chemical%20shifts%20with%20the%20statistical%20average%20of%20orbital-dependent%20model%20potentials%20in%20Kohn%E2%80%93Sham%20density%20functional%20theory/0x12DGd8qkcyUTQDjMESGk"
              >
                Nuclear magnetic resonance chemical shifts with the statistical
                average of orbital-dependent model potentials in Kohn–Sham
                density functional theory
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Chronic%20treatment%20with%20the%20ACE%20inhibitor%20enalapril%20attenuates%20the%20development%20of%20frailty%20and%20differentially%20modifies%20pro-and%20anti-inflammatory%20cytokines%20in%20aging%20male%20and%20female%20C57BL%2F6%20mice/0x12DZXL74BanFTKCB855u"
              >
                Chronic treatment with the ACE inhibitor enalapril attenuates
                the development of frailty and differentially modifies pro-and
                anti-inflammatory cytokines in aging male and female C57BL/6
                mice
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Blockage%20of%20TGF-%CE%B1%20Induced%20by%20Spherical%20Silica%20Nanoparticles%20Inhibits%20Epithelial-Mesenchymal%20Transition%20and%20Proliferation%20of%20Human%20Lung%20Epithelial%20Cells/0x12DjriJJ16bjnk9Ltk3p"
              >
                Blockage of TGF-α Induced by Spherical Silica Nanoparticles
                Inhibits Epithelial-Mesenchymal Transition and Proliferation of
                Human Lung Epithelial Cells
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/CHEST%20X-P%20INFORMATION%20REQUIRED%20BY%20DIAGNOSTICIANS/0x12DpCfQ98eQ1qYJTH7hb"
              >
                CHEST X-P INFORMATION REQUIRED BY DIAGNOSTICIANS
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Endoscopic%20treatment%20of%20Zenker%E2%80%99s%20diverticulum%20using%20a%20hook%20knife/0x12DryUazVYHKGCBg2vcF"
              >
                Endoscopic treatment of Zenker’s diverticulum using a hook knife
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mechanisms%20by%20which%20hydrogen%20sulfide%20attenuates%20muscle%20function%20following%20ischemia%E2%80%93reperfusion%20injury%3A%20effects%20on%20Akt%20signaling%2C%20mitochondrial%20function%2C%20and%20apoptosis/0x12EPcW35a5jQZswRk29k"
              >
                Mechanisms by which hydrogen sulfide attenuates muscle function
                following ischemia–reperfusion injury: effects on Akt signaling,
                mitochondrial function, and apoptosis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20Pro23His%20Mutation%20Alters%20Prenatal%20Rod%20Photoreceptor%20Morphology%20in%20a%20Transgenic%20Swine%20Model%20of%20Retinitis%20Pigmentosa/0x12EsX89aND5hSYgnJTY6"
              >
                A Pro23His Mutation Alters Prenatal Rod Photoreceptor Morphology
                in a Transgenic Swine Model of Retinitis Pigmentosa
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Extremely%20wideband%20printed%20monopole%20antenna%20with%20dual%20rejection%20bands/0x12F7fbKV9tTzvBF9qmko"
              >
                Extremely wideband printed monopole antenna with dual rejection
                bands
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluation%20of%20cases%20of%20cervical%20lymphadenopathy%20in%20pediatrics%3A%20A%20clinical%20study/0x12FGjsGqfXCahXRkspvK"
              >
                Evaluation of cases of cervical lymphadenopathy in pediatrics: A
                clinical study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Dark%20atom%20solution%20for%20puzzles%20of%20direct%20dark%20matter%20searches/0x12FKxSBCKojhdiCUWgHM"
              >
                Dark atom solution for puzzles of direct dark matter searches
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Identification%20of%20Galactic%20Wind%20Candidates%20Using%20Excitation%20Maps%3A%20Tunable-Filter%20Discovery%20of%20a%20Shock-excited%20Wind%20in%20the%20Galaxy%20NGC%201482/0x12FLDmNEZVkDTM4wGvQr"
              >
                Identification of Galactic Wind Candidates Using Excitation
                Maps: Tunable-Filter Discovery of a Shock-excited Wind in the
                Galaxy NGC 1482
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/SWAP%3A%20Sun%20watcher%20with%20a%20new%20EUV%20telescope%20on%20a%20technology%20demonstration%20platform/0x12FLorZGy6ANy15rRdYW"
              >
                SWAP: Sun watcher with a new EUV telescope on a technology
                demonstration platform
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Programa%20Mais%20M%C3%A9dicos%20no%20Nordeste%3A%20avalia%C3%A7%C3%A3o%20das%20interna%C3%A7%C3%B5es%20por%20condi%C3%A7%C3%B5es%20sens%C3%ADveis%20%C3%A0%20Aten%C3%A7%C3%A3o%20Prim%C3%A1ria%20%C3%A0%20Sa%C3%BAde/0x12FNvHCrotYpygxxPCtN"
              >
                Programa Mais Médicos no Nordeste: avaliação das internações por
                condições sensíveis à Atenção Primária à Saúde
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/MicroRNA%20signature%20in%20patients%20with%20eosinophilic%20esophagitis%2C%20reversibility%20with%20glucocorticoids%2C%20and%20assessment%20as%20disease%20biomarkers/0x12FcLKHSQXgDcgt6EB16"
              >
                MicroRNA signature in patients with eosinophilic esophagitis,
                reversibility with glucocorticoids, and assessment as disease
                biomarkers
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/An%20Innovative%20Approach%20to%20Recognize%20and%20Generate%20the%20Design%20Patterns%20as%20Formative%20Concepts%20to%20Support%20the%20Design%20Computation/0x12FcviHpq97UYikxNimE"
              >
                An Innovative Approach to Recognize and Generate the Design
                Patterns as Formative Concepts to Support the Design Computation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Cloning%20and%20Characterization%20of%20Surface-Localized%20%CE%B1-Enolase%20of%20Streptococcus%20iniae%2C%20an%20Effective%20Protective%20Antigen%20in%20Mice/0x12Fdgmk3rMMCiKP6VwyM"
              >
                Cloning and Characterization of Surface-Localized α-Enolase of
                Streptococcus iniae, an Effective Protective Antigen in Mice
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Class%20II%206.7%20GHz%20Methanol%20Maser%20Association%20with%20Young%20Massive%20Cores%20Revealed%20by%20ALMA/0x12FserzvPb6eEtcfUcdu"
              >
                Class II 6.7 GHz Methanol Maser Association with Young Massive
                Cores Revealed by ALMA
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Specimen%20size%20effect%20on%20the%20residual%20properties%20of%20engineered%20cementitious%20composites%20subjected%20to%20high%20temperatures/0x12FskGjgwq2vEQVdX3tD"
              >
                Specimen size effect on the residual properties of engineered
                cementitious composites subjected to high temperatures
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Modeling%20and%20simulation%20of%20constant%20current%20converter%20in%20energy%20branch%20unit/0x12Fw732gKpJmYmyRdiXf"
              >
                Modeling and simulation of constant current converter in energy
                branch unit
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Electrical%20Characterization%20and%20Doping%20Uniformity%20Measurement%20during%20Crystalline%20Silicon%20Solar%20Cell%20Fabrication%20Using%20Hot%20Probe%20Method/0x12GEGSY6cTKPVFFBhTGR"
              >
                Electrical Characterization and Doping Uniformity Measurement
                during Crystalline Silicon Solar Cell Fabrication Using Hot
                Probe Method
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figures%2017%E2%80%9318%20from%3A%20Shaverdo%20H%2C%20Sagata%20K%2C%20Balke%20M%20(2016)%20Taxonomic%20revision%20of%20New%20Guinea%20diving%20beetles%20of%20the%20Exocelina%20danae%20group%2C%20with%20the%20description%20of%20ten%20new%20species%20(Coleoptera%2C%20Dytiscidae%2C%20Copelatinae).%20ZooKeys%20619%3A%2045-102.%20https%3A%2F%2Fdoi.org%2F10.3897%2Fzookeys.619.9951/0x12GZdnSgMsH7TBKwFhVs"
              >
                Figures 17–18 from: Shaverdo H, Sagata K, Balke M (2016)
                Taxonomic revision of New Guinea diving beetles of the Exocelina
                danae group, with the description of ten new species
                (Coleoptera, Dytiscidae, Copelatinae). ZooKeys 619: 45-102.
                https://doi.org/10.3897/zookeys.619.9951
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Phase%20Change%20Materials%20(PCM)%20for%20Solar%20Energy%20Usages%20and%20Storage%3A%20An%20Overview/0x12GfYed3WF3Es6h5zpiD"
              >
                Phase Change Materials (PCM) for Solar Energy Usages and
                Storage: An Overview
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/O%20risco%20dos%20escores%20de%20risco%20e%20o%20sonho%20pelo%20BraSCORE/0x12Gfy9eiKHX1S2yotDSm"
              >
                O risco dos escores de risco e o sonho pelo BraSCORE
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Initiation%20of%20DNA%20damage%20responses%20through%20XPG-related%20nucleases/0x12Giq66wG2TiNHSr7YPq"
              >
                Initiation of DNA damage responses through XPG-related nucleases
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Micro%20Solar%20Flare%20Apparutus%20(MiSolFA)%20Instrument%20Concept/0x12GviSNmj1cSesYCXKZs"
              >
                The Micro Solar Flare Apparutus (MiSolFA) Instrument Concept
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/High-temperature%20series%20analysis%20of%20the%20free%20energy%20and%20susceptibility%20of%20the%202D%20random-bond%20Ising%20model/0x12H2StP27NLftoTibUU6"
              >
                High-temperature series analysis of the free energy and
                susceptibility of the 2D random-bond Ising model
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Faculty%20of%201000%20evaluation%20for%20Subcellular%20topography%20of%20visually%20driven%20dendritic%20activity%20in%20the%20vertebrate%20visual%20system./0x12H2yP6aGBqhtpFzy5dV"
              >
                Faculty of 1000 evaluation for Subcellular topography of
                visually driven dendritic activity in the vertebrate visual
                system.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Funda%20menty%20teolo%20giczno%20-spo%C5%82%20eczn%20e%20wycho%20wan%20ia%20patriotyczn%20ego%20w%20katechezie%20i%20na%20lekcji%20religii/0x12H3yq6fc9w6iSwXjktq"
              >
                Funda menty teolo giczno -społ eczn e wycho wan ia patriotyczn
                ego w katechezie i na lekcji religii
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Elementos%20m%C3%ADticos%20grecolatinos%20en%20Estelas%20y%20otros%20poemas%20de%20Manuel%20Verdugo/0x12H6jsq2t2M7Gmp7aZ9o"
              >
                Elementos míticos grecolatinos en Estelas y otros poemas de
                Manuel Verdugo
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Motorizing%20CBD%20of%20Tirana.%20A%20Before%20and%20After%20Study%20in%20Tirana%20from%20Sustainability%20Point%20of%20View/0x12H7gHNoE7gvXNb4ST9o"
              >
                Motorizing CBD of Tirana. A Before and After Study in Tirana
                from Sustainability Point of View
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Health%20hazard%20evaluation%20report%3A%20HETA-85-375-1861%2C%20International%20Association%20of%20Fire%20Fighters%20(IAFF)%2C%20Los%20Angeles%2C%20California./0x12H8njVofV5sJ1STCKfp"
              >
                Health hazard evaluation report: HETA-85-375-1861, International
                Association of Fire Fighters (IAFF), Los Angeles, California.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Molecular%20Orbital%20Studies%20on%20the%20Interaction%20of%20Single%20Transition%20Metal%20Atoms%20with%20NH3%20and%20H2O%20Ligands/0x12H9D6nmjUawkcejbyuR"
              >
                Molecular Orbital Studies on the Interaction of Single
                Transition Metal Atoms with NH3 and H2O Ligands
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluation%20of%20the%20new%20%22Williams%22%20anaesthetic%20filter./0x12HCcd8XWyDxMDFzuJbe"
              >
                Evaluation of the new "Williams" anaesthetic filter.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%207%3A%20Relative%20quantification%20of%20CsLOX1%20expression%20utilizing%20different%20reference%20genes%20beneath%20the%20turn%20over%20and%20withering%20treatments./0x12HF1nqhq8nChyaJzeqy"
              >
                Figure 7: Relative quantification of CsLOX1 expression utilizing
                different reference genes beneath the turn over and withering
                treatments.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/INFLUENCE%20OF%20STATE%20FINANCING%20ON%20THE%20COMPETITIVENESS%20OF%20SPACE%20INDUSTRY/0x12HVzKDiD4GmhXW9cZSS"
              >
                INFLUENCE OF STATE FINANCING ON THE COMPETITIVENESS OF SPACE
                INDUSTRY
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Late%20style%20and%20the%20paradoxical%20poetics%20of%20the%20Schubert%E2%80%93Berio%20Renderings/0x12HZAMc4Ty2cnfGVE1jx"
              >
                Late style and the paradoxical poetics of the Schubert–Berio
                Renderings
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Neighborhood%20Deterioration%2C%20Religious%20Coping%2C%20and%20Changes%20in%20Health%20During%20Late%20Life/0x12JEeaRnSrKgbxFeiqKs"
              >
                Neighborhood Deterioration, Religious Coping, and Changes in
                Health During Late Life
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/ENERGY%20CONSUMPTION%20AND%20CO_2%20EMISSION%20DUE%20TO%20CONSTRUCTION%20OF%20DISTRICT%20PIPING/0x12JYn7W8iDwyY27HBJmS"
              >
                ENERGY CONSUMPTION AND CO_2 EMISSION DUE TO CONSTRUCTION OF
                DISTRICT PIPING
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/SUPERMASSIVE%20BLACK%20HOLES%20IN%20A%20STAR-FORMING%20GASEOUS%20CIRCUMNUCLEAR%20DISK/0x12JrCbVZGeMpNbT5fS6F"
              >
                SUPERMASSIVE BLACK HOLES IN A STAR-FORMING GASEOUS CIRCUMNUCLEAR
                DISK
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Deducing%20the%20form%20factors%20for%20shear%20used%20in%20the%20calculus%20of%20the%20displacements%20based%20on%20strain%20energy%20methods.%20Mathematical%20approach%20for%20currently%20used%20shapes/0x12JuUoQgWTNn72SeQvLX"
              >
                Deducing the form factors for shear used in the calculus of the
                displacements based on strain energy methods. Mathematical
                approach for currently used shapes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Urban%20forest%20and%20financial%20resources%20perspective%20in%20Indonesia/0x12K7Ta6HVqycERzzt1cJ"
              >
                Urban forest and financial resources perspective in Indonesia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluation%20of%20an%20Ultrasonic%20Method%20for%20Measurement%20of%20Oil%20Film%20Thickness%20in%20a%20Hydraulic%20Motor%20Piston%20Ring/0x12KRzhJ1PqhX4zEjcZLn"
              >
                Evaluation of an Ultrasonic Method for Measurement of Oil Film
                Thickness in a Hydraulic Motor Piston Ring
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Sistema%20Integral%20de%20Informaci%C3%B3n%20para%20Centros%20Comerciales%20que%20Permita%20Reducir%20los%20Problemas%20de%20Seguridad%20Operacional/0x12KZXGSQTBhUU7m1BzYw"
              >
                Sistema Integral de Información para Centros Comerciales que
                Permita Reducir los Problemas de Seguridad Operacional
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Knowledge%20of%20Grammar%20and%20Concept%20Possession/0x12KhuzdA67WCzhscSi6j"
              >
                Knowledge of Grammar and Concept Possession
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Endoscopic%20Submucosal%20Dissection%20as%20Diagnostic%20Treatment%20for%20Gastric%20Granular%20Cell%20Tumor%20Confined%20to%20the%20Submucosa/0x12L2Ahm7WE1ZaDx7fYxf"
              >
                Endoscopic Submucosal Dissection as Diagnostic Treatment for
                Gastric Granular Cell Tumor Confined to the Submucosa
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20dataflow-centric%20approach%20to%20design%20low%20power%20control%20paths%20in%20CGRAs/0x12L5RNuQaCCptHUGoxh5"
              >
                A dataflow-centric approach to design low power control paths in
                CGRAs
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Comparison%20of%20Neural%20Network%20Models%20in%20the%20Estimation%20of%20the%20Performance%20of%20Solar%20Still%20Under%20Jordanian%20Climate/0x12LVYQSAJuDc58z9EmpM"
              >
                Comparison of Neural Network Models in the Estimation of the
                Performance of Solar Still Under Jordanian Climate
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Electrical%20Control%20of%20Magnetic%20Properties%20in%20Pt%2FCo%2FAlOx%20films/0x12Lc8Pebs88xtjv7JVot"
              >
                Electrical Control of Magnetic Properties in Pt/Co/AlOx films
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Insights%20into%20the%20morphology%20of%20multicomponent%20organic%2Finorganic%20aerosols%20from%20molecular%20dynamics%20simulations/0x12Lmkid78dZKZrzSRSCf"
              >
                Insights into the morphology of multicomponent organic/inorganic
                aerosols from molecular dynamics simulations
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Escolha%20de%20pr%C3%A1ticas%20cont%C3%A1beis%20no%20Brasil%3A%20uma%20an%C3%A1lise%20sob%20a%20%C3%B3tica%20da%20hip%C3%B3tese%20dos%20covenants%20contratuais/0x12MBaabHSWp9kAag4hgD"
              >
                Escolha de práticas contábeis no Brasil: uma análise sob a ótica
                da hipótese dos covenants contratuais
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Prehospital%20emergency%20endotracheal%20intubation%20using%20the%20Bonfils%20intubation%20fiberscope/0x12MJTYHD3WG5M9DUuFL4"
              >
                Prehospital emergency endotracheal intubation using the Bonfils
                intubation fiberscope
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Chromatic%20Processing%20in%20the%20Anterior%20Optic%20Tubercle%20of%20the%20Honey%20Bee%20Brain/0x12MkaEffX49jv7QpsvaJ"
              >
                Chromatic Processing in the Anterior Optic Tubercle of the Honey
                Bee Brain
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Comparative%20studies%20of%20the%20magnetic%20dipole%20and%20electric%20quadrupole%20hyperfine%20constants%20for%20the%20ground%20and%20low%20lying%20excited%20states%20of%2025Mg%2B/0x12MpQeuKpD29YGYcHYPB"
              >
                Comparative studies of the magnetic dipole and electric
                quadrupole hyperfine constants for the ground and low lying
                excited states of 25Mg+
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Anthrax%20immune%20globulin%20improves%20hemodynamics%20and%20survival%20during%20B.%20anthracis%20toxin-induced%20shock%20in%20canines%20receiving%20titrated%20fluid%20and%20vasopressor%20support/0x12N1RyWV2Q8xyRETHCxh"
              >
                Anthrax immune globulin improves hemodynamics and survival
                during B. anthracis toxin-induced shock in canines receiving
                titrated fluid and vasopressor support
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Correla%C3%A7%C3%A3o%20do%20%C3%8Dndice%20%E2%80%9CS%E2%80%9D%20com%20Atributos%20F%C3%ADsico-H%C3%ADdricos%20em%20Solo%20Aluvial%20no%20Rio%20Grande%20do%20Norte/0x12N3VCUYHzKmaNZWAEaW"
              >
                Correlação do Índice “S” com Atributos Físico-Hídricos em Solo
                Aluvial no Rio Grande do Norte
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Building%20teachers%E2%80%99%20capacities%20one%20teacher%20at%20a%20time%20within%20a%20learning%20community%20framework%3A%20A%20retrospective%20analysis/0x12NDmdY4QM2o4kXmaUPX"
              >
                Building teachers’ capacities one teacher at a time within a
                learning community framework: A retrospective analysis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Vapor%20and%20gas%20sampling%20of%20single-shell%20tank%20241-C-111%20using%20the%20vapor%20sampling%20system/0x12NKJkiVisCwZusmQdKy"
              >
                Vapor and gas sampling of single-shell tank 241-C-111 using the
                vapor sampling system
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/New%20publications/0x12NLi4bZwaeU5RZsyWkE"
              >
                New publications
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Tegn%C3%A9r%20i%20skapar%C3%B6gonblicket.%20Gestaltningar%20av%20sambandet%20mellan%20liv%20och%20verk/0x12NNYF8uJJqHwZXXqVEC"
              >
                Tegnér i skaparögonblicket. Gestaltningar av sambandet mellan
                liv och verk
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Monocular%20focal%20retinal%20lesions%20induce%20short-term%20topographic%20plasticity%20in%20adult%20cat%20visual%20cortex/0x12NaA3T5HNJNqQC6YPtQ"
              >
                Monocular focal retinal lesions induce short-term topographic
                plasticity in adult cat visual cortex
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Economic%20research%20of%20development%20strategies%20abroad%2C%20in%20the%20USSR%20and%20modern%20Russia%3A%20a%20brief%20overview%20and%20systematization/0x12NgLVNRoSXVoZ8MHnub"
              >
                Economic research of development strategies abroad, in the USSR
                and modern Russia: a brief overview and systematization
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Changes%20of%20Structure%20of%20Zr%2FMg%20Multilayer%20X-Ray%20Mirrors%20with%20Growth%20of%20Thickness%20of%20Nanosize%20Layers%20of%20Magnesium/0x12NoSdLz7w3Mb5UEvJMW"
              >
                Changes of Structure of Zr/Mg Multilayer X-Ray Mirrors with
                Growth of Thickness of Nanosize Layers of Magnesium
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Die%20neoliberale%20Utopie%20als%20Ende%20aller%20Utopien/0x12NrpD2CYnu3HzEg4kWB"
              >
                Die neoliberale Utopie als Ende aller Utopien
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Chromosome%201p%20and%2014q%20FISH%20Analysis%20in%20Clinicopathologic%20Subsets%20of%20Meningioma%3A%20Diagnostic%20and%20prognostic%20Implications/0x12NuKZ2FVLYUqeYWGAvs"
              >
                Chromosome 1p and 14q FISH Analysis in Clinicopathologic Subsets
                of Meningioma: Diagnostic and prognostic Implications
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Reactive%20astrogliosis%20in%20response%20to%20hemorrhagic%20fever%20virus%3A%20microarray%20profile%20of%20Junin%20virus-infected%20human%20astrocytes/0x12PCqnqTqE5x1nMJG4Mz"
              >
                Reactive astrogliosis in response to hemorrhagic fever virus:
                microarray profile of Junin virus-infected human astrocytes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%E2%80%98Roller-coaster%20glaucoma%E2%80%99%3A%20An%20unusual%20complication%20of%20Marfan's%20syndrome/0x12PDcQRz7rg8JyCbbyvf"
              >
                ‘Roller-coaster glaucoma’: An unusual complication of Marfan's
                syndrome
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/On%20Effect%20of%20Spin-Density%20Wave%20Parameters%20on%20Shape%20of119Sn%20M%C3%B6ssbauer%20Spectra/0x12PjJLAqtUvUJsbG6c3z"
              >
                On Effect of Spin-Density Wave Parameters on Shape of119Sn
                Mössbauer Spectra
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Triboelectric%20Nanogenerator%20Based%20Self-Powered%20Tilt%20Sensor/0x12PkGjayEVRpkkKthtY6"
              >
                Triboelectric Nanogenerator Based Self-Powered Tilt Sensor
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Compactification%20of%20gauge%20theories%20and%20the%20gauge%20invariance%20of%20massive%20modes/0x12PkQuBU6KEwmrJNrn18"
              >
                Compactification of gauge theories and the gauge invariance of
                massive modes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/File%20S11%3A%20Flux%20distributions%20simulated%20by%20fastFVA%20and%20CHRR%2C%20as%20well%20as%20Jaccard%20indexes%20and%20p-values%20of%20iNI1159%20and%20iWV1213/0x12PnmExCNMswKZKiPpVZ"
              >
                File S11: Flux distributions simulated by fastFVA and CHRR, as
                well as Jaccard indexes and p-values of iNI1159 and iWV1213
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Calpain%20activation%20is%20upstream%20of%20caspases%20in%20radiation-induced%20apoptosis/0x12PrzwpeZgfXvVRP9Ef4"
              >
                Calpain activation is upstream of caspases in radiation-induced
                apoptosis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Booklover-Summer%20Vacation/0x12Pv2UQFEuxgbHNhyqUN"
              >
                Booklover-Summer Vacation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Ultimate%20Strength%20of%20Columns%20with%20Residual%20Stresses/0x12Q1BNwPJ1Nrzt75pYoJ"
              >
                Ultimate Strength of Columns with Residual Stresses
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Efficient%20Methylammonium%20Lead%20Trihalide%20Perovskite%20Solar%20Cells%20with%20Chloroformamidinium%20Chloride%20(Cl-FACl)%20as%20Additive/0x12QD2m4YZX1zx2EH8SLa"
              >
                Efficient Methylammonium Lead Trihalide Perovskite Solar Cells
                with Chloroformamidinium Chloride (Cl-FACl) as Additive
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Characterization%20of%20Glycine%20Ammonium%20Sulphate%20Crystals%20grown%20by%20Slow%20Evaporation%20Technique/0x12QFHebUBUmssPhdfE7T"
              >
                Characterization of Glycine Ammonium Sulphate Crystals grown by
                Slow Evaporation Technique
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pattern%20of%20attendance%20and%20predictors%20of%20default%20among%20Nigerian%20outpatients%20with%20schizophrenia/0x12QFp3SZB5X9gAhhuHzN"
              >
                Pattern of attendance and predictors of default among Nigerian
                outpatients with schizophrenia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Impacts%20of%20Exchange%20Rate%20and%20Its%20Fluctuation%20on%20the%20Internationalization%20of%20the%20RMB/0x12QVQgsAJEbEL9WUzh9G"
              >
                The Impacts of Exchange Rate and Its Fluctuation on the
                Internationalization of the RMB
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Ecology%20of%20Congruence%3A%20Past%20Meets%20Present/0x12QYvNmwxR3SXpgtA1Za"
              >
                Ecology of Congruence: Past Meets Present
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Real-Time%20Concept%20Feedback%20in%20Lectures%20for%20Botho%20University%20Students/0x12QZbquFAk1iphwkcKtb"
              >
                Real-Time Concept Feedback in Lectures for Botho University
                Students
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/OPTIMIZATION%20OF%20PURCHASING%20ACTIVITY%20EXPENSES%20BASED%20ON%20PROCESSING%20CO-OPERATION/0x12Qc4MgTsprYMdjz1h65"
              >
                OPTIMIZATION OF PURCHASING ACTIVITY EXPENSES BASED ON PROCESSING
                CO-OPERATION
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Clinical%20presentation%20and%20management%20of%20parapharyngeal%20space%20tumours/0x12QdEFPRcrkNNaX58uQa"
              >
                Clinical presentation and management of parapharyngeal space
                tumours
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/MOTIVES%20AND%20MECHANISMS%20OF%20THE%20MIND./0x12Qqm4NWNuiCm1zfzfi7"
              >
                MOTIVES AND MECHANISMS OF THE MIND.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20comparativein%20vitroactivity%20of%20relebactam%2C%20imipenem%20and%20the%20combination%20of%20the%20two%2C%20plus%20six%20comparator%20antimicrobial%20agents%20against%20432%20strains%20of%20anaerobic%20organisms%20including%20imipenem-resistant%20strains./0x12Qqp6BpjXhyJjmJwXy3"
              >
                The comparativein vitroactivity of relebactam, imipenem and the
                combination of the two, plus six comparator antimicrobial agents
                against 432 strains of anaerobic organisms including
                imipenem-resistant strains.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/PEDAGOGY%20IN%20FINNISH%20HIGHER%20EDUCATION%3A%20A%20CASE%20EXAMPLE%20OF%20H%C3%84ME%20UNIVERSITY%20OF%20APPLIED%20SCIENCES/0x12QufkmVWknZnk16zTvm"
              >
                PEDAGOGY IN FINNISH HIGHER EDUCATION: A CASE EXAMPLE OF HÄME
                UNIVERSITY OF APPLIED SCIENCES
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Water%20quality%20of%20the%20Garang%20River%2C%20Semarang%2C%20Central%20Java%2C%20Indonesia%20based%20on%20the%20government%20regulation%20standard/0x12RF8XShg9NcoGe2AR7C"
              >
                Water quality of the Garang River, Semarang, Central Java,
                Indonesia based on the government regulation standard
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Saltstone%203QCY12%20TCLP%20Results/0x12RNFjPCHUZagwKakndc"
              >
                Saltstone 3QCY12 TCLP Results
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Features%20of%20the%20Spectrum%20%D0%BEf%20Intracerebral%20Complications%20Depending%20on%20the%20Time%20of%20Onset%20of%20Acute%20Ischemic%20Stroke/0x12RU8FMGYRARVaKKHgj1"
              >
                Features of the Spectrum оf Intracerebral Complications
                Depending on the Time of Onset of Acute Ischemic Stroke
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Archeologia%20Laziale%20VIII.%20Ottavo%20incontro%20di%20studio%20del%20Comitato%20per%20l'Archeologia%20Laziale/0x12RVuAxXcdP7cnRgYY2z"
              >
                Archeologia Laziale VIII. Ottavo incontro di studio del Comitato
                per l'Archeologia Laziale
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Cereal%20Germplasm%20Resources/0x12RdNd1zBZDj8YsqnJHM"
              >
                Cereal Germplasm Resources
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Le%20rapport%20au%20corps%20et%20%C3%A0%20la%20f%C3%A9minit%C3%A9%20dans%20la%20s%C3%A9rie%20Plus%20ou%20Moins%E2%80%A6%20de%20Peggy%20Adam./0x12Rf1TZBn3Mbg5xhaQZx"
              >
                Le rapport au corps et à la féminité dans la série Plus ou
                Moins… de Peggy Adam.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%D0%A1%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B0%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%D1%84%D0%B8%D0%B7%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B9%20%D0%BA%D1%83%D0%BB%D1%8C%D1%82%D1%83%D1%80%D0%BE%D0%B9%20%D0%B8%20%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%BE%D0%BC%20%D0%B2%20%D0%9A%D0%B5%D0%BC%D0%B5%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B9%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D0%B8%20(1985%E2%80%931991)/0x12Rkq2MKXG9aEVMsV4Bf"
              >
                Структура управления физической культурой и спортом в
                Кемеровской области (1985–1991)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Sperm%20Precedence%20in%20Zebra%20Finches%20Does%20not%20Require%20Special%20Mechanisms%20of%20Sperm%20Competition/0x12RwBcanzUB859RZi6yo"
              >
                Sperm Precedence in Zebra Finches Does not Require Special
                Mechanisms of Sperm Competition
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Application%20of%20ceramics%20to%20external%20use%20patch./0x12SPnVuaK42ojdKwm6o6"
              >
                Application of ceramics to external use patch.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Modeling%20and%20Theories%20of%20Pathophysiology%20and%20Physiology%20of%20the%20Basal%20Ganglia%E2%80%93Thalamic%E2%80%93Cortical%20System%3A%20Critical%20Analysis/0x12SQYieyi7ppx3zo2iHe"
              >
                Modeling and Theories of Pathophysiology and Physiology of the
                Basal Ganglia–Thalamic–Cortical System: Critical Analysis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/On%20Contradictory%20Christology%3A%20A%20Reply%20to%20Pawl%E2%80%99s%20%E2%80%98Explosive%20Theology%E2%80%99/0x12Seake38oBLQpHCrHMj"
              >
                On Contradictory Christology: A Reply to Pawl’s ‘Explosive
                Theology’
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Effect%20of%20Various%20Antioxidants%20on%20the%20Degradation%20of%20O%2FW%20Microemulsions%20Containing%20Esterified%20Astaxanthins%20from%20%3Ci%3EHaematococcus%20pluvialis%3C%2Fi%3E/0x12SnxV2vQPerrn1YqamP"
              >
                The Effect of Various Antioxidants on the Degradation of O/W
                Microemulsions Containing Esterified Astaxanthins from{" "}
                <i>Haematococcus pluvialis</i>
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/HIV-induced%20immunosuppression%20is%20associated%20with%20colonization%20of%20the%20proximal%20gut%20by%20environmental%20bacteria/0x12SsGPeALfY8VAZHRJVE"
              >
                HIV-induced immunosuppression is associated with colonization of
                the proximal gut by environmental bacteria
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%D8%A7%D9%82%D8%B1%D8%A7%20%D8%AF%D8%B1%20%D8%AD%D9%82%D9%88%D9%82%20%D9%85%D8%AF%D9%86%DB%8C%20%D8%A7%D9%81%D8%BA%D8%A7%D9%86%D8%B3%D8%AA%D8%A7%D9%86%20%2F%20%D9%BE%DA%98%D9%88%D9%87%D8%B4%20%D9%88%20%D9%86%DA%AF%D8%A7%D8%B1%D8%B4%20%D9%85%D8%AD%D9%85%D8%AF%20%D8%B9%D8%AB%D9%85%D8%A7%D9%86%20%DA%98%D9%88%D8%A8%D9%84./0x12SvmMjBDZ1Y35SpKR7Y"
              >
                اقرا در حقوق مدنی افغانستان / پژوهش و نگارش محمد عثمان ژوبل.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%203%20from%3A%20Reshchikov%20A%20(2013)%20New%20species%20of%20Lathrolestes%20F%C3%B6rster%20(Hymenoptera%3A%20Ichneumonidae)%20from%20C%C3%B4te%20d%E2%80%99Ivoire.%20Biodiversity%20Data%20Journal%201%3A%20e1005.%20https%3A%2F%2Fdoi.org%2F10.3897%2FBDJ.1.e1005/0x12SzDJNcMKrDeNDoGDmo"
              >
                Figure 3 from: Reshchikov A (2013) New species of Lathrolestes
                Förster (Hymenoptera: Ichneumonidae) from Côte d’Ivoire.
                Biodiversity Data Journal 1: e1005.
                https://doi.org/10.3897/BDJ.1.e1005
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Construction%20and%20use%20of%20a%20microfluidic%20dissection%20platform%20for%20long-term%20imaging%20of%20cellular%20processes%20in%20budding%20yeast/0x12T6NykW1kJ7YqoBq9wS"
              >
                Construction and use of a microfluidic dissection platform for
                long-term imaging of cellular processes in budding yeast
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/T%C3%BCrk%C3%A7e%20%C3%96%C4%9Fretmeni%20Adaylar%C4%B1n%C4%B1n%20Lisans%20D%C3%BCzeyinde%20Verilen%20Yabanc%C4%B1lara%20T%C3%BCrk%C3%A7e%20%C3%96%C4%9Fretimi%20(YT%C3%96)%20Dersine%20Y%C3%B6nelik%20%C3%96zyeterlik%20Alg%C4%B1lar%C4%B1/0x12TFJcS1eKGru8qtqNbM"
              >
                Türkçe Öğretmeni Adaylarının Lisans Düzeyinde Verilen
                Yabancılara Türkçe Öğretimi (YTÖ) Dersine Yönelik Özyeterlik
                Algıları
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%202%20from%3A%20Chen%20Y%2C%20Li%20C-D%20(2017)%20A%20new%20species%2C%20first%20report%20of%20a%20male%20and%20new%20distributional%20records%20for%20three%20species%20of%20Pteroptrix%C2%A0(Hymenoptera%3A%20Aphelinidae)%20from%20China.%20Biodiversity%20Data%20Journal%205%3A%20e12387.%20https%3A%2F%2Fdoi.org%2F10.3897%2FBDJ.5.e12387/0x12TFXwTvBnnXkToeRnp7"
              >
                Figure 2 from: Chen Y, Li C-D (2017) A new species, first report
                of a male and new distributional records for three species of
                Pteroptrix (Hymenoptera: Aphelinidae) from China. Biodiversity
                Data Journal 5: e12387. https://doi.org/10.3897/BDJ.5.e12387
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Cell%20Site%20Simulators%3A%20A%20Call%20for%20More%20Protective%20Federal%20Legislation/0x12TMNB7t37BpZ49jCoNL"
              >
                Cell Site Simulators: A Call for More Protective Federal
                Legislation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12TVh5V521gCraQFcpBZ"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20repetition%20of%20drying%20and%20wetting%20on%20mechanical%20characteristics%20of%20a%20diatomaceous%20mudstone./0x12TqFRfybnUanD3Rr9JS"
              >
                Effect of repetition of drying and wetting on mechanical
                characteristics of a diatomaceous mudstone.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Confirm%20high%20standard%20basic%20farmland%20area%3A%20a%20case%20study%20in%20Huaihua%20city/0x12Twvr7yFftwp33RBJHQ"
              >
                Confirm high standard basic farmland area: a case study in
                Huaihua city
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Letters%20to%20Congressmen/0x12U2WZ31Mo3Ygi1bkJJJ"
              >
                Letters to Congressmen
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Dependence%20of%20Sensory%20Hardness%20of%20Woven%20Fabric%20on%20its%20Compressive%20Property/0x12UQcDTjUwpxuK7aomTE"
              >
                The Dependence of Sensory Hardness of Woven Fabric on its
                Compressive Property
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Nonlinear%20Dynamic%20Analysis%20of%20high%20speed%20multiple%20units%20Gear%20Transmission%20System%20with%20Wear%20Fault/0x12URAigseSJYt1QdtSYa"
              >
                Nonlinear Dynamic Analysis of high speed multiple units Gear
                Transmission System with Wear Fault
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Depress%C3%A3o%20materna%20e%20fatores%20de%20risco%20associados/0x12UV4wLYVGRfYJR58VNz"
              >
                Depressão materna e fatores de risco associados
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/RUTHVEN%2C%20I.%20and%20KELLY%2C%20D.%20(eds.)%20Interactive%20information%20seeking%2C%20behaviour%20and%20retrieval.%202011./0x12Ue2uKZfsk4pYzXPvE2"
              >
                RUTHVEN, I. and KELLY, D. (eds.) Interactive information
                seeking, behaviour and retrieval. 2011.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%D0%92%D0%9B%D0%98%D0%AF%D0%9D%D0%98%D0%95%20P%D0%90%D0%94%D0%98%D0%90%D0%A6%D0%98%D0%9E%D0%9D%D0%9D%D0%9E%D0%93%D0%9E%20%D0%98%D0%97%D0%9B%D0%A3%D0%A7%D0%95%D0%9D%D0%98%D0%AF%20%D0%9D%D0%90%20%D0%98%D0%9C%D0%9C%D0%A3%D0%9D%D0%9D%D0%A3%D0%AE%20%D0%A1%D0%98%D0%A1%D0%A2%D0%95%D0%9C%D0%A3%20(%D0%BE%D0%B1%D0%B7%D0%BE%D1%80%20%D0%BB%D0%B8%D1%82%D0%B5%D1%80%D0%B0%D1%82%D1%83%D1%80%D1%8B)/0x12UgcYr32rHn5piNHZ9d"
              >
                ВЛИЯНИЕ PАДИАЦИОННОГО ИЗЛУЧЕНИЯ НА ИММУННУЮ СИСТЕМУ (обзор
                литературы)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Complex%20estimation%20of%20the%20operation%20risk%20in%20patients%2C%20suffering%20morbid%20obesity/0x12Ugea4EdmHvVyGVZcLu"
              >
                Complex estimation of the operation risk in patients, suffering
                morbid obesity
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pr%C3%A1ticas%20educativas%20parentais%20de%20fam%C3%ADlias%20nucleares%20intactas%20e%20o%20comportamento%20de%20crian%C3%A7as%20que%20convivem%20com%20a%20depress%C3%A3o%20materna/0x12UuFavaom71KtjN3mHF"
              >
                Práticas educativas parentais de famílias nucleares intactas e o
                comportamento de crianças que convivem com a depressão materna
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Present%20State%20of%20Mathematical%20Science/0x12V6vmuYXH9Vu59N6rXE"
              >
                The Present State of Mathematical Science
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Primary%20Mediastinal%20Amyloidosis%20Diagnosed%20by%20Transbronchial%20Needle%20Aspiration/0x12V7uzNb832JWkAHHGet"
              >
                Primary Mediastinal Amyloidosis Diagnosed by Transbronchial
                Needle Aspiration
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Electric%20Dipole%20Radiation%20from%20Spinning%20Dust%20Grains/0x12VEf5HMcA9w3Ee9Gkcg"
              >
                Electric Dipole Radiation from Spinning Dust Grains
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/WAITING%20FOR%20LEFTY%3A%20A%20SPEARHEADING%20PLAY%20OF%20AGITPROP/0x12VTvL6YDDv9izza8riH"
              >
                WAITING FOR LEFTY: A SPEARHEADING PLAY OF AGITPROP
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12VdL3oixUmQJjsTzhVY"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Face%20Recognition%20using%20TSF%20Model%20and%20DWT%20based%20Multilevel%20Illumination%20Normalization/0x12VeWZZeAaUGuBg1Puds"
              >
                Face Recognition using TSF Model and DWT based Multilevel
                Illumination Normalization
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20severe%20case%20of%20neuro-Sj%C3%B6gren%E2%80%99s%20syndrome%20induced%20by%20pembrolizumab/0x12W433nFGNaWgu1FLThy"
              >
                A severe case of neuro-Sjögren’s syndrome induced by
                pembrolizumab
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Capacitive%20sensor%20and%20its%20calibration-%20A%20technique%20for%20the%20estimation%20of%20solid%20particles%20flow%20concentration/0x12WBxBF5tZXVSRTb2XcZ"
              >
                Capacitive sensor and its calibration- A technique for the
                estimation of solid particles flow concentration
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Organ%20and%20tissue%20distribution%20of%20heavy%20metals%2C%20and%20their%20growth-related%20changes%20in%20antarctic%20fish%2C%20Pagothenia%20borchgrevinki./0x12WGBi5b35CtafzYWVc5"
              >
                Organ and tissue distribution of heavy metals, and their
                growth-related changes in antarctic fish, Pagothenia
                borchgrevinki.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Type%20I%20Interferon%20Pathway%20Mediates%20Renal%20Ischemia%2FReperfusion%20Injury/0x12WjBPa3FGejQ9kBStvU"
              >
                Type I Interferon Pathway Mediates Renal Ischemia/Reperfusion
                Injury
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/IMPLEMENTATION%20OF%20CULTURAL%20TOURISM%20DEVELOPMENT%20PROGRAM%20BASED%20ON%20LOCAL%20WISDOM%20IN%20BEDULU%20VILLAGE%20REGENCY%20OF%20GIANYAR%20BALI/0x12WmMLcVjuRj3JUUvvEd"
              >
                IMPLEMENTATION OF CULTURAL TOURISM DEVELOPMENT PROGRAM BASED ON
                LOCAL WISDOM IN BEDULU VILLAGE REGENCY OF GIANYAR BALI
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Solid-State%20Lighting%20with%20High%20Brightness%2C%20High%20Efficiency%2C%20and%20Low%20Cost/0x12Wmd3UmTutSbsi3zUtq"
              >
                Solid-State Lighting with High Brightness, High Efficiency, and
                Low Cost
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Deterministic%20measurement%20and%20correction%20of%20the%20pad%20shape%20in%20full-aperture%20polishing%20processes/0x12WohEQYcDdFtFNkboe2"
              >
                Deterministic measurement and correction of the pad shape in
                full-aperture polishing processes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Potential%20Role%20of%20Edoxaban%20in%20Stroke%20Prevention%20Guidelines/0x12WtkrTRjZxJgD372HVy"
              >
                The Potential Role of Edoxaban in Stroke Prevention Guidelines
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Neosis%20-%20A%20Parasexual%20Somatic%20Reduction%20Division%20in%20Cancer/0x12X4LMM5GxNuEb57wBW9"
              >
                Neosis - A Parasexual Somatic Reduction Division in Cancer
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20effect%20of%20traditional%20hygro-thermal%20pretreatments%20on%20the%20acoustical%20characteristics%20of%20white%20mulberry%20wood%20(Morus%20alba)/0x12XBR7uFsWZcNV4SdYd2"
              >
                The effect of traditional hygro-thermal pretreatments on the
                acoustical characteristics of white mulberry wood (Morus alba)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Gamma-D%20crystallin%20gene%20(CRYGD)%20mutation%20causes%20autosomal%20dominant%20congenital%20cerulean%20cataracts/0x12XCVT4h6mw7d6Man8hS"
              >
                Gamma-D crystallin gene (CRYGD) mutation causes autosomal
                dominant congenital cerulean cataracts
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Electrodynamic%20enhancement%20of%20film%20cooling%20of%20turbine%20blades/0x12XEfn6w7gt9hcQGiaZ4"
              >
                Electrodynamic enhancement of film cooling of turbine blades
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Method%20of%20Identification%20of%20a%20Dynamic%20Object%20by%20Means%20of%20the%20Integral%20Model./0x12XVYjpp1MdWJbUEHQgd"
              >
                Method of Identification of a Dynamic Object by Means of the
                Integral Model.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20neural%20implementation%20of%20multi-attribute%20decision%20making%3A%20A%20parametric%20fMRI%20study%20with%20human%20subjects/0x12XivCVkigm2zXESRsv1"
              >
                The neural implementation of multi-attribute decision making: A
                parametric fMRI study with human subjects
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Tubular%20lysosomes%20accompany%20stimulated%20pinocytosis%20in%20macrophages/0x12XthVTt98kKsJ3qBfgM"
              >
                Tubular lysosomes accompany stimulated pinocytosis in
                macrophages
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Assessment%20of%20prevalence%20of%20obesity%20among%20children%20of%20known%20population%3A%20An%20observational%20study/0x12YAiPD4g1r76noEgzCW"
              >
                Assessment of prevalence of obesity among children of known
                population: An observational study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Magnetic%20reversal%20in%20Sm2Fe17Nypermanent%20magnets/0x12YDrDEPWtrkZoxN7xMu"
              >
                Magnetic reversal in Sm2Fe17Nypermanent magnets
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Egg%20shell%20and%20yolk%20quality%20characteristics%20of%20layers%20fed%20with%20sugarcane%20press%20residue%20in%20soya%20and%20fish%20based%20diets/0x12YLCmJfRiP7yD9hDjpw"
              >
                Egg shell and yolk quality characteristics of layers fed with
                sugarcane press residue in soya and fish based diets
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Image_5.JPEG/0x12YPwimiVarbiGQXNnGw"
              >
                Image_5.JPEG
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12YT13PzU5A2HACnFh1p"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Hormone%20content%20of%20normal%20and%20tall%20soybeans%20(Glycine%20max%20(L.)%20Merr.)/0x12YUQRvDXDNkdsLGRWTW"
              >
                Hormone content of normal and tall soybeans (Glycine max (L.)
                Merr.)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%E5%BA%94%E8%A9%B2%E6%AD%A3%E7%A1%AE%E5%AF%B9%E5%BE%85%E5%9C%B0%E7%90%86%E7%A7%91%E5%AD%A6%E4%B8%AD%E7%90%86%E8%AB%96%E5%95%8F%E9%A1%8C%E7%9A%84%E7%88%AD%E8%AB%96/0x12YVu7q1mCruiK5W76Rj"
              >
                应該正确对待地理科学中理論問題的爭論
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Vertical%20Stratification%20in%20Orb-Web%20Spiders%20(Araneidae%2C%20Araneae)%20and%20a%20Consideration%20of%20Other%20Methods%20of%20Coexistence/0x12YboM2ceNca9CTBGG3R"
              >
                Vertical Stratification in Orb-Web Spiders (Araneidae, Araneae)
                and a Consideration of Other Methods of Coexistence
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/El%20flujo%20de%20turistas%20extranjeros%20que%20llegan%20al%20Per%C3%BA%20por%20motivo%20de%20negocios%2C%20el%20%C3%ADndice%20de%20libertad%20comercial%20e%20%C3%ADndice%20libertad%20de%20inversi%C3%B3n%20son%20las%20principales%20variables%20que%20influyen%20en%20el%20crecimiento%20del%20flujo%20de%20divisas%20por%20concepto%20de%20turismo%20de%20negocios%20en%20el%20Per%C3%BA/0x12YfGsRfMHSxdRKyB8nX"
              >
                El flujo de turistas extranjeros que llegan al Perú por motivo
                de negocios, el índice de libertad comercial e índice libertad
                de inversión son las principales variables que influyen en el
                crecimiento del flujo de divisas por concepto de turismo de
                negocios en el Perú
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Herbal%20tea%20induced%20hepatic%20veno-occlusive%20disease%3A%20quantification%20of%20toxic%20alkaloid%20exposure%20in%20adults./0x12YiXFh3jRg9puWQdbtG"
              >
                Herbal tea induced hepatic veno-occlusive disease:
                quantification of toxic alkaloid exposure in adults.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Genome-wide%20diversity%20in%20temporal%20and%20regional%20populations%20of%20the%20betabaculovirus%20Erinnyis%20ello%20granulovirus%20(ErelGV)/0x12Ym1ZCGkJqTZjaAPqWo"
              >
                Genome-wide diversity in temporal and regional populations of
                the betabaculovirus Erinnyis ello granulovirus (ErelGV)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Voltammetric%20determination%20of%20cefotaxime%20using%20potassium%20peroxomonosulfate/0x12Ypr5pPwgTYLvWYG9cr"
              >
                Voltammetric determination of cefotaxime using potassium
                peroxomonosulfate
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mammalian%20Protein%20Arginine%20Methyltransferase%207%20(PRMT7)%20Specifically%20Targets%20RXR%20Sites%20in%20Lysine-%20and%20Arginine-rich%20Regions/0x12YrevK1GoMAS9kGtx6p"
              >
                Mammalian Protein Arginine Methyltransferase 7 (PRMT7)
                Specifically Targets RXR Sites in Lysine- and Arginine-rich
                Regions
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Connecting%20Rigidity%20between%20Abutment%20teeth%20and%20Retainer%20in%20R.P.D.'s.%20Part%202.%20Intensifying%20the%20conecting%20rigidity%20by%20the%20improved%20methods./0x12Yz69isdnMcuWLyRDkM"
              >
                The Connecting Rigidity between Abutment teeth and Retainer in
                R.P.D.'s. Part 2. Intensifying the conecting rigidity by the
                improved methods.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Change%20of%20access%20to%20emergency%20care%20in%20a%20repopulated%20village%20after%20the%202011%20Fukushima%20nuclear%20disaster%3A%20a%20retrospective%20observational%20study/0x12Z2wn1FcnbXHdZ3UKAB"
              >
                Change of access to emergency care in a repopulated village
                after the 2011 Fukushima nuclear disaster: a retrospective
                observational study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Role%20of%20naso-buccal%20passages%20in%20thermoregulation%20in%20sheep/0x12Z8Txm68e6agB7K3DQr"
              >
                Role of naso-buccal passages in thermoregulation in sheep
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20fundamental%20theorems%20of%20elementary%20geometry.%20An%20axiomatic%20analysis/0x12ZEKkEPS1iGCutTKjBR"
              >
                The fundamental theorems of elementary geometry. An axiomatic
                analysis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Nubase%20evaluation%20of%20nuclear%20and%20decay%20properties/0x12ZMZmtkytFrzrCAKU66"
              >
                The Nubase evaluation of nuclear and decay properties
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/P1727Investigation%20of%20P-wave%20dispersion%20in%20adult%20patients%20with%20beta-thalassemia%20major/0x12ZNniM6oJQA1UrFJrLy"
              >
                P1727Investigation of P-wave dispersion in adult patients with
                beta-thalassemia major
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Post-fledging%20Dependence%20Period%20and%20Onset%20of%20Natal%20Dispersal%20in%20Bearded%20Vultures%20(Gypaetus%20barbatus)%3A%20New%20Insights%20from%20GPS%20Satellite%20Telemetry/0x12ZTNAfcd4ijqK56SNpV"
              >
                Post-fledging Dependence Period and Onset of Natal Dispersal in
                Bearded Vultures (Gypaetus barbatus): New Insights from GPS
                Satellite Telemetry
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Molecular%20characterization%20and%20sequence%20analysis%20of%20human%20astroviruses%20circulating%20in%20Hungary/0x12ZTQL5rWnbS8HRP5LU9"
              >
                Molecular characterization and sequence analysis of human
                astroviruses circulating in Hungary
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20tailored%20antibiotic%20stewardship%20programmes%20on%20the%20appropriateness%20of%20antibiotic%20prescribing%20in%20nursing%20homes/0x12ZWo6JkoSZECAZ2iXDG"
              >
                Effect of tailored antibiotic stewardship programmes on the
                appropriateness of antibiotic prescribing in nursing homes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Sexual%20Behavior%2C%20Condom%20Use%2C%20and%20Human%20Papillomavirus%3A%20Pooled%20Analysis%20of%20the%20IARC%20Human%20Papillomavirus%20Prevalence%20Surveys/0x12ZcYzEp5DtWrBkiKQyr"
              >
                Sexual Behavior, Condom Use, and Human Papillomavirus: Pooled
                Analysis of the IARC Human Papillomavirus Prevalence Surveys
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12Zq9wuu7FbfM7qyNe9F"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/THE%20INDUCED%20DEVELOPMENT%20AND%20HISTOGENESIS%20OF%20PLASMA%20CELLS/0x12a2M5CrYPai4cq9aAF3"
              >
                THE INDUCED DEVELOPMENT AND HISTOGENESIS OF PLASMA CELLS
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Knowledge%20Strata%3A%20Reactive%20Planning%20With%20a%20Multi-Level%20Architecture/0x12a2Niyx2jj6otdUqdU4"
              >
                Knowledge Strata: Reactive Planning With a Multi-Level
                Architecture
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Relation%20between%20Tactile%20Symbol%20Edge%20and%20Identification%20of%20Tactile%20Symbol/0x12aKsoKiUpbniVaRfvYC"
              >
                Relation between Tactile Symbol Edge and Identification of
                Tactile Symbol
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Landscape%20of%20Sound%20in%20the%20Nineteenth%20and%20Twentieth%20Centuries/0x12aPjFqejikBH6dfNiiE"
              >
                The Landscape of Sound in the Nineteenth and Twentieth Centuries
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/10.%20Possibility%20of%20application%20of%20basic%20fibroblast%20growth%20factor%20and%20glycosaminoglycans%20to%20bone%20regeneration%20therapy/0x12agCSypyKN7uzFCyj4V"
              >
                10. Possibility of application of basic fibroblast growth factor
                and glycosaminoglycans to bone regeneration therapy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/An%20Agent-Based%20Model%20Simulation%20of%20Human%20Mobility%20Based%20on%20Mobile%20Phone%20Data%3A%20How%20Commuting%20Relates%20to%20Congestion/0x12apUoM8gG4JYrHpkHwx"
              >
                An Agent-Based Model Simulation of Human Mobility Based on
                Mobile Phone Data: How Commuting Relates to Congestion
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/New%20equations%20for%20estimating%20body%20cell%20mass%20from%20bioimpedance%20parallel%20models%20in%20healthy%20older%20Germans/0x12awRfyo36gFSnBpio1E"
              >
                New equations for estimating body cell mass from bioimpedance
                parallel models in healthy older Germans
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/LICHENS%20OF%20PINE%20HILL%2C%20A%20PERIDOTITE%20OUTCROP%20IN%20EASTERN%20NORTH%20AMERICA/0x12b2HQkaGLxhY4FcFyg6"
              >
                LICHENS OF PINE HILL, A PERIDOTITE OUTCROP IN EASTERN NORTH
                AMERICA
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Coding%20characters%20from%20different%20life%20stages%20for%20phylogenetic%20reconstruction%3A%20a%20case%20study%20on%20dragonfly%20adults%20and%20larvae%2C%20including%20a%20description%20of%20the%20larval%20head%20anatomy%20ofEpiophlebia%20superstes(Odonata%3A%20Epiophlebiidae)/0x12b4dRJs93fSLkHES9Qb"
              >
                Coding characters from different life stages for phylogenetic
                reconstruction: a case study on dragonfly adults and larvae,
                including a description of the larval head anatomy ofEpiophlebia
                superstes(Odonata: Epiophlebiidae)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Ultramafic-alkaline-carbonatite%20complexes%20as%20a%20result%20of%20two-stage%20melting%20of%20mantle%20plume%3A%20evidence%20from%20the%20mid-paleoproterozoic%20Tiksheozero%20intrusion%2C%20Northern%20Karelia%2C%20Russia/0x12b5Xfk7a5AQq9th7nwR"
              >
                Ultramafic-alkaline-carbonatite complexes as a result of
                two-stage melting of mantle plume: evidence from the
                mid-paleoproterozoic Tiksheozero intrusion, Northern Karelia,
                Russia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20role%20of%20trophoblastic%20microRNAs%20in%20placental%20viral%20infection/0x12bF9AtixbzxPHKkQ2rU"
              >
                The role of trophoblastic microRNAs in placental viral infection
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Apresenta%C3%A7%C3%A3o/0x12bN3JZR4hMGeKCD9A4g"
              >
                Apresentação
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12bX6vg7SyUSkcatmcN3"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Predictors%20of%20surgical%20site%20infections%20among%20patients%20undergoing%20major%20surgery%20at%20Bugando%20Medical%20Centre%20in%20Northwestern%20Tanzania/0x12bhZ6KJfrcF99SXidCr"
              >
                Predictors of surgical site infections among patients undergoing
                major surgery at Bugando Medical Centre in Northwestern Tanzania
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/An%20Environmentally%20Friendly%20Method%20for%20the%20Determination%20of%20Pentachlorophenol%20in%20Paper%20Packaging%20Materials%20Using%20Ultrasonic-Assisted%20Micellar%20Extraction/0x12bnh7aCsWQZmerzQK4m"
              >
                An Environmentally Friendly Method for the Determination of
                Pentachlorophenol in Paper Packaging Materials Using
                Ultrasonic-Assisted Micellar Extraction
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Continuity%20of%20Business%3A%20Does%20Your%20Hospital%20Have%20a%20Plan%3F/0x12br9xx3TfwS2wGpThVB"
              >
                Continuity of Business: Does Your Hospital Have a Plan?
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/P_m-saturated%20bipartite%20graphs%20with%20minimum%20size/0x12btFhJVGCGeosY2kd7e"
              >
                P_m-saturated bipartite graphs with minimum size
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Study%20of%20linear%20friction%20damper%20consisting%20of%20tilt%20lever%20supported%20with%20leaf%20spring%20and%20cylindrical%20block/0x12cDSk2fbAFHSSucASyN"
              >
                Study of linear friction damper consisting of tilt lever
                supported with leaf spring and cylindrical block
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Compliance%20with%20methotrexate%20treatment%20in%20patients%20with%20rheumatoid%20arthritis%3A%20influence%20of%20patients%E2%80%99%20beliefs%20about%20the%20medicine.%20A%20prospective%20cohort%20study/0x12cEEUqBibTmkmDrKxTs"
              >
                Compliance with methotrexate treatment in patients with
                rheumatoid arthritis: influence of patients’ beliefs about the
                medicine. A prospective cohort study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Assessment%20of%20celiac%20disease%20and%20their%20effects%20on%20quality%20of%20life%20in%20children%3A%20A%20clinical%20study/0x12cGG9zkGjsbzVdCWbxt"
              >
                Assessment of celiac disease and their effects on quality of
                life in children: A clinical study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Measuring%20the%20extent%20and%20drivers%20of%20integration%20within%20primary%20care%20teams/0x12cHsnrUsTYexVLymZGR"
              >
                Measuring the extent and drivers of integration within primary
                care teams
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Reporting%20a%20Remarkable%20Visual%20Illusion%20Due%20to%20Temporal%20Lobe%20Epilepsy%20and%20an%20Unusual%20Response%20to%20Lamotrigine/0x12cMfFaBMNaP8fAziMJi"
              >
                Reporting a Remarkable Visual Illusion Due to Temporal Lobe
                Epilepsy and an Unusual Response to Lamotrigine
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Hospital%20Especializado%20en%20Salud%20Mental/0x12cZ6E3YFJrya44hGQ1w"
              >
                Hospital Especializado en Salud Mental
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Miscellaneous%20front%20pages%2C%20Bull.%20Amer.%20Math.%20Soc.%2C%20Volume%2079%2C%20Number%204%20(1973)/0x12ch8prifQdQ8m1wJRBC"
              >
                Miscellaneous front pages, Bull. Amer. Math. Soc., Volume 79,
                Number 4 (1973)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Kesikli%20zaman%20modelleri%20kullan%C4%B1larak%20Zonguldak%2C%20Soma%20ve%20Beypazar%C4%B1%20k%C3%B6m%C3%BCrlerinin%20s%C4%B1v%C4%B1la%C5%9Ft%C4%B1rma%20mekanizmalar%C4%B1n%C4%B1n%20belirlenmesi/0x12cmjrtzGUeDybQ9vU4W"
              >
                Kesikli zaman modelleri kullanılarak Zonguldak, Soma ve
                Beypazarı kömürlerinin sıvılaştırma mekanizmalarının
                belirlenmesi
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Comparison%20of%20two%20different%20methods%20of%20reducing%20pain%20during%20vaccination%20in%20infants%3A%20A%20clinical%20study/0x12cvq1iKuNWz6RzaKaCg"
              >
                Comparison of two different methods of reducing pain during
                vaccination in infants: A clinical study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20nitrogen%20fertiliser%20applied%20to%20tef%20on%20the%20yield%20and%20N%20response%20of%20succeeding%20tef%20and%20durum%20wheat%20on%20a%20highland%20vertisol/0x12ddcgEKTSH6A2K4AyCL"
              >
                Effect of nitrogen fertiliser applied to tef on the yield and N
                response of succeeding tef and durum wheat on a highland
                vertisol
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/K%C3%B6vess%20von%20K%C3%B6vessh%C3%A1za%2C%20Hermann%20Baron/0x12dwMnf47g3V5zf4A1GN"
              >
                Kövess von Kövessháza, Hermann Baron
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Am%C3%A9lioration%20gustative%20et%20nutritive%20des%20viandes%20servies%20dans%20les%20collectivit%C3%A9s/0x12e36sE7RGthk3y2sJiB"
              >
                Amélioration gustative et nutritive des viandes servies dans les
                collectivités
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Defect%20mediated%20mechanism%20in%20undoped%2C%20Cu%20and%20Zn-doped%20TiO2%20nanocrystals%20for%20tailoring%20the%20band%20gap%20and%20magnetic%20properties/0x12e3c6He293MknzTuxdg"
              >
                Defect mediated mechanism in undoped, Cu and Zn-doped TiO2
                nanocrystals for tailoring the band gap and magnetic properties
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12e5oocdkjUHietgf6XQ"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12eUyhQY9898pQqV6g74"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Improving%20the%20Decoupling%20Analysis%20of%20the%20Regions%E2%80%99%20Eco-Economic%20Development%20(by%20the%20examples%20of%20the%20Southern%20Federal%20District%20regions%20of%20Russia)/0x12ejGVev2B3wAXLVdHor"
              >
                Improving the Decoupling Analysis of the Regions’ Eco-Economic
                Development (by the examples of the Southern Federal District
                regions of Russia)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Consumption%20Patterns%20of%20Energy%20Drinks%2C%20Vitamin%20and%20Mineral%20Supplements%20by%20Adolescents%20and%20Their%20Association%20with%20Body%20Mass%20Index/0x12f9CudBdkySdhQ9VrMt"
              >
                Consumption Patterns of Energy Drinks, Vitamin and Mineral
                Supplements by Adolescents and Their Association with Body Mass
                Index
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20security%20level%20of%20tax%20contribution%20of%20small%20businesses%20to%20the%20region%E2%80%99s%20consolidated%20budget/0x12fUgELnizF9gqBURQvw"
              >
                The security level of tax contribution of small businesses to
                the region’s consolidated budget
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/THE%20ECONOMICS%20OF%20RECYCLING%20AS%20PREMISE%20OF%20CIRCULAR%20ECONOMY%3A%20FROM%20GOVERNMENTAL%20SUPPORT%20TO%20FUNCTIONAL%20MARKETS/0x12fZCaSzCRZuemcXjbiz"
              >
                THE ECONOMICS OF RECYCLING AS PREMISE OF CIRCULAR ECONOMY: FROM
                GOVERNMENTAL SUPPORT TO FUNCTIONAL MARKETS
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Representaciones%20mentales%20de%20la%20familia%20en%20adolescentes%20con%20padres%20divorciados%20en%20Lima/0x12faAZFmfRHXHBxLvtAj"
              >
                Representaciones mentales de la familia en adolescentes con
                padres divorciados en Lima
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Botulinum%20Toxin%20in%20the%20Treatment%20of%20Tics/0x12fcJmFF1ea44sUd2KUZ"
              >
                Botulinum Toxin in the Treatment of Tics
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20Content%20Based%20Watermarking%20Scheme%20Using%20Radial%20Symmetry%20Transform%20and%20Singular%20Value%20Decomposition/0x12fei7U5XSotmK2FnJuZ"
              >
                A Content Based Watermarking Scheme Using Radial Symmetry
                Transform and Singular Value Decomposition
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Reversible%20temperature-dependent%20high-%20to%20low-spin%20transition%20in%20the%20heme%20Fe%E2%80%93Cu%20binuclear%20center%20of%20cytochrome%20ba3%20oxidase/0x12fnSHhfw7no8zspaC5m"
              >
                Reversible temperature-dependent high- to low-spin transition in
                the heme Fe–Cu binuclear center of cytochrome ba3 oxidase
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Increased%20portion%20size%20leads%20to%20a%20sustained%20increase%20in%20energy%20intake%20over%204%C2%A0d%20in%20normal-weight%20and%20overweight%20men%20and%20women/0x12foJPEWwNgT6uKMaxxk"
              >
                Increased portion size leads to a sustained increase in energy
                intake over 4 d in normal-weight and overweight men and women
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Probability%20and%20statistical%20inference/0x12fqqmWHffpTzEB7k29E"
              >
                Probability and statistical inference
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Experimental%20study%20on%20the%20natural%20frequency%20of%20tunable%20piezoelectric%20cantilever%20plate/0x12fupNgVFPtY9X1e9xfb"
              >
                Experimental study on the natural frequency of tunable
                piezoelectric cantilever plate
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Semi-captiveperiod%20projectile%20motion%20gesture%20test%20system/0x12fvD7SeGqktnMtyi4zN"
              >
                Semi-captiveperiod projectile motion gesture test system
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Consideration%20on%20the%20Q-e%20Scheme%20II.%20Theoretical%20Approach%20to%20the%20Q-e%20Scheme/0x12gFuKtnocj38nAEgY4z"
              >
                Consideration on the Q-e Scheme II. Theoretical Approach to the
                Q-e Scheme
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12gQKd6tNoNigEXJkEXZ"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12gZ6hPf5MyVHcAbfh2Z"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/THU0760-HPR%E2%80%85Patient%20advice%20line%20-%20the%20potential%20clinical%20and%20financial%20benefits%20to%20a%20rheumatology%20department/0x12gh33xps82acfwFrGCf"
              >
                THU0760-HPR Patient advice line - the potential clinical and
                financial benefits to a rheumatology department
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Das%20formas%20como%20o%20passado%20sobrevive%20no%20presente%3A%20O%20caso%20das%20ru%C3%ADnas/0x12gnqQrsEpcmgHNZCDcK"
              >
                Das formas como o passado sobrevive no presente: O caso das
                ruínas
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Legal%20Application%20and%20Resolving%20Mechanism%20of%20%E2%80%9CCampus%20Naked%20Loans%E2%80%9D%20Threat/0x12gyP4d8kha5YEv4GHK2"
              >
                The Legal Application and Resolving Mechanism of “Campus Naked
                Loans” Threat
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Alteration%20of%20the%20PKC-mediated%20signaling%20pathway%20for%20smooth%20muscle%20contraction%20in%20obstruction-induced%20hypertrophy%20of%20the%20urinary%20bladder/0x12h8HwpAWbs435DTSeJQ"
              >
                Alteration of the PKC-mediated signaling pathway for smooth
                muscle contraction in obstruction-induced hypertrophy of the
                urinary bladder
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Finite%20Rings%20with%20Large%20Anticommuting%20Probability/0x12hFexGmCFoC9AnaSRdB"
              >
                Finite Rings with Large Anticommuting Probability
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/ECOLOGY%2FEVOLUTION%3A%20Beneficial%20Birds%20and%20Bees/0x12hHiwV6C9kuivkmQ9yF"
              >
                ECOLOGY/EVOLUTION: Beneficial Birds and Bees
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Do%20Children%20Undergoing%20Cancer%20Procedures%20under%20Pharmacological%20Sedation%20Still%20Report%20Pain%20and%20Anxiety%3F%20A%20Preliminary%20Study/0x12hVEwJQVXv6vYYzGkZD"
              >
                Do Children Undergoing Cancer Procedures under Pharmacological
                Sedation Still Report Pain and Anxiety? A Preliminary Study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Examining%20Flood%20Evacuation%20Behaviors%20Using%20an%20Agent-based%20Model/0x12hdUpQeYSiFp5W1AN6M"
              >
                Examining Flood Evacuation Behaviors Using an Agent-based Model
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Qualidade%20de%20vida%20em%20pacientes%20coronariopatas/0x12hmX3236M1arfmTAUs7"
              >
                Qualidade de vida em pacientes coronariopatas
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%20Suppression%20of%20miR-26a%20attenuates%20physiological%20disturbances%20arising%20from%20exposure%20of%20Nile%20tilapia%20(%20Oreochromis%20niloticus%20)%20to%20ammonia%20/0x12hqhgz2riEwrXWcCf8p"
              >
                {" "}
                Suppression of miR-26a attenuates physiological disturbances
                arising from exposure of Nile tilapia ( Oreochromis niloticus )
                to ammonia{" "}
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12hr4rY7qENkmKEDAZuN"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Oscillatory%20behaviour%20of%20an%20equation%20arising%20from%20an%20industrial%20problem/0x12hwgT4kr77nTma4huVy"
              >
                Oscillatory behaviour of an equation arising from an industrial
                problem
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12i1dtzskC6bY83C9fS8"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Echocardiographic%20approach%20to%20shock/0x12iAPA3e6dWiyDPRP8u8"
              >
                Echocardiographic approach to shock
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Book%20Reviews/0x12iM7xdSNCtLCbjbuNs8"
              >
                Book Reviews
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Performance%20Enhancement%20of%20Test%20Case%20Prioritization%20Using%20Hybrid%20Approach/0x12iUZLEjYBEb69SS56AY"
              >
                Performance Enhancement of Test Case Prioritization Using Hybrid
                Approach
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12id5ySvRdXfH6xzsXTb"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/An%20individual-orientated%20model%20of%20the%20emergence%20of%20despotic%20and%20egalitarian%20societies/0x12jKev6ZW4scuTqJph8x"
              >
                An individual-orientated model of the emergence of despotic and
                egalitarian societies
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Recent%20Problem%20of%20Trans%20Fatty%20Acids%20in%20Human%20Milk/0x12jVZpvWLdUaezzzoB8e"
              >
                Recent Problem of Trans Fatty Acids in Human Milk
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Density-dependent%20recruitment%20rates%20in%20great%20tits%3A%20the%20importance%20of%20being%20heavier/0x12jwMx4hWmkGZsTVqVpa"
              >
                Density-dependent recruitment rates in great tits: the
                importance of being heavier
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%20In%20Vitro%20Activity%20of%20Lefamulin%20and%20Other%20Antimicrobial%20Agents%20Against%20Macrolide-Susceptible%20and%20Macrolide-Resistant%20Mycoplasma%20pneumoniae%20from%20the%20United%20States%2C%20Europe%2C%20and%20China%20/0x12jyGFkSRvHvpebHPR3c"
              >
                {" "}
                In Vitro Activity of Lefamulin and Other Antimicrobial Agents
                Against Macrolide-Susceptible and Macrolide-Resistant Mycoplasma
                pneumoniae from the United States, Europe, and China{" "}
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effective%20Care%20of%20the%20Newborn%20Infant/0x12jz7751MopgSvMMdWzm"
              >
                Effective Care of the Newborn Infant
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Research%20on%20Technology%20of%20Electromagnetic%20Protection%20for%20the%20Generator%20Control%20System/0x12k48Dgkwzo9LYxzkemg"
              >
                Research on Technology of Electromagnetic Protection for the
                Generator Control System
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Radium%20separation%20through%20complexation%20by%20aqueous%20crown%20ethers%20and%20ion%20exchange%20or%20solvent%20extraction/0x12k7zcCeHVBkRbR511bB"
              >
                Radium separation through complexation by aqueous crown ethers
                and ion exchange or solvent extraction
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/hsa-mir-30c%20promotes%20the%20invasive%20phenotype%20of%20metastatic%20breast%20cancer%20cells%20by%20targeting%20NOV%2FCCN3/0x12kR8pPTsyXzGFLWpFmK"
              >
                hsa-mir-30c promotes the invasive phenotype of metastatic breast
                cancer cells by targeting NOV/CCN3
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Indentation%20Hardness%20of%20Optical%20Glass/0x12kVQx7wTeE1omGjfu12"
              >
                Indentation Hardness of Optical Glass
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Long-term%20survival%20and%20interruption%20of%20HAART%20in%20HIV-related%20pulmonary%20hypertension/0x12kojcfLewRY6TGhwQT7"
              >
                Long-term survival and interruption of HAART in HIV-related
                pulmonary hypertension
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%207%20from%3A%20Herbin%20D%2C%20Beccacece%20HM%20(2018)%20Description%20of%20three%20new%20species%20of%20Apatelodidae%20from%20the%20southern%20neotropical%20region%20(Lepidoptera%2C%20Bombycoidea).%20In%3A%20Schmidt%20BC%2C%20Lafontaine%20JD%20(Eds)%20Contributions%20to%20the%20systematics%20of%20New%20World%20macro-moths%20VII.%20ZooKeys%20788%3A%203-17.%20https%3A%2F%2Fdoi.org%2F10.3897%2Fzookeys.788.25323/0x12kwK4X1QR7UaQjcDuFN"
              >
                Figure 7 from: Herbin D, Beccacece HM (2018) Description of
                three new species of Apatelodidae from the southern neotropical
                region (Lepidoptera, Bombycoidea). In: Schmidt BC, Lafontaine JD
                (Eds) Contributions to the systematics of New World macro-moths
                VII. ZooKeys 788: 3-17.
                https://doi.org/10.3897/zookeys.788.25323
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Simulating%20Pension%20Income%20Scenarios%20with%20penCalc%3A%20An%20Illustration%20for%20India's%20National%20Pension%20System/0x12mJRrP3dAnQAhwnxvwR"
              >
                Simulating Pension Income Scenarios with penCalc: An
                Illustration for India's National Pension System
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Incorporating%20domain%20knowledge%20in%20chemical%20and%20biomedical%20named%20entity%20recognition%20with%20word%20representations/0x12mQCA8xSCWKwnzegwVa"
              >
                Incorporating domain knowledge in chemical and biomedical named
                entity recognition with word representations
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/THE%20IMPACT%20OF%20ANTIOXIDANTS%20ON%20INFLAMMATION%20AND%20OXIDATIVE%20STRESS%20MARKERS%20IN%20OSTEOARTHRITIS%20RAT%20MODEL%3A%20SCANNING%20ELECTRON%20MICROSCOPE%20INSIGHTS/0x12miE92fjC1x99DWq2LR"
              >
                THE IMPACT OF ANTIOXIDANTS ON INFLAMMATION AND OXIDATIVE STRESS
                MARKERS IN OSTEOARTHRITIS RAT MODEL: SCANNING ELECTRON
                MICROSCOPE INSIGHTS
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mitigaci%C3%B3n%20de%20los%20impactos%20en%20los%20plazos%20de%20ejecuci%C3%B3n%20de%20un%20proyecto%20de%20construcci%C3%B3n%20de%20una%20compa%C3%B1%C3%ADa%20minera/0x12miVccqp1V4Uh6RNctw"
              >
                Mitigación de los impactos en los plazos de ejecución de un
                proyecto de construcción de una compañía minera
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Francisco%20de%20Velasco%20y%20los%20catalanes.%20Sitio%20y%20capitulaci%C3%B3n%20de%20Barcelona%2C%201705/0x12n3ph9Ghhdg78KCoMQQ"
              >
                Francisco de Velasco y los catalanes. Sitio y capitulación de
                Barcelona, 1705
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Digital%20economic%20space%3A%20formation%2C%20laws%2C%20modeling/0x12nLoEvBsYgecarmUTqr"
              >
                Digital economic space: formation, laws, modeling
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Turn%C3%AAs%20de%20Guerrilha%3A%20as%20estrat%C3%A9gias%20de%20empreendedorismo%20musical%20nos%20circuitos%20do%20rock%20no%20exterior/0x12nV4avruBWbqSPKdWXC"
              >
                Turnês de Guerrilha: as estratégias de empreendedorismo musical
                nos circuitos do rock no exterior
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/About%20the%20Finite%20Element%20Analysis%20for%20Beam-Hinged%20Frame/0x12nioYTe5bWTYdVbBp3Y"
              >
                About the Finite Element Analysis for Beam-Hinged Frame
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%E8%A7%A3%E6%94%BE%E5%BE%8C%E7%9A%84%E5%89%8D%E4%B8%AD%E5%A4%AE%E7%A0%94%E7%A9%B6%E9%99%A2%E5%8C%96%E5%AD%B8%E7%A9%B6%E7%A0%94%E6%89%80/0x12o7DYPMJMxQuaYWcp18"
              >
                解放後的前中央研究院化學究研所
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Visualising%20quantum%20effective%20action%20calculations%20in%20zero%20dimensions/0x12oPcSWqhEz4Kg1xYgZ5"
              >
                Visualising quantum effective action calculations in zero
                dimensions
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Planetary%20rover%20localization%20within%20orbital%20maps/0x12oVSCxaGZ66ZKao4AmN"
              >
                Planetary rover localization within orbital maps
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Letter%20to%20the%20Editor%3A%20Response%20to%20book%20review%20of%20Telephone%20Calls%20From%20the%20Dead./0x12onxfeXzqhfRc9v8Lyx"
              >
                Letter to the Editor: Response to book review of Telephone Calls
                From the Dead.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Loss%20of%20microRNA-143%2F145%20disturbs%20cellular%20growth%20and%20apoptosis%20of%20human%20epithelial%20cancers%20by%20impairing%20the%20MDM2-p53%20feedback%20loop/0x12ooRn8mYs3n1BoMbPsn"
              >
                Loss of microRNA-143/145 disturbs cellular growth and apoptosis
                of human epithelial cancers by impairing the MDM2-p53 feedback
                loop
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12otyi1qRqiVe3WPEM28"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Factores%20que%20determinan%20por%20qu%C3%A9%20las%20mujeres%2C%20entre%2020%20y%2040%20a%C3%B1os%20del%20NSE%20B%20y%20C%20en%20Lima%20Metropolitana%2C%20no%20compran%20ropa%20femenina%20en%20portales%20online/0x12p6fguGrmWVihqzATUp"
              >
                Factores que determinan por qué las mujeres, entre 20 y 40 años
                del NSE B y C en Lima Metropolitana, no compran ropa femenina en
                portales online
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Estudios%20de%20caso%20para%20una%20iconografi%CC%81a%20de%20protesta/0x12p8ngx17Wzn8rB9SQWK"
              >
                Estudios de caso para una iconografía de protesta
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Resonant%20X-ray%20Scattering%20of%20carbonyl%20sulfide%20at%20the%20sulfur%20K%20edge/0x12pvibWxHBmrdVeoQ3YM"
              >
                Resonant X-ray Scattering of carbonyl sulfide at the sulfur K
                edge
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effet%20de%20la%20fertilisation%20%C3%A0%20base%20des%20d%C3%A9jections%20de%20porc%20sur%20la%20production%20du%20zooplancton/0x12q37y3XDBsmh6zpQvqo"
              >
                Effet de la fertilisation à base des déjections de porc sur la
                production du zooplancton
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Purification%20of%20an%20oestrophilic%20protein%20from%20calf%20uterus/0x12qAevcPfcd7mWEoSogv"
              >
                Purification of an oestrophilic protein from calf uterus
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20no-fault%20compensation%20system%20for%20medical%20injury%20is%20long%20overdue/0x12qChvzctW9UkmvHXzJ9"
              >
                A no-fault compensation system for medical injury is long
                overdue
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Ueber%20das%20Vorkommen%20von%20Zucker%20im%20Urin%20gesunder%20Menschen/0x12qMq6o2qwmAkcvJS1zr"
              >
                Ueber das Vorkommen von Zucker im Urin gesunder Menschen
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20common%20source%20for%20neutrino%20and%20sparticle%20masses/0x12qR4jU6fL9CNutP4J4P"
              >
                A common source for neutrino and sparticle masses
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/FR171456%20is%20a%20specific%20inhibitor%20of%20mammalian%20NSDHL%20and%20yeast%20Erg26p/0x12qTABBNvSzqc8ZgRSZm"
              >
                FR171456 is a specific inhibitor of mammalian NSDHL and yeast
                Erg26p
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Clinicopathologic%20heterogeneity%20in%20frontotemporal%20dementia%20and%20parkinsonism%20linked%20to%20chromosome%2017%20(FTDP-17)%20due%20to%20microtubule-associated%20protein%20tau%20(MAPT)%20p.P301L%20mutation%2C%20including%20a%20patient%20with%20globular%20glial%20tauopathy/0x12qjsGvcnaDBCMzWVujx"
              >
                Clinicopathologic heterogeneity in frontotemporal dementia and
                parkinsonism linked to chromosome 17 (FTDP-17) due to
                microtubule-associated protein tau (MAPT) p.P301L mutation,
                including a patient with globular glial tauopathy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Optimal%20consumption%20and%20asset%20allocation%20with%20unknown%20income%20growth/0x12qpy8ahq1KUnCuwMVsD"
              >
                Optimal consumption and asset allocation with unknown income
                growth
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Contribui%C3%A7%C3%A3o%20%C3%A0%20qu%C3%ADmica%20supramolecular%20de%20polipirazinas%20de%20rut%C3%AAnio(II)/0x12rKaRiC1Cs3nRwfvydi"
              >
                Contribuição à química supramolecular de polipirazinas de
                rutênio(II)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Current%20and%20future%20land%20use%20and%20land%20cover%20scenarios%20in%20the%20Arroio%20Marrecas%20watershed/0x12rVczDKPDQtZAMHKsZG"
              >
                Current and future land use and land cover scenarios in the
                Arroio Marrecas watershed
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Role%20of%20L-Ficolin%2FMannose-Binding%20Lectin-Associated%20Serine%20Protease%20Complexes%20in%20the%20Opsonophagocytosis%20of%20Type%20III%20Group%20B%20Streptococci/0x12rYpkD3aawaGKod43fQ"
              >
                Role of L-Ficolin/Mannose-Binding Lectin-Associated Serine
                Protease Complexes in the Opsonophagocytosis of Type III Group B
                Streptococci
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Form%2C%20diagrams%20and%20topologies/0x12rzpqU8aGPeEo3QrXeL"
              >
                Form, diagrams and topologies
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20Inorganic%20and%20Organic%20Fertilizers%20on%20the%20Performance%20and%20Profitability%20of%20Grain%20Amaranth%20(Amaranthus%20caudatus%20L.)%20in%20Western%20Kenya/0x12s76YUe2LdVjbBW8P3K"
              >
                Effect of Inorganic and Organic Fertilizers on the Performance
                and Profitability of Grain Amaranth (Amaranthus caudatus L.) in
                Western Kenya
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%D8%B1%D9%88%D8%A7%D9%86%D8%B4%D9%86%D8%A7%D8%B3%D9%8A%20%D8%AC%D8%A7%D9%86%D8%A8%D8%A7%D8%B1%D9%8A%20%D9%88%D9%85%D8%B9%D9%84%D9%88%D9%84%D9%8A%D8%AA%20%2F%20%D8%B9%D9%84%D9%8A%20%D8%A7%D8%B3%D9%84%D8%A7%D9%85%D9%8A%20%D9%86%D8%B3%D8%A8./0x12sHh9aHjhth5jXJVdWv"
              >
                روانشناسي جانباري ومعلوليت / علي اسلامي نسب.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Social%20instability%20increases%20plasma%20testosterone%20in%20a%20year-round%20territorial%20neotropical%20bird/0x12sT8gkj2ztXSsBZfgSf"
              >
                Social instability increases plasma testosterone in a year-round
                territorial neotropical bird
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Tecnoci%C3%AAncia%2C%20democracia%20e%20os%20desafios%20%C3%A9ticos%20das%20biotecnologias%20no%20Brasil/0x12sdhbHjuzWf82odLiCN"
              >
                Tecnociência, democracia e os desafios éticos das biotecnologias
                no Brasil
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12snKx6xSgAR5ZCbZkwe"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Journal%20of%20researches%20into%20the%20natural%20history%20and%20geology%20of%20the%20countries%20visited%20during%20the%20voyage%20of%20H.%20M.%20S.%20Beagle%20round%20the%20world%2C%20under%20the%20command%20of%20Capt.%20Fitz%20Roy%20%2F%20by%20Charles%20Darwin./0x12ss9rMNeryMNrb7pXFK"
              >
                Journal of researches into the natural history and geology of
                the countries visited during the voyage of H. M. S. Beagle round
                the world, under the command of Capt. Fitz Roy / by Charles
                Darwin.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Anatomical%20investigation%20of%20potential%20contacts%20between%20climbing%20fibers%20and%20cerebellar%20Golgi%20cells%20in%20the%20mouse/0x12suFAgtpFiutoDtVAnA"
              >
                Anatomical investigation of potential contacts between climbing
                fibers and cerebellar Golgi cells in the mouse
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Performance%20evaluation%20of%20foxtail%20amaranth%20(Amaranthus%20gangeticus)%20and%20GIFT%20tilapia%20grown%20in%20a%20recirculating%20aquaponics%20system/0x12tTnzziAHGnyU4zbnxb"
              >
                Performance evaluation of foxtail amaranth (Amaranthus
                gangeticus) and GIFT tilapia grown in a recirculating aquaponics
                system
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Effect%20of%20Oriental%20Medicine%20(Dai-Sai-Ko-Tou)%20with%20Probucol%20on%20Lipoprotein%20Metabolism%20in%20Non-Insulin%20Dependent%20Diabetics%20with%20Hypercholesterolemia/0x12tahEpMu2JHH6PbZAbo"
              >
                The Effect of Oriental Medicine (Dai-Sai-Ko-Tou) with Probucol
                on Lipoprotein Metabolism in Non-Insulin Dependent Diabetics
                with Hypercholesterolemia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12tnHDCD81VRGcutAe6S"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Supplemental%20Information%205%3A%20Stable%20isotope%20composition%20of%20paired%20embryonic%20muscle%20and%20lens%20tissues/0x12tqhNZCBwMzdQ2k214s"
              >
                Supplemental Information 5: Stable isotope composition of paired
                embryonic muscle and lens tissues
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/SMBE%20Editors%20and%20Council/0x12tr4cP9kcrjSjX2Jcib"
              >
                SMBE Editors and Council
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Open%20Problem%20Concerning%20Fourier%20Transforms%20of%20Radial%20Functions%20in%20Euclidean%20Space%20and%20on%20Spheres/0x12uJwgb26HaQ3oZBSfPF"
              >
                Open Problem Concerning Fourier Transforms of Radial Functions
                in Euclidean Space and on Spheres
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Trade%20and%20investment%20liberalization%20as%20determinants%20of%20multilateral%20environmental%20agreement%20membership/0x12uRrowJRgDWrCr5tk25"
              >
                Trade and investment liberalization as determinants of
                multilateral environmental agreement membership
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Announcements/0x12uSH8rbCyoK7aqPMePN"
              >
                Announcements
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Macular%20Dystrophy%20in%20Kjellin%E2%80%99s%20Syndrome%3A%20A%20Case%20Report/0x12uUqQH7NAZcExvBYC1E"
              >
                Macular Dystrophy in Kjellin’s Syndrome: A Case Report
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Programming%20a%20User%20Model%20with%20Data%20Gathered%20from%20a%20User%20Profile/0x12uVQHFx7W1QNJ91KaCx"
              >
                Programming a User Model with Data Gathered from a User Profile
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Circadian%20control%20of%CE%B2-cell%20function%20and%20stress%20responses/0x12uXsw1Wvu43w6rAcBKr"
              >
                Circadian control ofβ-cell function and stress responses
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/STUDIES%20IN%20GLYCINE-2-C14%20METABOLISM%20IN%20MAN.%20I.%20THE%20PULMONARY%20EXCRETION%20OF%20C14O21/0x12uksU1W9RunUjrc2vyR"
              >
                STUDIES IN GLYCINE-2-C14 METABOLISM IN MAN. I. THE PULMONARY
                EXCRETION OF C14O21
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/MOSFET%20Based%20Parallel%20Inductance%20Simulator/0x12utdSjUTrjqjMhLWY6P"
              >
                MOSFET Based Parallel Inductance Simulator
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/An%20Alternative%20Home%3F%20ASEAN%20and%20Pacific%20Environmental%20Migration/0x12uzjbmWtsutbHCZwABv"
              >
                An Alternative Home? ASEAN and Pacific Environmental Migration
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/JAMA%20Dermatology/0x12uzpmyj1Q8bqkd4D3GH"
              >
                JAMA Dermatology
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x12v7kTU74egMGZqwrHyj"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/On%20the%20role%20of%20tip%20curvature%20on%20flapping%20plates/0x12vEcm1U4H8Y3WpxjqU2"
              >
                On the role of tip curvature on flapping plates
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Emile%20Benveniste%20as%20Theorist%20of%20Poetic%20Discourse/0x12vEs4u75VDeqHVWjx8C"
              >
                Emile Benveniste as Theorist of Poetic Discourse
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Environmental%20Law%3A%20Protecting%20Clean%20Air%3A%20The%20Authority%20of%20Indian%20Governments%20to%20Regulate%20Reservation%20Airsheds/0x12vWF8Q8PLq7Yy2nRtTH"
              >
                Environmental Law: Protecting Clean Air: The Authority of Indian
                Governments to Regulate Reservation Airsheds
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pr%C3%A1cticas%20parentales%2C%20estilo%20parental%20autoritativo%20y%20afrontamiento%20al%20estr%C3%A9s%20en%20adolescentes%20de%20una%20escuela%20diferenciada%20s%C3%B3lo%20para%20varones/0x12veboChHRWMJM6TyzjZ"
              >
                Prácticas parentales, estilo parental autoritativo y
                afrontamiento al estrés en adolescentes de una escuela
                diferenciada sólo para varones
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Directing%20rural%20cooperatives%20in%20uncertain%20environments/0x12vnfkqnakdm79dmG9tJ"
              >
                Directing rural cooperatives in uncertain environments
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Register%20integration%3A%20a%20simple%20and%20efficient%20implementation%20of%20squash%20reuse/0x12voMLSXdZxhedYN4bYi"
              >
                Register integration: a simple and efficient implementation of
                squash reuse
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/National%20minorities%20and%20interethnic%20relations%20on%20the%20Balkans/0x12vvSq1ohejCkyk6TE1F"
              >
                National minorities and interethnic relations on the Balkans
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/750%20GeV%20diphoton%20resonance%20in%20a%20vector-like%20extension%20of%20Hill%20model%20at%20a%20100%20TeV%20hadron%20collider/0x12w57vCsQurFe3xNDPcj"
              >
                750 GeV diphoton resonance in a vector-like extension of Hill
                model at a 100 TeV hadron collider
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Changes%20in%20pre-hospital%20management%20of%20vascular%20risk%20factors%20among%20patients%20admitted%20due%20to%20recurrent%20stroke%20in%20Poland%20from%201995%20to%202013/0x12wDhURypszEFnWwgjTQ"
              >
                Changes in pre-hospital management of vascular risk factors
                among patients admitted due to recurrent stroke in Poland from
                1995 to 2013
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Patient%20agency%20in%20the%20rhetoric%20of%20health%20decision%20guides/0x12wGTJKm8LHC1RzLVwT4"
              >
                Patient agency in the rhetoric of health decision guides
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Surface%20forces%20between%20rough%20and%20topographically%20structured%20interfaces/0x12wNDKy3GsmGRKZY4zzm"
              >
                Surface forces between rough and topographically structured
                interfaces
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Postharvest%20losses%20of%20fruit%20and%20vegetables%20during%20retail%20and%20in%20consumers%E2%80%99%20homes%3A%20Quantifications%2C%20causes%2C%20and%20means%20of%20prevention/0x12wXebbKUxKKQqwAcXx1"
              >
                Postharvest losses of fruit and vegetables during retail and in
                consumers’ homes: Quantifications, causes, and means of
                prevention
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Persistence%20of%20fan-shaped%20keratocytes%20is%20a%20matrix-rigidity-dependent%20mechanism%20that%20requires%20%CE%B15%CE%B21%20integrin%20engagement/0x12wh5q4qv6gfEgHTUfir"
              >
                Persistence of fan-shaped keratocytes is a
                matrix-rigidity-dependent mechanism that requires α5β1 integrin
                engagement
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/CHRONIC%20KIDNEY%20DISEASE%20IN%20CHILDREN%20IN%20ARAR%2C%20KINGDOM%20OF%20SAUDI%20ARABIA/0x131XQuQMxVmS7rXWerNU"
              >
                CHRONIC KIDNEY DISEASE IN CHILDREN IN ARAR, KINGDOM OF SAUDI
                ARABIA
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Barclay%20delphiniums%20%5Bcatalog%5D%20%2F/0x132er2ZTd7dt46VP8KnH"
              >
                The Barclay delphiniums [catalog] /
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Diffractive%20hard%20scattering/0x133S66sn5fPNRJft1dxd"
              >
                Diffractive hard scattering
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/In%20vivo%20multiphoton%20kinetic%20imaging%20of%20the%20toxic%20effect%20of%20carbon%20tetrachloride%20on%20hepatobiliary%20metabolism/0x13DEpe38V2JMrSb98ekY"
              >
                In vivo multiphoton kinetic imaging of the toxic effect of
                carbon tetrachloride on hepatobiliary metabolism
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Ermanno%E2%80%93Bernoulli%20constants%20and%20representations%20of%20the%20complete%20symmetry%20group%20of%20the%20Kepler%20problem/0x13LNupuVBBJJfVKYeNwg"
              >
                The Ermanno–Bernoulli constants and representations of the
                complete symmetry group of the Kepler problem
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Properties%20and%20microstructure%20of%20alkali-activated%20red%20clay%20brick%20waste/0x13TZexrpdULD7jCJGFzb"
              >
                Properties and microstructure of alkali-activated red clay brick
                waste
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/THE%20USE%20OF%20ULTRAVIOLET%20LIGHT%20IN%20PREPARING%20A%20NON-VIRULENT%20ANTIRABIES%20VACCINE/0x13c5orN5gzUqgrpJSqVs"
              >
                THE USE OF ULTRAVIOLET LIGHT IN PREPARING A NON-VIRULENT
                ANTIRABIES VACCINE
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/CONTRIBUTIONS%20TO%20ARRAY%20SIGNAL%20PROCESSING%3A%20SPACE%20AND%20SPACE-TIME%20REDUCED-RANK%20PROCESSING%20AND%20RADAR-EMBEDDED%20COMMUNICATIONS%20/0x13kjBN4Vg9e76Ff8gwGm"
              >
                CONTRIBUTIONS TO ARRAY SIGNAL PROCESSING: SPACE AND SPACE-TIME
                REDUCED-RANK PROCESSING AND RADAR-EMBEDDED COMMUNICATIONS{" "}
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Dry%20Extract%20of%20Passiflora%20incarnata%20L.%20leaves%20as%20a%20Cardiac%20and%20Hepatic%20Oxidative%20Stress%20Protector%20in%20LDLr-%2F-%20Mice%20Fed%20High-Fat%20Diet/0x146Wb6p7eZXp8PMWdLzp"
              >
                Dry Extract of Passiflora incarnata L. leaves as a Cardiac and
                Hepatic Oxidative Stress Protector in LDLr-/- Mice Fed High-Fat
                Diet
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Addendum%3A%20The%20Cancer%20Cell%20Line%20Encyclopedia%20enables%20predictive%20modelling%20of%20anticancer%20drug%20sensitivity/0x146kFbnUd5SUHvuN4TzJ"
              >
                Addendum: The Cancer Cell Line Encyclopedia enables predictive
                modelling of anticancer drug sensitivity
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Ten%20Years%20of%20REDD%2B%3A%20A%20Critical%20Review%20of%20the%20Impact%20of%20REDD%2B%20on%20Forest-Dependent%20Communities/0x14Cu8ANSD4A9jPqsikLL"
              >
                Ten Years of REDD+: A Critical Review of the Impact of REDD+ on
                Forest-Dependent Communities
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20College's%20Clinical%20Guideline%20Development%20Programme/0x14NDe2nGuzNkShnRHhU3"
              >
                The College's Clinical Guideline Development Programme
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Partial%20Discharge%20Characteristics%20of%20Silicone%20Liquid/0x14XEY91RRSJREmhWc8N7"
              >
                Partial Discharge Characteristics of Silicone Liquid
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Neurobiology%20of%20functional%20(psychogenic)%20movement%20disorders/0x14nqaBkjX2Hr8FRo2vy9"
              >
                Neurobiology of functional (psychogenic) movement disorders
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Striated%20Ground%20in%20the%20Venezuelan%20Andes/0x15aCAUrxHnmUNnnDYQ3u"
              >
                Striated Ground in the Venezuelan Andes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Square%20Integrable%20Representations%20of%20Unimodular%20Groups/0x15jVUrMC73JNg8RhpMRh"
              >
                Square Integrable Representations of Unimodular Groups
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figures%2010-15%20from%3A%20M%C3%BCller%20A%20(2018)%20Pollen%20host%20selection%20by%20predominantly%20alpine%20bee%20species%20of%20the%20genera%20Andrena%2C%20Panurginus%2C%20Dufourea%2C%20Megachile%2C%20Hoplitis%20and%20Osmia%20(Hymenoptera%2C%20Apoidea).%20Alpine%20Entomology%202%3A%20101-113.%20https%3A%2F%2Fdoi.org%2F10.3897%2Falpento.2.29250/0x15nuUvngok414THZHZEM"
              >
                Figures 10-15 from: Müller A (2018) Pollen host selection by
                predominantly alpine bee species of the genera Andrena,
                Panurginus, Dufourea, Megachile, Hoplitis and Osmia
                (Hymenoptera, Apoidea). Alpine Entomology 2: 101-113.
                https://doi.org/10.3897/alpento.2.29250
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/PEDIATRIC%20RHEGMATOGENEOUS%20RETINAL%20DETACHMENT%3A%20ANALYSIS%20AND%20PREDICTIVE%20FACTORS%20F%20OR%20POST%20-%20OP%20VISUAL%20OUTCOME%20OF%2064%20PEDIATRIC%20RHEGMATOGENEOUS%20RETINAL%20DETACHMENT/0x15qgkB5JZqkyERXSG9ZC"
              >
                PEDIATRIC RHEGMATOGENEOUS RETINAL DETACHMENT: ANALYSIS AND
                PREDICTIVE FACTORS F OR POST - OP VISUAL OUTCOME OF 64 PEDIATRIC
                RHEGMATOGENEOUS RETINAL DETACHMENT
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20Postscript%20to%20'the%20Battle%20of%20Raith'%3A%20And%2C%20the%20Origins%20of%20Bernicia%20and%20Lindsey/0x166DMi3ybQ6EasZthDpv"
              >
                A Postscript to 'the Battle of Raith': And, the Origins of
                Bernicia and Lindsey
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Performance%20Evaluation%20of%20Sign-Language%20Videoconference%20Traffic/0x16HYua2cpjtwBCbBVSFt"
              >
                Performance Evaluation of Sign-Language Videoconference Traffic
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%20The%20Use%20of%20Weighted%20Adjacency%20Matrix%20for%20Searching%20Optimal%20Transportation%20Routes/0x16LiAH9ZySENBfNEHwKG"
              >
                {" "}
                The Use of Weighted Adjacency Matrix for Searching Optimal
                Transportation Routes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Some%20important%20properties%20of%20strandboard%20manufactured%20from%20andong%20bamboo%20(Gigantochloa%20pseudoarundinacea)/0x16MA6vcaiTsMHwknN9Ww"
              >
                Some important properties of strandboard manufactured from
                andong bamboo (Gigantochloa pseudoarundinacea)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/B-Type%20Natriuretic%20Peptide%20Prevents%20Acute%20Hypertrophic%20Responses%20in%20the%20Diabetic%20Rat%20Heart%3A%20Importance%20of%20Cyclic%20GMP/0x16Tz1SmdEneHFQvp53Lw"
              >
                B-Type Natriuretic Peptide Prevents Acute Hypertrophic Responses
                in the Diabetic Rat Heart: Importance of Cyclic GMP
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20Altitude%20on%20Blood%20Pressure/0x171F2p31umVDxu4T16cW"
              >
                Effect of Altitude on Blood Pressure
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Rituximab%20in%20rheumatoid%20arthritis%20following%20anti-TNF-associated%20tuberculosis/0x17cV5s6ZWAANP3Q35QRJ"
              >
                Rituximab in rheumatoid arthritis following anti-TNF-associated
                tuberculosis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Temporomandibular%20joint-evoked%20responses%20by%20spinomedullary%20neurons%20and%20masseter%20muscle%20are%20enhanced%20after%20repeated%20psychophysical%20stress/0x17mxCugzYHKuX2t3nGP8"
              >
                Temporomandibular joint-evoked responses by spinomedullary
                neurons and masseter muscle are enhanced after repeated
                psychophysical stress
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluation%20of%20oxidized%20LDL%20using%20LOX-1%20ligand%20activity/0x17tWUDAw9X9bV1uzogj4"
              >
                Evaluation of oxidized LDL using LOX-1 ligand activity
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Antimicrobial%20Activity%20of%20Dalbavancin%20and%20Comparator%20Agents%20Tested%20against%20Gram-Positive%20Clinical%20Isolates%20Causing%20Bone%20and%20Joint%20Infections%20in%20United%20States%20(US)%20Medical%20Centers%20(2011%E2%80%932016)/0x186CnbiRebjacdo1ZFmr"
              >
                Antimicrobial Activity of Dalbavancin and Comparator Agents
                Tested against Gram-Positive Clinical Isolates Causing Bone and
                Joint Infections in United States (US) Medical Centers
                (2011–2016)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x18tJatdQQhB5tRUuxxiq"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Irradiation%20effect%20of%20ion%20beam%20in%20FexN%20films%20prepared%20by%20IRD./0x19CfKhvWWzMmMu8qK7Fd"
              >
                Irradiation effect of ion beam in FexN films prepared by IRD.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Study%20of%20Si-Implanted%20and%20Thermally%20Annealed%20Layers%20of%20Silicon%20by%20Using%20X-ray%20Grazing%20Incidence%20Methods/0x19GBqoitUJzoufpMww7K"
              >
                Study of Si-Implanted and Thermally Annealed Layers of Silicon
                by Using X-ray Grazing Incidence Methods
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/HUBUNGAN%20BERAT%20BAYI%20DENGAN%20ROBEKAN%20PERINEUM%20PADA%20PERSALINAN%20FISIOLOGIS%20DI%20RB%20LILIK%20SIDOARJO/0x19TJDqRbnvd9XhJXg7Wk"
              >
                HUBUNGAN BERAT BAYI DENGAN ROBEKAN PERINEUM PADA PERSALINAN
                FISIOLOGIS DI RB LILIK SIDOARJO
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pengaruh%20Komitmen%20Organisasi%20Dan%20Implementasi%20Budaya%20Organisasi%20Terhadap%20Kinerja%20Karyawan%20Bank%20Syariah%20Lantabur/0x19ZCR3B9P1EFAdgY7iiC"
              >
                Pengaruh Komitmen Organisasi Dan Implementasi Budaya Organisasi
                Terhadap Kinerja Karyawan Bank Syariah Lantabur
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Model%20and%20Algorithms%20for%20Point%20Cloud%20Construction%20Using%20Digital%20Projection%20Patterns/0x19rdLKVsBAVAbpRWbqDa"
              >
                Model and Algorithms for Point Cloud Construction Using Digital
                Projection Patterns
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Experimental%20study%20on%20a%20liquefaction%20countermeasure%20for%20flume%20channel%20using%20sheet-pile%20with%20drain/0x1A4iPyYSJHjgACEakHTW"
              >
                Experimental study on a liquefaction countermeasure for flume
                channel using sheet-pile with drain
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Molecular%20dynamics%20modeling%20of%20the%20interaction%20of%20cationic%20fluorescent%20lipid%20peroxidation-sensitive%20probes%20with%20the%20mitochondrial%20membrane/0x1A9kS6HtQtskw1oKXYJn"
              >
                Molecular dynamics modeling of the interaction of cationic
                fluorescent lipid peroxidation-sensitive probes with the
                mitochondrial membrane
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Dynamics%20of%20small-scale%20convective%20motions/0x1AQDydPasAuM4FgD1Nub"
              >
                Dynamics of small-scale convective motions
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pendampingan%20Pembuatan%20AD%2FART%20Dalam%20Rangka%20Meningkatkan%20Mekanisme%20Kerja%20Koperasi%20Pada%20Koperasi%20Wanita%20Swatika%20Desa%20Miagan%20Kecamatan%20Mojoagung%20Kabupaten%20Jombang/0x1ASagzTHbVuog7yLj41Y"
              >
                Pendampingan Pembuatan AD/ART Dalam Rangka Meningkatkan
                Mekanisme Kerja Koperasi Pada Koperasi Wanita Swatika Desa
                Miagan Kecamatan Mojoagung Kabupaten Jombang
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/ANALYSIS%20OF%20BALANCE%20DYSFUNTION%20AND%20FALL%20RISK%20IN%20PATIENTS%20WITH%20DAIBETES%20%3A%20AN%20OBSERVATIONAL%20STUDY./0x1AVLzDLmCLD82qTbMcVD"
              >
                ANALYSIS OF BALANCE DYSFUNTION AND FALL RISK IN PATIENTS WITH
                DAIBETES : AN OBSERVATIONAL STUDY.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/WIYN%20OPEN%20CLUSTER%20STUDY%20II%3A%20WIDE-FIELD%20CCD%20PHOTOMETRY%20OF%20THE%20OLD%20OPEN%20CLUSTER%20NGC%206819/0x1AtpESC1G71Ni7FijC9V"
              >
                WIYN OPEN CLUSTER STUDY II: WIDE-FIELD CCD PHOTOMETRY OF THE OLD
                OPEN CLUSTER NGC 6819
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Inactivation%20of%20Scytalidium%20lignicolum%20acid%20protease%20B%20with%201%2C2-epoxy-3-(4'-azido-2'-nitrophenoxy)propane./0x1Au19RJ63hypodvumzZZ"
              >
                Inactivation of Scytalidium lignicolum acid protease B with
                1,2-epoxy-3-(4'-azido-2'-nitrophenoxy)propane.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Emergency%20Department%20Utilization%20During%20Self-Administered%20Outpatient%20Parenteral%20Antimicrobial%20Therapy/0x1B6L2n6Lb7HRbV4fB9kn"
              >
                Emergency Department Utilization During Self-Administered
                Outpatient Parenteral Antimicrobial Therapy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20research%20on%20intelligent%20RGV%20dynamic%20scheduling%20based%20on%20hybrid%20genetic%20algorithm/0x1BCzkSgPqkWXqiLA9APW"
              >
                The research on intelligent RGV dynamic scheduling based on
                hybrid genetic algorithm
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Polylogarithmic-round%20interactive%20proofs%20for%20coNP%20collapse%20the%20exponential%20hierarchy/0x1BH5BsgfZdnvxE9XqRhA"
              >
                Polylogarithmic-round interactive proofs for coNP collapse the
                exponential hierarchy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/El%20m%C3%A9todo%207.1%2C%20Re-acci%C3%B3n%20en%20Multi-re-forma%3A%20Re-generaci%C3%B3n%20%C3%89tica%20en%20la%20Tecnolog%C3%ADa%20Digital%20(TD)%20%2B%20Dise%C3%B1o%20Arquitect%C3%B3nico%20(DA)/0x1BLUDFEtb85fERDfastf"
              >
                El método 7.1, Re-acción en Multi-re-forma: Re-generación Ética
                en la Tecnología Digital (TD) + Diseño Arquitectónico (DA)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%202%3A%20Genetic%20lineages%20of%20mussels%20in%20marine%20lakes./0x1BPBDRQrNb5E8KoPCKiX"
              >
                Figure 2: Genetic lineages of mussels in marine lakes.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/As%20origens%20das%20ora%C3%A7%C3%B5es%20correlativas%20em%20portugu%C3%AAs/0x1CE23XaGxPVJS83UojEu"
              >
                As origens das orações correlativas em português
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Phylogeny%20and%20diversity%20of%20the%20phantom%20crane%20flies%20(Diptera%3A%20Ptychopteridae)/0x1CKgVZzkeB5g8Hczf8Wy"
              >
                Phylogeny and diversity of the phantom crane flies (Diptera:
                Ptychopteridae)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Apoptosis%20in%20mouse%20fetal%20and%20neonatal%20oocytes%20during%20meiotic%20prophase%20one/0x1CLZEiz4XtKqurYeeSHh"
              >
                Apoptosis in mouse fetal and neonatal oocytes during meiotic
                prophase one
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Spectral%20synthesis%20for%20the%20differentiation%20operator%20in%20the%20Schwartz%20space/0x1CaZKekFXAFbA2Woezf4"
              >
                Spectral synthesis for the differentiation operator in the
                Schwartz space
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Development%20of%20a%20new%20mutation%20in%20EGFR%20leads%20to%20drug%20resistance%20in%20non-small%20cell%20lung%20cancer/0x1CeyTCtPRG9Ayj3PF7KW"
              >
                Development of a new mutation in EGFR leads to drug resistance
                in non-small cell lung cancer
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Non-fatal%20overdose%20in%20the%2012%20months%20following%20treatment%20for%20substance%20use%20disorders/0x1DKdceG87Xb66UReYUrV"
              >
                Non-fatal overdose in the 12 months following treatment for
                substance use disorders
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%D0%A3%D1%81%D0%BE%D0%B2%D0%B5%D1%80%D1%88%D0%B5%D0%BD%D1%81%D1%82%D0%B2%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D0%B8%20%D0%BB%D0%BE%D0%BA%D1%82%D0%B5%D0%B2%D0%BE%D0%B3%D0%BE%20%D1%8D%D0%BD%D0%B4%D0%BE%D0%BF%D1%80%D0%BE%D1%82%D0%B5%D0%B7%D0%B0/0x1DQHWQtwKZ9Y9w1dr9zq"
              >
                Усовершенствование конструкции локтевого эндопротеза
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/SURGERY%20OF%20THE%20FIFTH%20NERVE%20FOR%20TIC%20DOULOUREUX./0x1DR1gD1qzQbqsBSRjbCn"
              >
                SURGERY OF THE FIFTH NERVE FOR TIC DOULOUREUX.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effects%20of%20Propofol%2C%20Desflurane%2C%20and%20Sevoflurane%20on%20Recovery%20of%20Myocardial%20Function%20after%20Coronary%20Surgery%20in%20Elderly%20High-risk%20Patients/0x1DU6fxFqKUQ2Zwx3xMb1"
              >
                Effects of Propofol, Desflurane, and Sevoflurane on Recovery of
                Myocardial Function after Coronary Surgery in Elderly High-risk
                Patients
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Quantifying%20the%20Unitary%20Generation%20of%20Coherence%20from%20Thermal%20Quantum%20Systems/0x1DojBHyMApGFmY2L2vYs"
              >
                Quantifying the Unitary Generation of Coherence from Thermal
                Quantum Systems
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%20S5%3A%20Phylogenetic%20tree%20based%20on%20Neighbour%20Joining%20and%20Maximum%20Likelihood%20analysis%20of%20934%20bp%20of%20the%20COI%2BND5%20concatenated%20sequences/0x1DqZ37yxDhf3N2JGKMg4"
              >
                Figure S5: Phylogenetic tree based on Neighbour Joining and
                Maximum Likelihood analysis of 934 bp of the COI+ND5
                concatenated sequences
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Ice%20nucleation%20in%20internally%20mixed%20ammonium%20sulfate%2Fdicarboxylic%20acid%20particles/0x1DqbqZRMhLgMMhtDLHk9"
              >
                Ice nucleation in internally mixed ammonium sulfate/dicarboxylic
                acid particles
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Plant%20root%20proliferation%20in%20nitrogen-rich%20patches%20confers%20competitive%20advantage/0x1EHj4yWek6wK9jHua2jt"
              >
                Plant root proliferation in nitrogen-rich patches confers
                competitive advantage
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20most%20basal%20anomodont%20therapsid%20and%20the%20primacy%20of%20Gondwana%20in%20the%20evolution%20of%20the%20anomodonts/0x1ELDpnsaygMvc5tpKo8r"
              >
                The most basal anomodont therapsid and the primacy of Gondwana
                in the evolution of the anomodonts
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Consistency%20of%20the%20current%20global%20ocean%20observing%20systems%20from%20an%20Argo%20perspective/0x1ENYAMtHP8D2E5Snqa4e"
              >
                Consistency of the current global ocean observing systems from
                an Argo perspective
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Cat%20Scratch%20Disease%3A%20The%20Story%20Continues/0x1EucePok1bYQE3psde5u"
              >
                Cat Scratch Disease: The Story Continues
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/L%E2%80%99%C3%A9tude%20de%20tout%2C%20par%20tous%20les%20moyens%C2%A0%3B%20%C3%A9tude%20critique%20de%20Philosophie%20de%20l%E2%80%99esprit%2C%20%C3%A9tat%20des%20lieux%20(Paris%2C%20Vrin%2C%202000%2C%20337%20p.)%2C%20par%20Denis%20Fisette%20et%20Pierre%20Poirier/0x1F5XRgoBdxjCiigPeNFU"
              >
                L’étude de tout, par tous les moyens ; étude critique de
                Philosophie de l’esprit, état des lieux (Paris, Vrin, 2000, 337
                p.), par Denis Fisette et Pierre Poirier
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%D9%85%DA%A9%D8%AA%D8%A8%20%D9%87%D9%86%D8%B1%DB%8C%20%D8%A8%D9%87%D8%B2%D8%A7%D8%AF%20%2F%20%D9%86%DA%AF%D8%A7%D8%B1%D9%86%D8%AF%D9%87%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%DA%A9%D8%B1%DB%8C%D9%85%20%D8%B1%D8%AD%DB%8C%D9%85%DB%8C./0x1FhhAPrXBQSc8zuMGMUB"
              >
                مکتب هنری بهزاد / نگارنده عبدالکریم رحیمی.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Excitation%20of%20the%20Uller-Zenneck%20electromagnetic%20surface%20waves%20in%20the%20prism-coupled%20configuration/0x1G6xauQnjb2cXyprxiJw"
              >
                Excitation of the Uller-Zenneck electromagnetic surface waves in
                the prism-coupled configuration
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Achieving%20a%20given%20reflectance%20for%20unpolarized%20light%20by%20controlling%20the%20incidence%20angle%20and%20the%20thickness%20of%20a%20transparent%20thin%20film%20on%20an%20absorbing%20substrate%3A%20application%20to%20energy%20equipartition%20in%20the%20four-detector%20photopolarimeter/0x1G9vx5MYxqfgQHHXvNBu"
              >
                Achieving a given reflectance for unpolarized light by
                controlling the incidence angle and the thickness of a
                transparent thin film on an absorbing substrate: application to
                energy equipartition in the four-detector photopolarimeter
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/ProteinChips%3A%20the%20essential%20tools%20for%20proteomic%20biomarker%20discovery%20and%20future%20clinical%20diagnostics/0x1GTbxPmPBVQah5XvSmQ7"
              >
                ProteinChips: the essential tools for proteomic biomarker
                discovery and future clinical diagnostics
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Piezoelectric%20accelerometer%20in%20reduction%20of%20vibrations%20in%20mechanical%20systems/0x1GZGsJ3v7fPyxHMsguBA"
              >
                Piezoelectric accelerometer in reduction of vibrations in
                mechanical systems
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evidence%20for%20mitochondrial%20DNA%20recombination%20in%20a%20human%20population%20of%20island%20Melanesia/0x1Goc4S8ANngXW3L3CUKU"
              >
                Evidence for mitochondrial DNA recombination in a human
                population of island Melanesia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Genius%20and%20Creative%20Intelligence./0x1GuDoThxUKE6YipP3Vfu"
              >
                Genius and Creative Intelligence.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1GwsRXc52DvTh54Ps9fK"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/School%20Facility%20Projects%20in%20Latin%20America/0x1GxTqqi3qHzw3csBDgeu"
              >
                School Facility Projects in Latin America
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Generous%20Ethic%20of%20Deleuze/0x1GyPFa7MCfKiG3thZbrL"
              >
                The Generous Ethic of Deleuze
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Revista%20Brasileira%20de%20Ci%C3%AAncias%20do%20Esporte%3A%20encerrando%20um%20ciclo%20editorial/0x1H3Wq93roPaiERKT5i5j"
              >
                Revista Brasileira de Ciências do Esporte: encerrando um ciclo
                editorial
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Brain%20encoding%20of%20saltatory%20velocity%20through%20a%20pulsed%20pneumotactile%20array%20in%20the%20lower%20face/0x1H8GaTbAQUPnUwjW3Gcf"
              >
                Brain encoding of saltatory velocity through a pulsed
                pneumotactile array in the lower face
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Design%20of%20plane%20sand-bed%20channels%20affected%20by%20seepage/0x1HMVguDjiQgnVeaN3rwB"
              >
                Design of plane sand-bed channels affected by seepage
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%203%E2%80%94figure%20supplement%201.%20Recovery%20ofP.%20copripangenome%20from%20HMP%2FRA%20shotgun%20reads%20and%20determination%20of%20presence%2Fabsence%20ofP.%20copriORFs%20by%20alignment%20of%20reads%20to%20pangenome%20gene%20catalog./0x1HYALBtmijN39PAbBdJC"
              >
                Figure 3—figure supplement 1. Recovery ofP. copripangenome from
                HMP/RA shotgun reads and determination of presence/absence ofP.
                copriORFs by alignment of reads to pangenome gene catalog.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Front%20Matter%20for%20Volume%20102%2C%20Issue%201/0x1HZJBE64esF8aJSp3Bnz"
              >
                Front Matter for Volume 102, Issue 1
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/THE%20EFFECTS%20OF%20TARAXACUM%20OFFICINALE%20EXTRACTS%20(TOE)%20SUPPLEMENTATION%20ON%20PHYSICAL%20FATIGUE%20IN%20MICE/0x1HddyKSxXKqJGg4Q4GjW"
              >
                THE EFFECTS OF TARAXACUM OFFICINALE EXTRACTS (TOE)
                SUPPLEMENTATION ON PHYSICAL FATIGUE IN MICE
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Efficacy%20of%20the%20Subclavian%20Portal%20Approach%20in%20Arthroscopic%20Repair%20of%20Isolated%20Subscapularis%20Tendon%20Tear/0x1HtqoS76mF4T8WdhuW42"
              >
                Efficacy of the Subclavian Portal Approach in Arthroscopic
                Repair of Isolated Subscapularis Tendon Tear
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Anisotropic%20magnetoresistance%20in%20charge-orderedNa0.34(H3O)0.15CoO2%3A%20Strong%20spin-charge%20coupling%20and%20spin%20ordering/0x1JS7L4uv6t5rsfvBAi2y"
              >
                Anisotropic magnetoresistance in
                charge-orderedNa0.34(H3O)0.15CoO2: Strong spin-charge coupling
                and spin ordering
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Cost%20damping%20and%20functional%20form%20in%20transport%20models/0x1JafMDcYTBQuK9pJon24"
              >
                Cost damping and functional form in transport models
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Ponatinib%20for%20Treating%20Acute%20Lymphoblastic%20Leukaemia%3A%20An%20Evidence%20Review%20Group%20Perspective%20of%20a%20NICE%20Single%20Technology%20Appraisal/0x1Jeu18cPCTZNTojtv5xP"
              >
                Ponatinib for Treating Acute Lymphoblastic Leukaemia: An
                Evidence Review Group Perspective of a NICE Single Technology
                Appraisal
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Molecular%20Line%20Opacity%20of%20MgH%20in%20Cool%20Stellar%20Atmospheres/0x1JtC9cemeDVe7uGHhGmi"
              >
                The Molecular Line Opacity of MgH in Cool Stellar Atmospheres
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1K6sEmBGjhxWdPsSFN5u"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/New%20Approaches%20with%20Chord%20in%20Efficient%20P2p%20Grid%20Resource%20Discovery/0x1KFxt3AEtErTTnDaDhH2"
              >
                New Approaches with Chord in Efficient P2p Grid Resource
                Discovery
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Glycerol%20from%20biodiesel%20production%3A%20the%20new%20corn%20for%20dairy%20cattle/0x1KMEHhKQ8kKu1LDW9rWK"
              >
                Glycerol from biodiesel production: the new corn for dairy
                cattle
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Eolian%20Transport%20to%20Hole%20595A%20from%20the%20Late%20Cretaceous%20through%20the%20Cenozoic/0x1KP9kwA9Hw2yh6Zs8YaR"
              >
                Eolian Transport to Hole 595A from the Late Cretaceous through
                the Cenozoic
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Symmetry%20and%20Topology%20in%20Antiferromagnetic%20Spintronics/0x1KPRJBFxBoBbzGw81fX3"
              >
                Symmetry and Topology in Antiferromagnetic Spintronics
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/MEKK3%20Sustains%20EMT%20and%20Stemness%20in%20Pancreatic%20Cancer%20by%20Regulating%20YAP%20and%20TAZ%20Transcriptional%20Activity/0x1KQDxXE778B3zENc5Stj"
              >
                MEKK3 Sustains EMT and Stemness in Pancreatic Cancer by
                Regulating YAP and TAZ Transcriptional Activity
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/THE%20TREATMENT%20OF%20CANCER%20OF%20THE%20UTERUS%20COMPLICATING%20PREGNANCY%20AND%20THE%20PUERI%20ERIUM/0x1KiEfj3nF7iv9o2GcGue"
              >
                THE TREATMENT OF CANCER OF THE UTERUS COMPLICATING PREGNANCY AND
                THE PUERI ERIUM
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Assessment%20of%20etiological%20factors%20and%20clinical%20profile%20in%20pediatric%20asthmatic%20patients/0x1Ks42SF2AXreay7GctQZ"
              >
                Assessment of etiological factors and clinical profile in
                pediatric asthmatic patients
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pulmonary%20and%20Critical%20Care%20Medicine/0x1Ksu2Nwv61mTKiosKKvU"
              >
                Pulmonary and Critical Care Medicine
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Targeting%20MLL-AF4%20with%20short%20interfering%20RNAs%20inhibits%20clonogenicity%20and%20engraftment%20of%20t(4%3B11)-positive%20human%20leukemic%20cells/0x1L13bHmDP3WJSt3eBdRn"
              >
                Targeting MLL-AF4 with short interfering RNAs inhibits
                clonogenicity and engraftment of t(4;11)-positive human leukemic
                cells
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Brain%20prostaglandin%20formation%20is%20increased%20by%20%CE%B1-synuclein%20gene-ablation%20during%20global%20ischemia/0x1L8tLzgaJins235R4yLJ"
              >
                Brain prostaglandin formation is increased by α-synuclein
                gene-ablation during global ischemia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1LHMULq1ScxS3EBTgBSC"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Intracellular%20localization%20of%20mouse%20DNA%20polymerase-alpha./0x1LHnDK9kmBxiRTBXVzJg"
              >
                Intracellular localization of mouse DNA polymerase-alpha.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Processos%20de%20revitaliza%C3%A7%C3%A3o%20urbana%20e%20a%20percep%C3%A7%C3%A3o%20dos%20usu%C3%A1rios/0x1LPzoegbGqiQwun7EQ6r"
              >
                Processos de revitalização urbana e a percepção dos usuários
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Unknown%20Quantities/0x1Lc6wnhtDtNAdsAPxaiC"
              >
                Unknown Quantities
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Alpha-1-antitrypsin%20associated%20liver%20disease%20in%20rheumatoid%20arthritis./0x1LduRvxxw7qegh8nbGJo"
              >
                Alpha-1-antitrypsin associated liver disease in rheumatoid
                arthritis.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20coincidence%20problem%20for%20shifted%20lattices%20and%20crystallographic%20point%20packings/0x1LfTkzW2jM4KGSqsC4r1"
              >
                The coincidence problem for shifted lattices and
                crystallographic point packings
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1M6SYnsgzKNvxMUm38N5"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Importance%20of%20Patient%E2%80%93Provider%20Communication%20to%20Adherence%20in%20Adolescents%20with%20Type%201%20Diabetes/0x1M6b5oNywNrWeBnE6sck"
              >
                Importance of Patient–Provider Communication to Adherence in
                Adolescents with Type 1 Diabetes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1MAX6BxUhiGjuCJ678LJ"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Francesas%20nos%20tr%C3%B3picos%3A%20a%20prostituta%20como%20t%C3%B3pica%20liter%C3%A1ria/0x1MHR8GbuQMDMHPi5qqHa"
              >
                Francesas nos trópicos: a prostituta como tópica literária
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Continuous%20Stabilizing%20of%20First%20Order%20Single%20Input%20Nonlinear%20Systems/0x1MXxw6x1omG6EBxhWJNf"
              >
                Continuous Stabilizing of First Order Single Input Nonlinear
                Systems
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20the%20Global%20Warming%20on%20the%20Vector%20Mosquitoes/0x1MdeP67joaMT4JMdgbWn"
              >
                Effect of the Global Warming on the Vector Mosquitoes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Effect%20of%20Geriatric%20Oral%20Health%20on%20Health%20Status%20and%20Social%20Activity%20in%20Ulsan%20Province/0x1MffwmADFKYv9HZs3cS1"
              >
                The Effect of Geriatric Oral Health on Health Status and Social
                Activity in Ulsan Province
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Recreation%20for%20Teachers.Henry%20S.%20Curtis/0x1N7vt69vRvJjXXibrA79"
              >
                Recreation for Teachers.Henry S. Curtis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%3Ctitle%3EDevelopment%20and%20testing%20of%20an%20active%20platen%20for%20IC%20manufacturing%3C%2Ftitle%3E/0x1N8E7wq5t5s147H5Wo69"
              >
                <title>
                  Development and testing of an active platen for IC
                  manufacturing
                </title>
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/O%20efeito%20pigmale%C3%A3o%3A%20Bernard%20Shaw%20e%20as%20releituras%20de%20os%20simpsons/0x1NefUBVRFDaV1H756fLv"
              >
                O efeito pigmaleão: Bernard Shaw e as releituras de os simpsons
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Epigenesis%20and%20Dynamic%20Similarity%20in%20Two%20Regulatory%20Networks%20in%20Pseudomonas%20Aeruginosa/0x1PMdQajy6nxXrHRxNiV4"
              >
                Epigenesis and Dynamic Similarity in Two Regulatory Networks in
                Pseudomonas Aeruginosa
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Deficiency%20of%20filamin%20A%20in%20endothelial%20cells%20impairs%20left%20ventricular%20remodelling%20after%20myocardial%20infarction/0x1PSBm3EstfmBVm3HMZbY"
              >
                Deficiency of filamin A in endothelial cells impairs left
                ventricular remodelling after myocardial infarction
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%E6%A4%8D%E7%89%A9%E5%88%86%E9%A1%9E%E7%A0%94%E7%A9%B6%E6%89%80%E8%8F%AF%E6%9D%B1%E5%B7%A5%E4%BD%9C%E7%AB%99%E8%BF%91%E8%A8%8A/0x1PZkiNo377Hk6Djzume9"
              >
                植物分類研究所華東工作站近訊
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Sequencing%20the%20Peace/0x1PahriiUnRrpEPKb6ESq"
              >
                Sequencing the Peace
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Fabrication%20of%20Micro%20Structures%20using%20Thin%20Film%20Metallic%20Glass.%20Proposal%20and%20Fabrication%20of%20a%20Micro%20Electrostatic%20Actuator%20of%20Thin%20Film%20Metallic%20Glass./0x1PcWzLE3QP3dCt2ohmJZ"
              >
                Fabrication of Micro Structures using Thin Film Metallic Glass.
                Proposal and Fabrication of a Micro Electrostatic Actuator of
                Thin Film Metallic Glass.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Parallel%20Computers%20in%20Signal%20Processing/0x1PmuoGTywWEppJ71rnXW"
              >
                Parallel Computers in Signal Processing
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/114)%20Research%20of%20Comparison%20on%20Brinell-type%20hardness%20of%20Concrete%20and%20Restitution%20Coefficient%20of%20it(Materials%E3%83%BBExecution)/0x1Q33aTdw1dh6MdaP1pRm"
              >
                114) Research of Comparison on Brinell-type hardness of Concrete
                and Restitution Coefficient of it(Materials・Execution)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pulsed%20high-dose%20dexamethasone%20modulates%20Th1-%2FTh2-chemokine%20imbalance%20in%20immune%20thrombocytopenia/0x1QAhhVXNBni5WmphRtYD"
              >
                Pulsed high-dose dexamethasone modulates Th1-/Th2-chemokine
                imbalance in immune thrombocytopenia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20levels%20of%20markers%20of%20the%20myocardium%20damage%20and%20state%20of%20the%20oxygen%20budget%20in%20patients%2C%20suffering%20the%20mitral%20valve%20insufficiency%20in%20surgical%20correction%2C%20using%20crystalloid%20cardioplegia/0x1QDgriSU8JE859z4o5kr"
              >
                The levels of markers of the myocardium damage and state of the
                oxygen budget in patients, suffering the mitral valve
                insufficiency in surgical correction, using crystalloid
                cardioplegia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Chaosmology%3A%20Shamanism%20and%20personhood%20among%20the%20Bugkalot/0x1QUqRLPaqNgK8Ts47FEm"
              >
                Chaosmology: Shamanism and personhood among the Bugkalot
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Biomechanical%20Factors%20Associated%20With%20Achilles%20Tendinopathy%20and%20Medial%20Tibial%20Stress%20Syndrome%20in%20Runners/0x1QwbsDduiHk9FNKbiumF"
              >
                Biomechanical Factors Associated With Achilles Tendinopathy and
                Medial Tibial Stress Syndrome in Runners
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Osteoblast%20Adhesion%20of%20Breast%20Cancer%20Cells%20with%20Scanning%20Acoustic%20Microscopy/0x1QxeJe96MS1fBpLMxBB5"
              >
                Osteoblast Adhesion of Breast Cancer Cells with Scanning
                Acoustic Microscopy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20association%20of%20maternal%20gestational%20diabetes%20mellitus%20with%20autism%20spectrum%20disorders%20in%20the%20offspring/0x1R3aPXXazJydE866MgJw"
              >
                The association of maternal gestational diabetes mellitus with
                autism spectrum disorders in the offspring
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mechanism%20of%20Low-Temperature%20Activation%20of%20B%20in%20Si%20by%20Soft%20X-ray%20Irradiation/0x1RLBgDySBmY8ZsoFZ5U8"
              >
                Mechanism of Low-Temperature Activation of B in Si by Soft X-ray
                Irradiation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Discussion%20Meeting/0x1RNo4tve9WdNtcgBxR63"
              >
                Discussion Meeting
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Six%20Cases%20of%20Minor%20Salivary%20Gland%20Tumors/0x1RZPLmgcyFrnhcptf5YH"
              >
                Six Cases of Minor Salivary Gland Tumors
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Characterization%20of%20Transgenic%20Arabidopsis%20Plants%20Overexpressing%20High%20Mobility%20Group%20B%20Proteins%20under%20High%20Salinity%2C%20Drought%20or%20Cold%20Stress/0x1Rm11tBqJSZvbuSFxG44"
              >
                Characterization of Transgenic Arabidopsis Plants Overexpressing
                High Mobility Group B Proteins under High Salinity, Drought or
                Cold Stress
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1RrgCBH6FksZ1DKbkCRQ"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Optical%20Coherence%20Tomography%20to%20Measure%20Sound-Induced%20Motions%20Within%20the%20Mouse%20Organ%20of%20Corti%20In%20Vivo/0x1RrjfrVfvEUemkmv7jSH"
              >
                Optical Coherence Tomography to Measure Sound-Induced Motions
                Within the Mouse Organ of Corti In Vivo
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Observa%C3%A7%C3%B5es%20recentes%20sobre%20o%20gasto%20em%20Ci%C3%AAncia%20%26%20Tecnologia%20no%20Brasil/0x1S3eNyrQrV3o5ekVPj38"
              >
                Observações recentes sobre o gasto em Ciência & Tecnologia no
                Brasil
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Nonequilibrium%20phase%20transitions%20in%20models%20of%20adsorption%20and%20desorption/0x1S6nL9Kfo2MPBCwYvEt5"
              >
                Nonequilibrium phase transitions in models of adsorption and
                desorption
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%E4%B9%B3%E5%85%90%E6%9C%9F%E3%81%AE%E9%A1%94%E3%81%B8%E3%81%AE%E8%88%88%E5%91%B3%E3%81%A8%E6%83%85%E5%8B%95%E7%90%86%E8%A7%A3/0x1S8cv1pkf6UU7zfTXRaB"
              >
                乳児期の顔への興味と情動理解
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/O%20conceito%20de%20in%C3%A9rcia%20adicional%20do%20escoamento%20em%20torno%20de%20cilindro%20circular%20em%20oscila%C3%A7%C3%A3o%20for%C3%A7ada./0x1S8fMk7Zc1Nw4mTx7GQZ"
              >
                O conceito de inércia adicional do escoamento em torno de
                cilindro circular em oscilação forçada.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/TGF%20%CE%B21%20and%20PDGF%20AA%20override%20Collagen%20type%20I%20inhibition%20of%20proliferation%20in%20human%20liver%20connective%20tissue%20cells/0x1SBZtbD4HaeAEu8uBRaM"
              >
                TGF β1 and PDGF AA override Collagen type I inhibition of
                proliferation in human liver connective tissue cells
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Parasynaptic%20stages%20in%20the%20testis%20of%20Aneides%20lugubris%20(Hallowell)%2C%20by%20Harry%20James%20Snook%20and%20J.A.%20Long./0x1SLs1kkxY9xM9h6ovpk6"
              >
                Parasynaptic stages in the testis of Aneides lugubris
                (Hallowell), by Harry James Snook and J.A. Long.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20practice%20of%20authentic%20assessment%20in%20an%20EFL%20speaking%20classroom/0x1SQ1Hrg8yXnBMpCKBKtC"
              >
                The practice of authentic assessment in an EFL speaking
                classroom
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Escuela%20profesional%20de%20danzas%20folcl%C3%B3ricas%20del%20Per%C3%BA/0x1STUy5Z2xd8oiqSbUABS"
              >
                Escuela profesional de danzas folclóricas del Perú
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1SbJ5At1udXX5Vutmhqq"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Nocardiosis%20cerebral%20parvosintom%C3%A1tica%2C%20en%20pacientes%20inmunocomprometidos/0x1T49EVTYdZFUZx67E6um"
              >
                Nocardiosis cerebral parvosintomática, en pacientes
                inmunocomprometidos
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Planar%20Laser-Induced%20Fluorescence%20Velocity%20Measurements%20of%20Retropropulsion%20Jets%20in%20a%20Mach%2012%20Freestream/0x1TDvjn8G4SGSceAUZLrB"
              >
                Planar Laser-Induced Fluorescence Velocity Measurements of
                Retropropulsion Jets in a Mach 12 Freestream
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Laser%20Science%20of%20a%20Single%20Microparticle.%20Microspectroscopic%20Analysis%20of%20Inhomogeneous%20Structures%20in%20Single%20Microparticles./0x1TJwrw55JhCZRoJHk4fX"
              >
                Laser Science of a Single Microparticle. Microspectroscopic
                Analysis of Inhomogeneous Structures in Single Microparticles.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Description%20of%20a%20second%20specimen%20of%20%3Ci%3ELeptotyphlops%20parkeri%3C%2Fi%3E%20(Squamata%3A%20Leptotyphlopidae)%2C%20with%20comments%20on%20its%20generic%20placement/0x1TKScLmaTwXx9LcTsVDA"
              >
                Description of a second specimen of <i>Leptotyphlops parkeri</i>{" "}
                (Squamata: Leptotyphlopidae), with comments on its generic
                placement
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/SALUTO%20DELL%E2%80%99ASSESSORE%20ALLA%20CULTURA%20DEL%20COMUNE%20DI%20MILANO/0x1ThcPKWexwuNfPiAfpUz"
              >
                SALUTO DELL’ASSESSORE ALLA CULTURA DEL COMUNE DI MILANO
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Transport%20Services%20for%20Tariff%20Gas%20and%20its%20Distribution%20Among%20Gas%20Distribution%20Enterprises%20in%20Ukraine/0x1ThxENsqmWnrxRNzmrvc"
              >
                Transport Services for Tariff Gas and its Distribution Among Gas
                Distribution Enterprises in Ukraine
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Addendum%3A%20Vibration%20isolation%20system%20for%20cryogenic%20phonon-scintillation%20calorimeters/0x1TiH8izG8V4ewNNBg8Lg"
              >
                Addendum: Vibration isolation system for cryogenic
                phonon-scintillation calorimeters
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mild%20method%20of%20simultaneous%20methionine%20grafting%20and%20phosphorylation%20of%20soybean%20globulins%20improves%20their%20functional%20properties/0x1TxWHLGTHYyz2sGt3Yp2"
              >
                Mild method of simultaneous methionine grafting and
                phosphorylation of soybean globulins improves their functional
                properties
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Assessment%20of%20Iodine%20deficiency%20in%20children%20age%20ranged%208-14%20years%20of%20age/0x1Tz5yDPFtTUtmovRhJPL"
              >
                Assessment of Iodine deficiency in children age ranged 8-14
                years of age
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Disposition%20of%2014%20C%20and%2For%2074%20As-Cacodylic%20Acid%20in%20Rats%20after%20Intravenous%2C%20Intratracheal%2C%20or%20Peroral%20Administration/0x1UPJn3yqwx6SzocgkQ4k"
              >
                Disposition of 14 C and/or 74 As-Cacodylic Acid in Rats after
                Intravenous, Intratracheal, or Peroral Administration
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Inhalt/0x1UdGpz16iRHVu8bqg3wS"
              >
                Inhalt
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effects%20of%20Bifidobacteriumlongum%20bv.%20Infantis%20CCUG%2052486%20combined%20with%20glucooligosaccharide%20on%20immune%20cell%20populations%20in%20healthy%20young%20and%20older%20subjects%20receiving%20an%20influenza%20vaccination/0x1UiLYNXihpjTUK2CxYob"
              >
                Effects of Bifidobacteriumlongum bv. Infantis CCUG 52486
                combined with glucooligosaccharide on immune cell populations in
                healthy young and older subjects receiving an influenza
                vaccination
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/On%20the%20Molecular%20Pharmacology%20of%20Resveratrol%20on%20Oxidative%20Burst%20Inhibition%20in%20Professional%20Phagocytes/0x1UmMg73Ejnc4nafzHDY7"
              >
                On the Molecular Pharmacology of Resveratrol on Oxidative Burst
                Inhibition in Professional Phagocytes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Downward%20Platelet%20Utilization%20Trends%20in%20Acute%20Leukemia/0x1UoV99uKHBKqmhaMLqSn"
              >
                Downward Platelet Utilization Trends in Acute Leukemia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Extreme%20host%20specificity%20by%20Microdon%20mutabilis%20(Diptera%3A%20Syrphiae)%2C%20a%20social%20parasite%20of%20ants/0x1Utp4NKpbHkTiUWSmMCy"
              >
                Extreme host specificity by Microdon mutabilis (Diptera:
                Syrphiae), a social parasite of ants
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mechanism%20and%20regulation%20of%20mitotic%20poisons./0x1UxMAjmPYc5pNQN2t9Ep"
              >
                Mechanism and regulation of mitotic poisons.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Personnel%20Security%20in%20the%20conditions%20of%20digitalization%20of%20the%20Economy/0x1V137xkMfVjLe1Ac4nJE"
              >
                Personnel Security in the conditions of digitalization of the
                Economy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Biotransport%20of%20Metallic%20Trace%20Elements%20from%20Marine%20to%20Terrestrial%20Ecosystems%20by%20Seabirds/0x1V4a4HHHA9t2bRjcfqdj"
              >
                Biotransport of Metallic Trace Elements from Marine to
                Terrestrial Ecosystems by Seabirds
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Edukacja%20medialna%20w%20wybranych%20pa%C5%84stwach%20Europy/0x1VAmBrLkBHEYQezyBd68"
              >
                Edukacja medialna w wybranych państwach Europy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mate%20number%2C%20kin%20selection%20and%20social%20conflicts%20in%20stingless%20bees%20and%20honeybees/0x1VRMyAKWzMg1j91wtEhf"
              >
                Mate number, kin selection and social conflicts in stingless
                bees and honeybees
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Design%20and%20development%20of%20drugs%20for%20Alzheimer%E2%80%99s%20dementia%20as%20a%20protein%20misfolding%20disorder/0x1VTS7q1s5z29P2RwhaCN"
              >
                Design and development of drugs for Alzheimer’s dementia as a
                protein misfolding disorder
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/New%20insights%20on%20sarcoplasmic%20reticulum%20calcium%20regulation%20in%20muscle%20fatigue/0x1Ve35ZEpzpofi6H95Raf"
              >
                New insights on sarcoplasmic reticulum calcium regulation in
                muscle fatigue
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Bioremediation%20of%20gasoline%20contaminated%20soil%20by%20a%20bacterial%20consortium%20amended%20with%20poultry%20litter%2C%20coir%20pith%20and%20rhamnolipid%20biosurfactant/0x1VudRJsjtrWMmNVFgGbE"
              >
                Bioremediation of gasoline contaminated soil by a bacterial
                consortium amended with poultry litter, coir pith and
                rhamnolipid biosurfactant
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Nanoindentation%20of%20Au%20and%20Pt%2FCu%20thin%20films%20at%20elevated%20temperatures/0x1VuxmojL5ZuWVpG9zzpn"
              >
                Nanoindentation of Au and Pt/Cu thin films at elevated
                temperatures
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Opioids%20for%20chronic%20noncancer%20pain%3A%20A%20position%20paper%20of%20the%20American%20Academy%20of%20Neurology/0x1VyXiJBJf4tgWq8Fdn5o"
              >
                Opioids for chronic noncancer pain: A position paper of the
                American Academy of Neurology
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Zur%20Pr%EF%BF%BDfung%20der%20Extracte%2C%20Nahrungsmittel%20etc.%20auf%20Kupfer/0x1W4XGkos6yHHPShHSXCU"
              >
                Zur Pr�fung der Extracte, Nahrungsmittel etc. auf Kupfer
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Development%20of%20clinical%20approaches%20to%20psychological%20study%20of%20family./0x1W4sRJbvHpaZpYfEsMBa"
              >
                Development of clinical approaches to psychological study of
                family.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1W99vDnAbz8n72WHm3xs"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/AN%20EVALUATION%20OF%20THE%20ARCHITECTURE%2C%20CULTURE%20AND%20HISTORY%20OF%20THE%20POLONEZK%C3%96Y%2FADAMPOL%20SETTLEMENT%20IN%20ISTANBUL/0x1WauA5Qomd7VKYwrCvP2"
              >
                AN EVALUATION OF THE ARCHITECTURE, CULTURE AND HISTORY OF THE
                POLONEZKÖY/ADAMPOL SETTLEMENT IN ISTANBUL
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/O%20LUGAR%20DO%20TEMPO%20NA%20G%C3%8ANESE%20L%C3%8DRICA%20DE%20JOS%C3%89%20TOLENTINO%20MENDON%C3%87A/0x1Wq1Yj98HyY68ekHX5f1"
              >
                O LUGAR DO TEMPO NA GÊNESE LÍRICA DE JOSÉ TOLENTINO MENDONÇA
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Anti-stress%20Effect%20of%20Green%20Tea%20with%20Lowered%20Caffeine%20on%20Humans%3A%20A%20Pilot%20Study/0x1X4pufKt5C2zLB6SBFX1"
              >
                Anti-stress Effect of Green Tea with Lowered Caffeine on Humans:
                A Pilot Study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/MODELLING%20OF%20CONTINUOUS%20PRODUCTION%20OF%20BIOGAS%20IN%20A%20TUBULAR%20REACTOR/0x1XCewUQUBzF54j449E82"
              >
                MODELLING OF CONTINUOUS PRODUCTION OF BIOGAS IN A TUBULAR
                REACTOR
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Regional%20perturbation%20of%20gene%20transcription%20is%20associated%20with%20intrachromosomal%20rearrangements%20and%20gene%20fusion%20transcripts%20in%20high%20grade%20ovarian%20cancer/0x1XF1FyT6Uydczd7uHZcm"
              >
                Regional perturbation of gene transcription is associated with
                intrachromosomal rearrangements and gene fusion transcripts in
                high grade ovarian cancer
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/SOME%20NEW%20RESULTS%20FOR%20REICH%20TYPE%20MAPPINGS%20ON%20CONE%20b-METRIC%20SPACES%20OVER%20BANACH%20ALGEBRAS/0x1XdVMBhiYiYpZXGFxJ4c"
              >
                SOME NEW RESULTS FOR REICH TYPE MAPPINGS ON CONE b-METRIC SPACES
                OVER BANACH ALGEBRAS
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/N811%20Infliximab%20versus%20adalimumab%3A%20clinical%20and%20endoscopy%20response%20in%20ulcerative%20colitis%20patients.%20A%C2%A0prospective%20study/0x1YEeF3Vx99aawV4hn3pC"
              >
                N811 Infliximab versus adalimumab: clinical and endoscopy
                response in ulcerative colitis patients. A prospective study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Super-sensitivity%20to%20structure%20in%20biological%20models/0x1YJvkqXLDGcyXE4o3qYZ"
              >
                Super-sensitivity to structure in biological models
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%CE%B2-Fructofuranosidase%20and%20%CE%B2%20%E2%80%93D-Fructosyltransferase%20from%20New%20Aspergillus%20carbonarius%20PC-4%20Strain%20Isolated%20from%20Canned%20Peach%20Syrup%3A%20Effect%20of%20Carbon%20and%20Nitrogen%20Sources%20on%20Enzyme%20Production/0x1YNR2Yotg2P91NgHQjqT"
              >
                β-Fructofuranosidase and β –D-Fructosyltransferase from New
                Aspergillus carbonarius PC-4 Strain Isolated from Canned Peach
                Syrup: Effect of Carbon and Nitrogen Sources on Enzyme
                Production
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1YU831sJw3ywPc7xmJsB"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Clustering%20of%20similar%20processes%20for%20the%20application%20of%20statistical%20process%20control%20in%20small%20batch%20and%20job%20production/0x1YUFS1REa6BGpjCqR1pc"
              >
                Clustering of similar processes for the application of
                statistical process control in small batch and job production
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Development%20of%20lead-free%20copper%20alloy%20graphite%20castings.%20Annual%20report%2C%20January--December%201995/0x1YjjRRcJnCJMCfiHVDMj"
              >
                Development of lead-free copper alloy graphite castings. Annual
                report, January--December 1995
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Sleeve%20Gastrectomy%20as%20a%20Stand-alone%20Bariatric%20Operation%20for%20Severe%2C%20Morbid%2C%20and%20Super%20Obesity/0x1YpFERMG859aKGrnowcB"
              >
                Sleeve Gastrectomy as a Stand-alone Bariatric Operation for
                Severe, Morbid, and Super Obesity
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/THURSDAY%2025TH%20MARCH/0x1Yu6PpfRiuheifEnRrJ4"
              >
                THURSDAY 25TH MARCH
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Implications%20of%20tau%20data%20for%20CP%20violation%20in%20K%20decays/0x1YwNG5oYx1YCqeW3n1TK"
              >
                Implications of tau data for CP violation in K decays
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Research%20on%20Intelligent%20Home%20Adaptive%20Control%20Strategy/0x1Z4hrDLmqF7wqtc3x11W"
              >
                Research on Intelligent Home Adaptive Control Strategy
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/France/0x1ZACWZLz3aox23BT8xtV"
              >
                France
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Factors%20Associated%20with%20Multibacillary%20Leprosy%20in%20a%20Priority%20Region%20for%20Disease%20Control%20in%20Northeastern%20Brazil%3A%20A%20Retrospective%20Observational%20Study/0x1ZGKJ8f14gViKdTXrifF"
              >
                Factors Associated with Multibacillary Leprosy in a Priority
                Region for Disease Control in Northeastern Brazil: A
                Retrospective Observational Study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Some%20Remarks%20on%20Modular%20Arithmetic%20and%20Parallel%20Computation/0x1ZTikF7cuM6YGq5VRSgM"
              >
                Some Remarks on Modular Arithmetic and Parallel Computation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Response%20to%20%E2%80%9CComment%20on%20%E2%80%98Modification%20of%20graphene%20properties%20due%20to%20electron-beam%20irradiation%E2%80%99%20%E2%80%9D%20%5BAppl.%20Phys.%20Lett.%2095%2C%20246101(2009)%5D/0x1ZVxHzf3nXqQbAF7zRZg"
              >
                Response to “Comment on ‘Modification of graphene properties due
                to electron-beam irradiation’ ” [Appl. Phys. Lett. 95,
                246101(2009)]
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20Robust%20Terrain%20Aided%20Navigation%20Using%20the%20Rao-Blackwellized%20Particle%20Filter%20Trained%20by%20Long%20Short-Term%20Memory%20Networks/0x1ZctFiUrSipJgrfAP5rz"
              >
                A Robust Terrain Aided Navigation Using the Rao-Blackwellized
                Particle Filter Trained by Long Short-Term Memory Networks
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Photoregulated%20Fluxional%20Fluorophores%20for%20Live-Cell%20Super-Resolution%20Microscopy%20with%20No%20Apparent%20Photobleaching/0x1ZpBoPfqrGQkfRcmhP13"
              >
                Photoregulated Fluxional Fluorophores for Live-Cell
                Super-Resolution Microscopy with No Apparent Photobleaching
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Dissecting%20the%20genetic%20and%20metabolic%20mechanisms%20of%20adaptation%20to%20the%20knockout%20of%20a%20major%20metabolic%20enzyme%20inEscherichia%20coli/0x1ZsDQFtSqNh23tXmVDge"
              >
                Dissecting the genetic and metabolic mechanisms of adaptation to
                the knockout of a major metabolic enzyme inEscherichia coli
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Local%20values%20and%20decisions%3A%20views%20and%20constraints%20for%20riparian%20management%20in%20western%20Mexico/0x1aFYrfT3nmPALiZA1Aai"
              >
                Local values and decisions: views and constraints for riparian
                management in western Mexico
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1aJ4m8QpCViotEeZD5bK"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/International%20design%20collaboration%20and%20mentoring%20for%20tertiary%20students%20through%20Facebook/0x1aXWatneF4KiLEE3Dyxg"
              >
                International design collaboration and mentoring for tertiary
                students through Facebook
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/On%20the%20Darlingtonia%20californica%2C%20a%20new%20pitcher-plant%20from%20northern%20California%20%2Fby%20John%20Torrey./0x1ahzE1GZ2QByPYENv96G"
              >
                On the Darlingtonia californica, a new pitcher-plant from
                northern California /by John Torrey.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Improvement%20of%20thermoelectric%20figure%20of%20merit%20by%20using%20potential%20barriers./0x1aoqEq4WdaSaQ5jnfpfo"
              >
                Improvement of thermoelectric figure of merit by using potential
                barriers.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1avxqE7AK6N3RP5sHX3e"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Influence%20of%20initial%20milk%20yield%2C%20sward%20height%20and%20concentrate%20level%20on%20herbage%20intake%20and%20grazing%20behaviour%20of%20dairy%20cattle/0x1b3ZpeiqG3L5jqqVmz69"
              >
                Influence of initial milk yield, sward height and concentrate
                level on herbage intake and grazing behaviour of dairy cattle
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Damage%20in%20Historic%20Rammed%20Earth%20Structures%3A%20a%20Case%20Study%20at%20Ambel%2C%20Zaragoza%2C%20Spain/0x1bEsuWe5QmkHbpHRR33p"
              >
                Damage in Historic Rammed Earth Structures: a Case Study at
                Ambel, Zaragoza, Spain
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Evolution%20of%20Copulatory%20Organs%2C%20Internal%20Fertilization%2C%20Placentae%20and%20Viviparity%20in%20Killifishes%20(Cyprinodontiformes)%20Inferred%20from%20a%20DNA%20Phylogeny%20of%20the%20Tyrosine%20Kinase%20Gene%20X-src/0x1bc5tKmXdrHW7sEb58Fr"
              >
                The Evolution of Copulatory Organs, Internal Fertilization,
                Placentae and Viviparity in Killifishes (Cyprinodontiformes)
                Inferred from a DNA Phylogeny of the Tyrosine Kinase Gene X-src
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/NMR%20characterization%20of%20the%20pH%204%20%CE%B2-intermediate%20of%20the%20prion%20protein%3A%20the%20N-terminal%20half%20of%20the%20protein%20remains%20unstructured%20and%20retains%20a%20high%20degree%20of%20flexibility/0x1biFCPdSLVsZcuZ2P1SA"
              >
                NMR characterization of the pH 4 β-intermediate of the prion
                protein: the N-terminal half of the protein remains unstructured
                and retains a high degree of flexibility
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1bmpit7SSi2Q9Uv6cLG6"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20single-input%20deadbeat%20principle%20and%20its%20application%20to%20minimization%20of%20the%20input%20energy./0x1bvh1Vuk9GJ86dV3coVp"
              >
                The single-input deadbeat principle and its application to
                minimization of the input energy.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Contents/0x1byvBveWTpVRSh2beERt"
              >
                Contents
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluation%20of%2026%20cases%20of%20dengue%20fever%20in%20children/0x1c6wDdW4U1wu4aTKWsNx"
              >
                Evaluation of 26 cases of dengue fever in children
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Faktor%20yang%20berhubungan%20dengan%20preferensi%20konsumen%20street%20food%20pada%20mahasiswa%20Universitas%20Gadjah%20Mada/0x1cBQRULNTQeUYNSMiMsb"
              >
                Faktor yang berhubungan dengan preferensi konsumen street food
                pada mahasiswa Universitas Gadjah Mada
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1caHLcaxyHEWSE1ChhsZ"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Assessment%20of%20Dietary%20Intake%20Patterns%20and%20Their%20Correlates%20among%20University%20Students%20in%20Lebanon/0x1cipp337Vvw71Maq9Zoh"
              >
                Assessment of Dietary Intake Patterns and Their Correlates among
                University Students in Lebanon
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/To%20give%20the%20word%20its%20proper%20meaning%2C%20or%20deliberations%20on%20connotative%20equivalence%20in%20the%20light%20of%20the%20theory%20of%20linguistic%20worldview/0x1ct75A6GXCRMpc2oMG6d"
              >
                To give the word its proper meaning, or deliberations on
                connotative equivalence in the light of the theory of linguistic
                worldview
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Synthetic%20peptide%20vaccine%20confers%20protection%20against%20murine%20malaria/0x1d27Jn46YxznP5CzU1Sx"
              >
                Synthetic peptide vaccine confers protection against murine
                malaria
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Seroprevalence%20of%20Selected%20Zoonotic%20Agents%20among%20Hunters%20from%20Eastern%20Poland/0x1d8RG2pvNPpQSLCzc5pz"
              >
                Seroprevalence of Selected Zoonotic Agents among Hunters from
                Eastern Poland
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Optimized%20%CE%B4%20expansion%20for%20the%20Walecka%20model/0x1dATvwbz3Lg6TGxreGsi"
              >
                Optimized δ expansion for the Walecka model
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Synthesis%20of%20Yttria%20Dispersed%20Nano%20Copper%20Powders%20by%20a%20Polymer%20Solution%20Technique/0x1dAZQXQ2h8W2heQC8sas"
              >
                Synthesis of Yttria Dispersed Nano Copper Powders by a Polymer
                Solution Technique
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Kohn%E2%80%99s%20theorem%2C%20Larmor%E2%80%99s%20equivalence%20principle%20and%20the%20Newton%E2%80%93Hooke%20group/0x1dC2qqvaxWbJFRnLHgUM"
              >
                Kohn’s theorem, Larmor’s equivalence principle and the
                Newton–Hooke group
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Are%20changes%20of%20the%20geomagnetic%20field%20intensity%20related%20to%20changes%20of%20the%20tropical%20Pacific%20sea-level%20pressure%20during%20the%20last%2050%20years%3F/0x1dPcsLioo9ohQh82w4od"
              >
                Are changes of the geomagnetic field intensity related to
                changes of the tropical Pacific sea-level pressure during the
                last 50 years?
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Natureza%20e%20limites%20do%20plano%20de%20recupera%C3%A7%C3%A3o%20de%20empresas%3A%20aspectos%20jur%C3%ADdicos%20e%20econ%C3%B4micos/0x1dcujb69NU9RbbAbXEMB"
              >
                Natureza e limites do plano de recuperação de empresas: aspectos
                jurídicos e econômicos
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Overconfidence%20and%20Market%20Efficiency%20with%20Heterogeneous%20Agents/0x1deLTESmF6Eh4jGPri8q"
              >
                Overconfidence and Market Efficiency with Heterogeneous Agents
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20Joint%20Moments%20Based%20Analysis%20of%20Networks%20of%20MAP%2FMAP%2F1%20Queues/0x1dhsm7Evtn7A618rZoHT"
              >
                A Joint Moments Based Analysis of Networks of MAP/MAP/1 Queues
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/BANCO%20DOS%20R%C3%89US%20COLETIVO%3A%20DA%20POLARIZA%C3%87%C3%83O%20PASSIVA%20DA%20A%C3%87%C3%83O%20COLETIVA/0x1djq1qn5QbnHsV57yeYd"
              >
                BANCO DOS RÉUS COLETIVO: DA POLARIZAÇÃO PASSIVA DA AÇÃO COLETIVA
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Illustrated%20descriptive%20catalogue%20of%20fruit%20and%20ornamental%20trees%2C%20grape%20vines%2C%20small%20fruits%2C%20shrubs%2C%20plants%2C%20roses%2C%20etc./0x1eGSruw1YJYXtxgwCCER"
              >
                Illustrated descriptive catalogue of fruit and ornamental trees,
                grape vines, small fruits, shrubs, plants, roses, etc.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1eQ6oXW9xuDdkBx1P5so"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Simple%20Method%20for%20Preparing%20Glucose%20Biosensor%20Based%20on%20Glucose%20Oxidase%20in%20Nanocomposite%20Material%20of%20Single-Wall%20Carbon%20Nanotubes%2FIonic%20Liquid/0x1eUGhZsi9Lk8EhJoMT7k"
              >
                Simple Method for Preparing Glucose Biosensor Based on Glucose
                Oxidase in Nanocomposite Material of Single-Wall Carbon
                Nanotubes/Ionic Liquid
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluation%20criterias%20for%20trust%20management%20in%20vehicular%20ad-hoc%20networks%20(VANETs)/0x1eW3Rd4mvr5GH7dgQZGQ"
              >
                Evaluation criterias for trust management in vehicular ad-hoc
                networks (VANETs)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Rhymes%20of%20the%20Psalms%20(%E2%80%9C%E8%AF%97%E7%AF%87%E2%80%9D%E8%B5%8B)/0x1efCax6R8M27MbpbWsQv"
              >
                Rhymes of the Psalms (“诗篇”赋)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/How%20far%20can%20a%20juxtacrine%20signal%20travel%3F/0x1ejM3gPcxv75k5FFQaVS"
              >
                How far can a juxtacrine signal travel?
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Reconstructing%20Race%20in%20Science%20and%20Society%3A%20Biology%20Textbooks%2C%201952%E2%80%932002/0x1enHSZwJxpjh2zm92ffz"
              >
                Reconstructing Race in Science and Society: Biology Textbooks,
                1952–2002
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pelletizing%20of%20Algarrobo%20High%20Grade%20Magnetite%20Concentrate/0x1f5RToUeCvcxxoXogSyY"
              >
                Pelletizing of Algarrobo High Grade Magnetite Concentrate
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Seronegative%20cat-scratch%20disease%20diagnosed%20by%20PCR%20detection%20of%20Bartonella%20henselae%20DNA%20in%20lymph%20node%20samples/0x1fSnpcvXD98ArQbePnrC"
              >
                Seronegative cat-scratch disease diagnosed by PCR detection of
                Bartonella henselae DNA in lymph node samples
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20pancreatic%20and%20leukocyte%20elastase%20on%20hydraulic%20conductivity%20in%20lung%20interstitial%20segments/0x1fg9rPAbo6QPT4CPnusY"
              >
                Effect of pancreatic and leukocyte elastase on hydraulic
                conductivity in lung interstitial segments
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/X-ray%20scattering%20from%20real%20surfaces%3A%20Discrete%20and%20continuous%20components%20of%20roughness/0x1g53mvhpSrxPU4xnBPE5"
              >
                X-ray scattering from real surfaces: Discrete and continuous
                components of roughness
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20comparison%20of%20health%20insurance%20in%20Slovenia%20and%20Croatia/0x1gcF3YHkvFgVeeLdJML5"
              >
                A comparison of health insurance in Slovenia and Croatia
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Changes%20in%20Patient%20and%20Nurse%20Outcomes%20Associated%20With%20Magnet%20Hospital%20Recognition/0x1gcTf3LotMrsqWo4A5pZ"
              >
                Changes in Patient and Nurse Outcomes Associated With Magnet
                Hospital Recognition
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Abnormalities%20in%20neuroendocrine%20stress%20response%20in%20psychosis%3A%20the%20role%20of%20endocannabinoids/0x1gj2zweKQrReYoM8KmLA"
              >
                Abnormalities in neuroendocrine stress response in psychosis:
                the role of endocannabinoids
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Error%20analysis%20for%20the%20rate%20azimuth%20platform%20INS/0x1gpoxbTZMfgrLB7ctW2g"
              >
                Error analysis for the rate azimuth platform INS
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Immunophenotypic%20characteristics%20of%20brain%20metastases/0x1gwXKvfcV7C3Bp4sGGas"
              >
                Immunophenotypic characteristics of brain metastases
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/What%20evidence%20exists%20on%20the%20local%20impacts%20of%20energy%20systems%20on%20marine%20ecosystem%20services%3A%20a%20systematic%20map/0x1hBLM1ngjTd88vUqK7dz"
              >
                What evidence exists on the local impacts of energy systems on
                marine ecosystem services: a systematic map
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Efficient%20computation%20of%20trade-off%20skylines/0x1hDojLAkuTfznC842sxN"
              >
                Efficient computation of trade-off skylines
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Influence%20of%20Parameter%20Sensitivity%20and%20Uncertainty%20on%20Projected%20Runoff%20in%20the%20Upper%20Niger%20Basin%20under%20a%20Changing%20Climate/0x1hMu2djraKPhY74CMyqX"
              >
                Influence of Parameter Sensitivity and Uncertainty on Projected
                Runoff in the Upper Niger Basin under a Changing Climate
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Rela%C3%A7%C3%A3o%20entre%20achados%20ultrassonogr%C3%A1ficos%20de%20tendinopatia%20e%20bursopatia%20de%20ombro%20e%20incapacidade%20para%20o%20trabalho/0x1hXP9QBA2gKm77oww8dR"
              >
                Relação entre achados ultrassonográficos de tendinopatia e
                bursopatia de ombro e incapacidade para o trabalho
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/International%20comparisons%20of%20industrial%20robot%20penetration/0x1hkpeRW3hNUVLQ3cNZzm"
              >
                International comparisons of industrial robot penetration
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Estudo%20para%20uma%20composi%C3%A7%C3%A3o%3A%20cidade%20e%20narrativa/0x1hqjt63zt1u6m9PGKdUb"
              >
                Estudo para uma composição: cidade e narrativa
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Complete%20Genome%20Sequences%20of%20Three%20Leptospira%20mayottensis%20Strains%20from%20Tenrecs%20That%20Are%20Endemic%20in%20the%20Malagasy%20Region/0x1i5ABvG3bN9pef2doSnm"
              >
                Complete Genome Sequences of Three Leptospira mayottensis
                Strains from Tenrecs That Are Endemic in the Malagasy Region
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Determinasi%20Faktor-Faktor%20Ekonomi%20Pada%20Risiko%20Investasi%20Di%20Industri%20Pertanian/0x1i92pE57WoGfLmeHjz5s"
              >
                Determinasi Faktor-Faktor Ekonomi Pada Risiko Investasi Di
                Industri Pertanian
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Features%20and%20the%20Structure%20of%20Life%20Skills%20in%20Persons%20with%20High%20Levels%20of%20Sense%20of%20Coherence/0x1iLa1ScaTRbgNxJABzQv"
              >
                Features and the Structure of Life Skills in Persons with High
                Levels of Sense of Coherence
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Speed-Up%20by%20Theories%20with%20Infinite%20Models/0x1iLrDhWtL7qFWQyFujEp"
              >
                Speed-Up by Theories with Infinite Models
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/An%20experiment%20for%20the%20correction%20of%20the%20onboard%20catalogue%20fragment%20of%20the%20BOKZ-M60%20star%20tracker/0x1iSa4zEF9HsGhqNC27Tt"
              >
                An experiment for the correction of the onboard catalogue
                fragment of the BOKZ-M60 star tracker
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Persistent%20nephrogenic%20diabetes%20insipidus%2C%20tubular%20proteinuria%2C%20aminoaciduria%2C%20and%20parathyroid%20hormone%20resistance%20following%20longterm%20lithium%20administration./0x1iY1VYimsd3Zev4LFMec"
              >
                Persistent nephrogenic diabetes insipidus, tubular proteinuria,
                aminoaciduria, and parathyroid hormone resistance following
                longterm lithium administration.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20s%C3%ADfilis%20e%20o%20aggiornamento%20do%20organicismo%20na%20psiquiatria%20brasileira%3A%20notas%20a%20uma%20li%C3%A7%C3%A3o%20do%20doutor%20Ulysses%20Vianna/0x1ibzkLRdP333DnDAoFZ2"
              >
                A sífilis e o aggiornamento do organicismo na psiquiatria
                brasileira: notas a uma lição do doutor Ulysses Vianna
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/3D%20statistics%20from%20TEM%20observations%20of%20TPFG%20EEPROM%20memory%20cells/0x1igvsduYfo2TbiYTUgsx"
              >
                3D statistics from TEM observations of TPFG EEPROM memory cells
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Nostalgija%20kaip%20sociologinio%20tyrimo%20objektas%3A%20problemos%20ir%20teorin%C4%97s%20prieigos/0x1ihwY8sfEuwhMQKaUowd"
              >
                Nostalgija kaip sociologinio tyrimo objektas: problemos ir
                teorinės prieigos
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mystery%20Case%3A%20Pontine%20tegmental%20cap%20dysplasia%20in%20a%20neonate/0x1imZYFFJFdHvQkU7p5K7"
              >
                Mystery Case: Pontine tegmental cap dysplasia in a neonate
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Health%20Problems%20and%20Health%20Seeking%20Behaviour%20of%20Hospital%20Cleaners%20in%20a%20Tertiary%20Health%20Facility%20in%20South%20West%20Nigeria/0x1ioGgEpGUWVH1Bn72bpq"
              >
                Health Problems and Health Seeking Behaviour of Hospital
                Cleaners in a Tertiary Health Facility in South West Nigeria
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Intelligent%20transport%20as%20a%20key%20component%20of%20implementation%20the%20sustainable%20development%20concept%20in%20smart%20cities/0x1iuvZRwS1g2KnwfH9gxY"
              >
                Intelligent transport as a key component of implementation the
                sustainable development concept in smart cities
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Gas%20and%20copper%20purity%20investigations%20for%20NEWS-G/0x1jRZUXCE5yfJtHFJEhv8"
              >
                Gas and copper purity investigations for NEWS-G
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Inducing%20Interpretable%20Voting%20Classifiers%20without%20Trading%20Accuracy%20for%20Simplicity%3A%20Theoretical%20Results%2C%20Approximation%20Algorithms/0x1jYHD6idYD5ocZa22rEw"
              >
                Inducing Interpretable Voting Classifiers without Trading
                Accuracy for Simplicity: Theoretical Results, Approximation
                Algorithms
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Manajemen%20User%20Dan%20Bandwidth%20Pada%20Hotspot%20Di%20Kantor%20BUMD%20Provinsi%20Bangka%20Belitung%20Menggunakan%20Router%20Mikrotik/0x1jgYv3DdPDUyVALRw6gT"
              >
                Manajemen User Dan Bandwidth Pada Hotspot Di Kantor BUMD
                Provinsi Bangka Belitung Menggunakan Router Mikrotik
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Biosurfactant%20Producing%20Bacteria%20from%20Oil%20Contaminated%20Egyptian%20Soil/0x1jiheKj74gBQx1uzYgbF"
              >
                Biosurfactant Producing Bacteria from Oil Contaminated Egyptian
                Soil
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Parametric%20Analysis%20and%20Optimization%20of%20Radially%20Layered%20Cylindrical%20Piezoceramic%2FEpoxy%20Composite%20Transducers/0x1jmkT2y1LGHsMYCgv4WN"
              >
                Parametric Analysis and Optimization of Radially Layered
                Cylindrical Piezoceramic/Epoxy Composite Transducers
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Do%20top%20management%20performance%20attribution%20patterns%20matter%20to%20subsequent%20organizational%20outcomes%3F%20A%20two-country%20study%20of%20attribution%20in%20economic%20crisis/0x1jsWHsuDvrvbdccgHFpG"
              >
                Do top management performance attribution patterns matter to
                subsequent organizational outcomes? A two-country study of
                attribution in economic crisis
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Re-evaluation%20of%20the%20genome%20sequence%20of%20guinea%20pig%20cytomegalovirus/0x1jtG4gS1hWBixKJdvh8h"
              >
                Re-evaluation of the genome sequence of guinea pig
                cytomegalovirus
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Partis%20communistes%20et%20partis%20socialistes%C2%A0%3A%20quatre%20exp%C3%A9riences%20de%20collaboration/0x1jtuqzujtVHy1Ha8pmFh"
              >
                Partis communistes et partis socialistes : quatre expériences de
                collaboration
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Comment%20on%3A%20%E2%80%9CProtective%20measurements%20and%20Bohm%20trajectories%E2%80%9D%20%5BPhys.%20Lett.%20A%20263%20(1999)%20137%5D/0x1jwp1FbC7HdyCCzLoNeV"
              >
                Comment on: “Protective measurements and Bohm trajectories”
                [Phys. Lett. A 263 (1999) 137]
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Analysis%20of%20Accidents%20Caused%20by%20Power%20Presses%20and%20the%20Consideration%20of%20Accident%20Prevention%20Methods/0x1k1yybQRheLhWMCPjBMy"
              >
                Analysis of Accidents Caused by Power Presses and the
                Consideration of Accident Prevention Methods
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Research%20on%20Multi-Energy%20Coordinated%20Intelligent%20Management%20Technology%20of%20Urban%20Power%20Grid%20Under%20the%20Environment%20of%20Energy%20Internet/0x1kCbmAqsaJAhavGD7Sif"
              >
                Research on Multi-Energy Coordinated Intelligent Management
                Technology of Urban Power Grid Under the Environment of Energy
                Internet
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pattern%20of%20injuries%20in%20epileptic%20children%3A%20A%20clinical%20study/0x1kL8UUTBs8WUWcDv3VEk"
              >
                Pattern of injuries in epileptic children: A clinical study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Role%20of%20livestock%20in%20human%20nutrition%20and%20health%20for%20poverty%20reduction%20in%20developing%20countries/0x1kP68Tq79SSvb18c2GcS"
              >
                Role of livestock in human nutrition and health for poverty
                reduction in developing countries
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Patient%20Perspectives%20on%20Personalized%20Glucose%20Advisory%20Systems%20for%20Type%201%20Diabetes%20Management/0x1kdytVmUPHE32sY8hSqC"
              >
                Patient Perspectives on Personalized Glucose Advisory Systems
                for Type 1 Diabetes Management
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20Gene%20of%20Synechocystis%20sp.%20Strain%20PCC%206803%20Encoding%20a%20Novel%20Iron%20Transporter/0x1keu4994ohoMSs5vcZvC"
              >
                A Gene of Synechocystis sp. Strain PCC 6803 Encoding a Novel
                Iron Transporter
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Continuing%20to%20protect%20the%20nanotechnology%20workforce%3A%20NIOSH%20nanotechnology%20research%20plan%20for%202018%20-%202025./0x1kfhR3vRUVKw9RLjy73X"
              >
                Continuing to protect the nanotechnology workforce: NIOSH
                nanotechnology research plan for 2018 - 2025.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/EARTH%20SCIENCE%3A%20Old%20and%20Crusty/0x1kppj656YJv8QtGnQUmn"
              >
                EARTH SCIENCE: Old and Crusty
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Authors'%20response%20to%20Commentaries%20on%20Outcomes%20in%20Occupational%20Cancer%20Epidemiologya/0x1ktYwYGppKAULxHLQr1R"
              >
                Authors' response to Commentaries on Outcomes in Occupational
                Cancer Epidemiologya
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/CONFRONTING%20SIMULATIONS%20OF%20OPTICALLY%20THICK%20GAS%20IN%20MASSIVE%20HALOS%20WITH%20OBSERVATIONS%20ATz%3D%202-3/0x1kzyFtSHHhJsFBc1frqX"
              >
                CONFRONTING SIMULATIONS OF OPTICALLY THICK GAS IN MASSIVE HALOS
                WITH OBSERVATIONS ATz= 2-3
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pierre%20Lyonet%E2%80%99s%20(1706%E2%80%931789)%20Study%20of%20Insects%3A%20Displaying%20Virtue%20and%20Gaining%20Social%20Status%20through%20Natural%20History/0x1m5MWT38BD7R7YsDUjVM"
              >
                Pierre Lyonet’s (1706–1789) Study of Insects: Displaying Virtue
                and Gaining Social Status through Natural History
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/DEFORMATION-STRENGTH%20PROPERTIES%20AND%20DESIGN%20METHODS%20OF%20SOILBAG%20ASSEMBLY/0x1m6HkVVnv5nMjHjjSwmi"
              >
                DEFORMATION-STRENGTH PROPERTIES AND DESIGN METHODS OF SOILBAG
                ASSEMBLY
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mermas%20y%20Desmedros%20y%20su%20Incidencia%20en%20los%20Estados%20Financieros%20y%20en%20el%20Impuesto%20a%20la%20Renta%20en%20las%20Empresas%20del%20Sector%20Av%C3%ADcola%20de%20Lima%2C%20a%C3%B1o%202017/0x1m7MnxRugs9XVSNyArD8"
              >
                Mermas y Desmedros y su Incidencia en los Estados Financieros y
                en el Impuesto a la Renta en las Empresas del Sector Avícola de
                Lima, año 2017
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Intermittent%20Nitrate%20Therapy%20for%20Prior%20Myocardial%20Infarction%20Does%20Not%20Induce%20Rebound%20Angina%20nor%20Reduce%20Cardiac%20Events./0x1m7fiRh1CSjpdxSj37BQ"
              >
                Intermittent Nitrate Therapy for Prior Myocardial Infarction
                Does Not Induce Rebound Angina nor Reduce Cardiac Events.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%D8%B9%D9%82%D8%A7%D8%A8%D8%A7%D9%86%20%D8%AE%DB%8C%D8%A8%D8%B1/0x1m8NuaZq5siotagA5HwZ"
              >
                عقابان خیبر
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Globalization%20from%20Below%3A%20Toward%20a%20Collectively%20Rational%20and%20Democratic%20Global%20Commonwealth/0x1m8ZS8Mhdr1D9nvqh9VL"
              >
                Globalization from Below: Toward a Collectively Rational and
                Democratic Global Commonwealth
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Constituintes%20qu%C3%ADmicos%20e%20avalia%C3%A7%C3%A3o%20preliminar%20in%20vivo%20da%20atividade%20antimal%C3%A1rica%20de%20Ouratea%20nitida%20Aubl%20(Ochnaceae)/0x1mE1XzeNGx3VEyiTDTJn"
              >
                Constituintes químicos e avaliação preliminar in vivo da
                atividade antimalárica de Ouratea nitida Aubl (Ochnaceae)
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Dissecting%20a%20role%20of%20evolutionary-conserved%20but%20noncritical%20disulfide%20bridges%20in%20cysteine-rich%20peptides%20using%20%CF%89-conotoxin%20GVIA%20and%20its%20selenocysteine%20analogs/0x1mNvuG4VzszKyE8LCkWC"
              >
                Dissecting a role of evolutionary-conserved but noncritical
                disulfide bridges in cysteine-rich peptides using ω-conotoxin
                GVIA and its selenocysteine analogs
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Figure%207e%20from%3A%20Salmela%20J%2C%20Kolcs%C3%A1r%20L%20(2017)%20New%20and%20poorly%20known%20Palaearctic%20fungus%20gnats%20(Diptera%2C%20Sciaroidea).%20Biodiversity%20Data%20Journal%205%3A%20e11760.%20https%3A%2F%2Fdoi.org%2F10.3897%2FBDJ.5.e11760/0x1mYnPtcCKmXuvwcLbAZ9"
              >
                Figure 7e from: Salmela J, Kolcsár L (2017) New and poorly known
                Palaearctic fungus gnats (Diptera, Sciaroidea). Biodiversity
                Data Journal 5: e11760. https://doi.org/10.3897/BDJ.5.e11760
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/An%C3%A1lisis%20y%20establecimiento%20de%20una%20jerarqu%C3%ADa%20de%20valores%20del%20alumnado%20de%20ciclos%20formativos%20de%20grado%20medio-superior%20de%20formaci%C3%B3n%20profesional%20mediante%20un%20proceso%20de%20triangulaci%C3%B3n%20anal%C3%ADtica/0x1mZ8seYdHi5EJCRfw8B8"
              >
                Análisis y establecimiento de una jerarquía de valores del
                alumnado de ciclos formativos de grado medio-superior de
                formación profesional mediante un proceso de triangulación
                analítica
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Craniometaphyseal%20Dysplasia%3A%20A%20Case%20Report/0x1mdhUURGyEdTf4XKzV22"
              >
                Craniometaphyseal Dysplasia: A Case Report
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Localization%20and%20functional%20properties%20of%20a%20rat%20brain%20alpha%201A%20calcium%20channel%20reflect%20similarities%20to%20neuronal%20Q-%20and%20P-type%20channels./0x1mfk87JnGXsYGw8hwX7K"
              >
                Localization and functional properties of a rat brain alpha 1A
                calcium channel reflect similarities to neuronal Q- and P-type
                channels.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/WebQuest%20Destekli%20Matematik%20%C3%96%C4%9Fretiminin%20Alt%C4%B1nc%C4%B1%20S%C4%B1n%C4%B1f%20%C3%96%C4%9Frencilerinin%20Ele%C5%9Ftirel%20D%C3%BC%C5%9F%C3%BCnme%20Becerilerine%20Etkisi/0x1mqiwAXRinw5cLKP3quC"
              >
                WebQuest Destekli Matematik Öğretiminin Altıncı Sınıf
                Öğrencilerinin Eleştirel Düşünme Becerilerine Etkisi
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Ultrasonic%20Measurement%20of%20Pipe%20Thickness/0x1mvs3MbLV2e3miGf7m3X"
              >
                Ultrasonic Measurement of Pipe Thickness
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20Low%20Temperature%20Treatment%20on%20Autumn%20Seed%20Production%20of%20Chinese%20Cabbage./0x1nQBBCP7St4C3EhFFNpi"
              >
                Effect of Low Temperature Treatment on Autumn Seed Production of
                Chinese Cabbage.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Future%20expectations%20of%20agronomy%20intensification%20due%20to%20use%20of%20mineral%20fertilizers/0x1nQY6cLJW6k9RJ8yrrX7"
              >
                Future expectations of agronomy intensification due to use of
                mineral fertilizers
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Surgical%20treatment%20of%20the%20thyroid%20nodes%20of%20uncertain%20cytological%20structure/0x1nTQ4EoLcpoJcRBbcyZ1"
              >
                Surgical treatment of the thyroid nodes of uncertain cytological
                structure
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Association%20between%20Metabolic%20Syndrome%20and%20Menstrual%20Irregularity%20in%20Middle-Aged%20Korean%20Women/0x1nUfuJZTStux9qCpy9Tp"
              >
                Association between Metabolic Syndrome and Menstrual
                Irregularity in Middle-Aged Korean Women
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Is%20Knowledge%20of%20the%20Tax%20Law%20Socially%20Desirable%3F/0x1nfkngfFi3MPmLxmbbh7"
              >
                Is Knowledge of the Tax Law Socially Desirable?
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Angiographic%20and%20clinical%20results%20in%20316%20coil-treated%20basilar%20artery%20bifurcation%20aneurysms/0x1nmZ5cndCDD2DwUafdBW"
              >
                Angiographic and clinical results in 316 coil-treated basilar
                artery bifurcation aneurysms
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Research%20on%20the%20Impact%20of%20a%20Drill%20Bit%20on%20the%20Original%20State%20of%20Artificial%20Lunar%20Soil%20using%20DEM%20Simulation/0x1o7E5ki1oWR8RHBiWoLk"
              >
                Research on the Impact of a Drill Bit on the Original State of
                Artificial Lunar Soil using DEM Simulation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Nucleoplasmic%20LAP2%CE%B1%E2%80%93lamin%20A%20complexes%20are%20required%20to%20maintain%20a%20proliferative%20state%20in%20human%20fibroblasts/0x1o95EvYBtsGqV1RPrzU7"
              >
                Nucleoplasmic LAP2α–lamin A complexes are required to maintain a
                proliferative state in human fibroblasts
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Cation-Exchange%20Chromatographic%20Separation%20of%20Antimony(III)%20with%20Hydrobromic%20Acid%20in%20Organic%20Solvents./0x1oH9EM6DqXnV9P2pnkVi"
              >
                Cation-Exchange Chromatographic Separation of Antimony(III) with
                Hydrobromic Acid in Organic Solvents.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Curative%20Intent%20Treatment%20for%20Colorectal%20Cancer%20with%20Isolated%20Brain%20Metastases%3A%20A%20Case%20Report/0x1oPLV3mPMGpKn94xCpRi"
              >
                Curative Intent Treatment for Colorectal Cancer with Isolated
                Brain Metastases: A Case Report
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Macrophage%20traits%20in%20cancer%20cells%20are%20induced%20by%20macrophage-cancer%20cell%20fusion%20and%20cannot%20be%20explained%20by%20cellular%20interaction/0x1oi2iWeAKxGXjmrEXyWW"
              >
                Macrophage traits in cancer cells are induced by
                macrophage-cancer cell fusion and cannot be explained by
                cellular interaction
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Graph%20model-based%20analysis%20of%20technical%20systems/0x1ok3wdhksAiqC7mAErsC"
              >
                Graph model-based analysis of technical systems
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Effects%20of%20the%20Fear%20of%20Success%20and%20Rejection%20Sensitivity%20on%20Learning%20English/0x1ox831DQgiJUp7Rd18Zw"
              >
                The Effects of the Fear of Success and Rejection Sensitivity on
                Learning English
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Stability%20of%20an%20Electric%20Vehicle%20with%20Permanent-Magnet%20In-Wheel%20Motors%20during%20Electrical%20Faults/0x1oxK5YNaGUPZPCTy1FF4"
              >
                Stability of an Electric Vehicle with Permanent-Magnet In-Wheel
                Motors during Electrical Faults
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Biochemical%20Basis%20of%20the%20Resistance%20of%20Sugarcane%20to%20Eyespot%20Disease/0x1oxw7Mkqq4VWxa97pkW7"
              >
                Biochemical Basis of the Resistance of Sugarcane to Eyespot
                Disease
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Evaluating%20trade-offs%20between%20quantitative%20and%20qualitative%20protected%20area%20objectives/0x1pHeA7UWGyvrchkzUgqR"
              >
                Evaluating trade-offs between quantitative and qualitative
                protected area objectives
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Identification%20of%20the%20origin%20of%20monojet%20signatures%20at%20the%20LHC/0x1pJkGZYMrY81Y3pGVyXy"
              >
                Identification of the origin of monojet signatures at the LHC
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Early%20childhood%20wheezers%3A%20identifying%20asthma%20in%20later%20life/0x1poxYWuSWZCvtfE28Ckf"
              >
                Early childhood wheezers: identifying asthma in later life
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Motion%20Estimation%20and%20Signaling%20Techniques%20for%202D%2Bt%20Scalable%20Video%20Coding/0x1pwR361kedaZ25susmNg"
              >
                Motion Estimation and Signaling Techniques for 2D+t Scalable
                Video Coding
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1q8AFNvasYH5CFHTuboc"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Charged%20lepton%20flavour%20violation%20at%20the%20CMS%20experiment/0x1qJSUghab3ZxBASRGs8p"
              >
                Charged lepton flavour violation at the CMS experiment
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Why%20and%20how%20is%20compassion%20necessary%20to%20provide%20good%20quality%20healthcare%3F/0x1qMhETJNXpGS8cWqbXy1"
              >
                Why and how is compassion necessary to provide good quality
                healthcare?
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/On%20Lower%20Bounds%20for%20Variance%20And%20Moments%20of%20Unimodal%20Distributions/0x1qMpLRJmgduesAWcBMCm"
              >
                On Lower Bounds for Variance And Moments of Unimodal
                Distributions
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Triggering%20factors%20of%20work-related%20stress%20in%20nursing%3A%20evidenced%20in%20literature/0x1qVjaRUpHMs2EXUGTZrq"
              >
                Triggering factors of work-related stress in nursing: evidenced
                in literature
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Search%20for%20new%20T%20Tauri%20stars%20in%20the%20Cepheus-Cassiopeia%20region/0x1qj5SkXXk7AvrtqjDWqp"
              >
                Search for new T Tauri stars in the Cepheus-Cassiopeia region
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Book%20Review%3A%20Caract%C3%A9ristiques%20des%20Syst%C3%A8mes%20Diff%C3%A9rentiels%20et%20Propagation%20des%20Ondes/0x1qnUFGwedQLeqgS5Z7zs"
              >
                Book Review: Caractéristiques des Systèmes Différentiels et
                Propagation des Ondes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/O%20trabalho%20na%20Sa%C3%BAde%20da%20Fam%C3%ADlia%3A%20a%20busca%20pela%20integralidade%20da%20aten%C3%A7%C3%A3o%20na%20perspectiva%20das%20enfermeiras/0x1qoh4c6FAJxcWdCXjFsx"
              >
                O trabalho na Saúde da Família: a busca pela integralidade da
                atenção na perspectiva das enfermeiras
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Strategic%20Implementation%20of%20Green%20Public%20Procurement%20in%20the%20City%20of%20Buenos%20Aires/0x1quo99DXo8cg9uQaBuGz"
              >
                Strategic Implementation of Green Public Procurement in the City
                of Buenos Aires
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Scientific%20and%20Practical%20Information/0x1rANzQ7N5rxX8GmAAaJW"
              >
                Scientific and Practical Information
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Liouville%20Type%20Theorems%20for%20Lichnerowicz%20Equations%20and%20Ginzburg-Landau%20Equation%3A%20Survey/0x1rG8QYZgzbpKUjU1mu56"
              >
                Liouville Type Theorems for Lichnerowicz Equations and
                Ginzburg-Landau Equation: Survey
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Development%20of%20a%20Change%20Management%20Instrument%20for%20the%20Implementation%20of%20Technologies/0x1rMtVQVZhMhzQS2P7hNT"
              >
                Development of a Change Management Instrument for the
                Implementation of Technologies
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Navigation%20Surgery%20Using%20an%20Open%20MR%20System/0x1rRAnEBQuo1H6kBobaNU"
              >
                Navigation Surgery Using an Open MR System
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Allergen%20tolerance%20versus%20the%20allergic%20march%3A%20The%20hygiene%20hypothesis%20revisited/0x1rU1grVCoHwGmNPPpAH8"
              >
                Allergen tolerance versus the allergic march: The hygiene
                hypothesis revisited
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Experimental%20vitamin%20B12%20deficiency%20in%20a%20human%20subject%3A%20a%20longitudinal%20investigation%20of%20the%20performance%20of%20the%20holotranscobalamin%20(HoloTC%2C%20Active-B12)%20immunoassay/0x1ram2k4EKUKdKEnCmmWs"
              >
                Experimental vitamin B12 deficiency in a human subject: a
                longitudinal investigation of the performance of the
                holotranscobalamin (HoloTC, Active-B12) immunoassay
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Challenges%20to%20Temperature%20Regulation%20When%20Working%20in%20Hot%20Environments/0x1rm1S8wYTkFeVQfs5Z4T"
              >
                Challenges to Temperature Regulation When Working in Hot
                Environments
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1rvYuATQNX7seLguRXhq"
              ></a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Effect%20of%20Formulation%20Factors%20on%20In%20Vitro%20Permeation%20of%20Diclofenac%20from%20Experimental%20and%20Marketed%20Aqueous%20Eye%20Drops%20through%20Excised%20Goat%20Cornea/0x1s42uwVAfLsTDoK1jjLq"
              >
                Effect of Formulation Factors on In Vitro Permeation of
                Diclofenac from Experimental and Marketed Aqueous Eye Drops
                through Excised Goat Cornea
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Design%20and%20fabrication%20of%20engineered%20platforms%20to%20control%20multiple%20cue%20directed%20cell%20migration/0x1sBqGuVoEDNWG3CRgwQD"
              >
                Design and fabrication of engineered platforms to control
                multiple cue directed cell migration
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Efficacy%20and%20Safety%20of%20a%20Fixed%20Combination%20of%20Tramadol%20and%20Paracetamol%20(Acetaminophen)%20as%20Pain%20Therapy%20Within%20Palliative%20Medicine%20/0x1sLixPAR79HMuwtoherg"
              >
                Efficacy and Safety of a Fixed Combination of Tramadol and
                Paracetamol (Acetaminophen) as Pain Therapy Within Palliative
                Medicine{" "}
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Binalarda%20Enerji%20Verimlili%C4%9Fi%20Kapsam%C4%B1nda%20Yap%C4%B1lan%20Projelerin%20De%C4%9Ferlendirilmesi%3A%20T%C3%BCrkiye%20%C3%96rne%C4%9Fi/0x1sfDnpQ7m28nxZZSMg6j"
              >
                Binalarda Enerji Verimliliği Kapsamında Yapılan Projelerin
                Değerlendirilmesi: Türkiye Örneği
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Bound%20and%20free%20water%20relationships%20in%20soy%20proteins%20as%20measured%20by%20differential%20scanning%20calorimetry/0x1sfP19wot2DUeg2E2Mv8"
              >
                Bound and free water relationships in soy proteins as measured
                by differential scanning calorimetry
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Experiential%20learning%20in%20African%20Planning%20Schools%3A%20reflections%20on%20the%20Association%20of%20African%20Planning%20Schools%20(AAPS)%20case%20study%20project/0x1sgaznQUfV4G7jvMf8we"
              >
                Experiential learning in African Planning Schools: reflections
                on the Association of African Planning Schools (AAPS) case study
                project
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/ABSENCE%20OF%20THE%20PULMONARY%20VALVE%20WITH%20VENTRICULAR%20SEPTAL%20DEFECT/0x1siRC2gUfsmnn5Z7m4pS"
              >
                ABSENCE OF THE PULMONARY VALVE WITH VENTRICULAR SEPTAL DEFECT
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Spatial%20Release%20From%20Masking%20in%20Children/0x1t158eaQqAoJKvNt8ejg"
              >
                Spatial Release From Masking in Children
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Short%20Term%20Prediction%20of%20Coal%20Mine%20Methane%20Concentration%20with%20Chaos%20PSO-RBFNN%20Model%20in%20Underground%20Coal%20Mines/0x1tSzDzz2EVUSievkR7AW"
              >
                Short Term Prediction of Coal Mine Methane Concentration with
                Chaos PSO-RBFNN Model in Underground Coal Mines
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Solvent-controlled%20reversible%20switching%20between%20adsorbed%20self-assembled%20nanoribbons%20and%20nanotubes/0x1tXbZbQ56tDS11j1e6XM"
              >
                Solvent-controlled reversible switching between adsorbed
                self-assembled nanoribbons and nanotubes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Table_1.DOCX/0x1taD2HcUNR8ERcuHyG8R"
              >
                Table_1.DOCX
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/TGFB1%20Gene%20Promoter%20Polymorphisms%20in%20Serbian%20Asthmatics/0x1tfWDFyd8jyRfQpadW2N"
              >
                TGFB1 Gene Promoter Polymorphisms in Serbian Asthmatics
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Sex%20Identification%20in%20Birds%20Using%20Two%20CHD%20Genes/0x1tfqgUk3VQbZ5Rki8oEF"
              >
                Sex Identification in Birds Using Two CHD Genes
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Aspectos%20Regulat%C3%B3rios%20do%20Setor%20El%C3%A9trico%20e%20os%20Impactos%20Decorrentes%20da%20Implanta%C3%A7%C3%A3o%20de%20Linhas%20de%20Transmiss%C3%A3o/0x1tiPBXNG7M1hYLarAZSL"
              >
                Aspectos Regulatórios do Setor Elétrico e os Impactos
                Decorrentes da Implantação de Linhas de Transmissão
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Pendampingan%20Usaha%20BUMDes%20Maju%20Jaya%20Desa%20Sawiji%2C%20Kecamatan%20Diwek%2C%20Kabupaten%20Jombang/0x1u4pC5AYxLGssEYSHTv5"
              >
                Pendampingan Usaha BUMDes Maju Jaya Desa Sawiji, Kecamatan
                Diwek, Kabupaten Jombang
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Measuring%20Children%CA%BCs%20Physical%20Activity/0x1uADoWpDJzPgPQUwy9Ni"
              >
                Measuring Childrenʼs Physical Activity
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Convergence%20in%20leaf%20size%20versus%20twig%20leaf%20area%20scaling%3A%20do%20plants%20optimize%20leaf%20area%20partitioning%3F/0x1uLNS5wuuhrMWp6DfB2f"
              >
                Convergence in leaf size versus twig leaf area scaling: do
                plants optimize leaf area partitioning?
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Sentence%20processing%20selectivity%20in%20Broca's%20area%3A%20evident%20for%20structure%20but%20not%20syntactic%20movement/0x1uLQ8YSqiXDoPm1WbS4Z"
              >
                Sentence processing selectivity in Broca's area: evident for
                structure but not syntactic movement
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Antimicrobial%20Activity%20of%20Foreign%20Plant%20Extracts%20Against%20Foodborne%20Pathogens/0x1uMceojDtaSh3JSFW2rU"
              >
                Antimicrobial Activity of Foreign Plant Extracts Against
                Foodborne Pathogens
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Views%20of%20the%20Data%20Transmission%20Committee/0x1uSyQFLKXSKrnoJeQG17"
              >
                The Views of the Data Transmission Committee
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/El%20enfoque%20territorial%20del%20desarrollo%20rural%20y%20las%20pol%C3%ADticas%20p%C3%BAblicas%20territoriales./0x1uXWFkVy7DWa2bnf1CSZ"
              >
                El enfoque territorial del desarrollo rural y las políticas
                públicas territoriales.
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Bochdalek%20Hernia%20in%20Asymptomatic%20Adults%3A%20A%20Case%20Report%20of%20Radiological%20Importance/0x1v8Seakh5iyozjhLs5wQ"
              >
                Bochdalek Hernia in Asymptomatic Adults: A Case Report of
                Radiological Importance
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/0x1vBdmNQzAaSzwaB68iEN"
              >
                null
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/IDENTIFIKASI%20KERUSAKAN%20STRUKTUR%20BALOK%20SEDERHANA%20BERDASARKAN%20ANALISIS%20DATA%20MODAL%20DINAMIK/0x1vtEn5Ha2q85qQdh7SjX"
              >
                IDENTIFIKASI KERUSAKAN STRUKTUR BALOK SEDERHANA BERDASARKAN
                ANALISIS DATA MODAL DINAMIK
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Savings%20and%20taxes%20of%20individuals%20in%20the%20Russian%20Arctic%3A%20an%20analysis%20of%20interference/0x1wQoM2BpgqkVTugti5mo"
              >
                Savings and taxes of individuals in the Russian Arctic: an
                analysis of interference
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/The%20Immunomodulatory%20Effects%20of%20Garenoxacin%20on%20Interleukin-8%20Produced%20by%20Human%20Tonsillar%20Lymphocytes%20with%20Lipopolysaccharide%20Stimulation/0x1wRybWhcTLnqRbeciRJw"
              >
                The Immunomodulatory Effects of Garenoxacin on Interleukin-8
                Produced by Human Tonsillar Lymphocytes with Lipopolysaccharide
                Stimulation
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/%E5%AF%B9%E5%8F%91%E5%B1%95%E6%88%91%E5%9B%BD%E4%BA%BA%E7%B1%BB%E5%AD%A6%E7%A0%94%E7%A9%B6%E7%9A%84%E5%87%A0%E7%82%B9%E6%84%8F%E8%A7%81/0x1wdMb5QAXqiRMf2efHAQ"
              >
                对发展我国人类学研究的几点意见
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Mikroenkapsulasi%20Strain%20Probiotik%20Leuconostoc%20mesenteroides%20ssp.%20Cremonis%20BN12%20Menggunakan%20Berbagai%20Penyalut/0x1wfyRrd6DwqzibwYhhoV"
              >
                Mikroenkapsulasi Strain Probiotik Leuconostoc mesenteroides ssp.
                Cremonis BN12 Menggunakan Berbagai Penyalut
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Incorporation%20of%20Hybrid%20Crystalline%20Microporous%20Materials%20in%20Mixed-Matrix%20Membranes%20for%20Gas%20Separations/0x1wkS4mj1fH2aNWn4K4jj"
              >
                Incorporation of Hybrid Crystalline Microporous Materials in
                Mixed-Matrix Membranes for Gas Separations
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Sex-biased%20dispersal%20in%20sperm%20whales%3A%20contrasting%20mitochondrial%20and%20nuclear%20genetic%20structure%20of%20global%20populations/0x1woBssKkEoKfHJqw2co2"
              >
                Sex-biased dispersal in sperm whales: contrasting mitochondrial
                and nuclear genetic structure of global populations
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Regional%20financial%20security%20as%20a%20basis%20for%20sustainable%20economic%20development%20of%20the%20region/0x1xAtMHh6yBoymJMDrqUe"
              >
                Regional financial security as a basis for sustainable economic
                development of the region
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Innovation%20oncological%20rehabilitation%3A%20Applicability%20of%20the%20different%20techniques%20physiotherapeutic%20post%20breast%20cancer/0x1xCEjbUS5w3Z27G6k9bS"
              >
                Innovation oncological rehabilitation: Applicability of the
                different techniques physiotherapeutic post breast cancer
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20CASE%20OF%20RHABDOMYOLYSIS%20AND%20MULTIPLE%20ORGAN%20FAILURE%20DUE%20TO%20DRUG%20INTOXICATION/0x1xMKWfVtcgeQ3TBm4rS3"
              >
                A CASE OF RHABDOMYOLYSIS AND MULTIPLE ORGAN FAILURE DUE TO DRUG
                INTOXICATION
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/VALIDATION%20OF%20THE%20INTERNATIONAL%20AFFECTIVE%20PICTURE%20SYSTEM%20(IAPS)%20IN%20SERBIA%3A%20COMPARISON%20OF%20A%20SERBIAN%20AND%20A%20HUNGARIAN%20SAMPLE/0x1xY524gvKzjq6WQJzVcw"
              >
                VALIDATION OF THE INTERNATIONAL AFFECTIVE PICTURE SYSTEM (IAPS)
                IN SERBIA: COMPARISON OF A SERBIAN AND A HUNGARIAN SAMPLE
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Major%20stressors%20influencing%20the%20river%20ecosystems%20of%20Far%20and%20Mid%20Western%20Development%20Regions%20of%20Nepal/0x1y9WgAjZaXGHqY2ifmet"
              >
                Major stressors influencing the river ecosystems of Far and Mid
                Western Development Regions of Nepal
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Clinical%20Lecture%20on%20the%20Treatment%20of%20Detachment%20of%20the%20Retina/0x1yEg3mxMxx6DycPgmXFK"
              >
                Clinical Lecture on the Treatment of Detachment of the Retina
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/A%20non-linear%20viscoelastic%20model%20for%20the%20tympanic%20membrane/0x1z1vpaWkgHAkDVJXPvFp"
              >
                A non-linear viscoelastic model for the tympanic membrane
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Divalent%20cation%20competition%20with%20%5B3H%5Dsaxitoxin%20binding%20to%20tetrodotoxin-%20resistant%20and%20-sensitive%20sodium%20channels.%20A%20two-site%20structural%20model%20of%20ion%2Ftoxin%20interaction/0x1z6Hx9PSoqB3yundpqPW"
              >
                Divalent cation competition with [3H]saxitoxin binding to
                tetrodotoxin- resistant and -sensitive sodium channels. A
                two-site structural model of ion/toxin interaction
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/AMYLOID%20BURDEN%2C%20CORTICAL%20THICKNESS%2C%20AND%20COGNITIVE%20FUNCTION%20IN%20THE%20WISCONSIN%20REGISTRY%20FOR%20ALZHEIMER'S%20PREVENTION/0x1zGgPDxZ9WHsNfyvKdwv"
              >
                AMYLOID BURDEN, CORTICAL THICKNESS, AND COGNITIVE FUNCTION IN
                THE WISCONSIN REGISTRY FOR ALZHEIMER'S PREVENTION
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/HIV%20care%20provider%20perceptions%20and%20approaches%20to%20managing%20unhealthy%20alcohol%20use%20in%20primary%20HIV%20care%20settings%3A%20a%20qualitative%20study/0x1zYgU9GWJoJkTYTPEWsw"
              >
                HIV care provider perceptions and approaches to managing
                unhealthy alcohol use in primary HIV care settings: a
                qualitative study
              </a>
            </p>
            <p>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/On%20the%20impact%20of%20using%20unreliable%20data%20on%20the%20bootstrap%20channel%20estimation%20performance/0x1zdTmb6GGLwCMSDFcreE"
              >
                On the impact of using unreliable data on the bootstrap channel
                estimation performance
              </a>
            </p>
            <p style={{ marginBottom: "0px", paddingBottom: "5%" }}>
              <a
                className={classes.link}
                href="https://app.getpolarized.io/d/Measurement%20of%20return%20on%20marketing%20investment%3A%20A%20conceptual%20framework%20and%20the%20future%20of%20marketing%20metrics/0x1zi4cGXKKzygozbK2GuM"
              >
                Measurement of return on marketing investment: A conceptual
                framework and the future of marketing metrics
              </a>
            </p>
          </Box>
        </Box>
      </ThemeProvider>
    </Layout>
  );
};

export default Landing;
