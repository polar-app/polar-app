import {css} from "@emotion/react";
import styled from "@emotion/styled";
import {Exclude as ExcludeIcon} from "icons/Exclude";
import React from "react";
import {Link} from "styled/Link";
import {Typography} from "styled/Typography";
import {flex} from "styles/flex";
import {ml, mt, mx, my} from "styles/margin";
import {Breakpoints} from "styles/media-query";
import {pb, pt, px} from "styles/padding";

type IFeature = {
    readonly title: string;
    readonly description: string;
    readonly image: string;
}

const FEATURES_DATA: ReadonlyArray<IFeature> = [
    {
        title: "Your Reading Organized",
        description: "Save all your PDFS, EPUBS, and websites to read for later in one place. Organize and manage your reading with tags, flags,reading progress tracking, detailed doc metadata and much more.",
        image: "/assets/feature1.png",
    },
    {
        title: "Reading on Steroids",
        description: "Experience a reader with the most advanced features out there. Highlight text or areas of a file, create flashcards using AI, link information across files or highlights, track reading, and much more",
        image: "/assets/feature2.png",
    },
    {
        title: "Non-linear notes",
        description: "Non-linear notes to connect any note, highlight, or thought. With backlinks, you can link your entire knowledge base across notes, reading, and flashcards",
        image: "/assets/feature3.png",
    },
    {
        title: "Flashcards in one click",
        description: "Save time creating flashcards in one click from any highlight using AI or create them manually for more flexibility. Review them directly in Polar or export them to Anki",
        image: "/assets/feature4.png",
    },
    {
        title: "Light & Dark Mode",
        description: "Look, we get it -sometimes we want light mode, sometimes we want dark mode. So we built both for you to choose from. Your mode also applies to the files",
        image: "/assets/feature5.png",
    }
];

const Section = styled('section')`
    ${flex({ align: 'center', dir: 'column', justify: 'space-between' })}
    background: #FFF;
    min-height: 100vh;
    ${({ theme }) => pb(14)(theme)}
`;

const FeatureContainer = styled('div')`
    ${flex({ dir: 'column', align: 'center' })}
    ${({ theme }) => px(3.75)(theme)}
    text-align: center;
    ${({ theme }) => mt(7)(theme)}
    max-width: ${Breakpoints.xl}px;

    & > img {
        display: block;
        max-width: 100%;
        margin-top: ${({ theme }) => theme.spacing(4)}px;
    }
`;

const Feature: React.FC<IFeature> = (props) => {
    const { description, title, image } = props;

    return (
        <FeatureContainer>
            <ExcludeIcon />
            <Typography.h3>{title}</Typography.h3>
            <p css={css`font-weight: 300`}>
                {description}
            </p>
            <img src={image} />
        </FeatureContainer>
    );
};

const CreditsLogo = styled('img')`
    height: 36px;
    display: block;
`;

const TrustedContainer = styled('div')`
    ${flex({ justify: 'center', align: 'center' })}
    flex-wrap: wrap;
    ${({ theme }) => pt(2)(theme)}

    & img + img {
        ${({ theme }) => ml(5)(theme)}
        ${({ theme }) => my(2)(theme)}
    }
`;

export const FeaturesSection: React.FC = () => {
    return (
        <Section>
            {FEATURES_DATA.map((feat, i) => <Feature key={i} {...feat} />)}
            <div css={theme => css`
                    ${my(8)(theme)}
                    ${mx(2)(theme)}
                    ${flex({ dir: 'column', align: 'center' })}
                `}>
                <Typography.caption css={theme => css`color: ${theme.palette.text.normal.hint};`}>
                    TRUSTED BY USERS AT
                </Typography.caption>
                <TrustedContainer>
                    <CreditsLogo src="/assets/tufts.svg" />
                    <CreditsLogo src="/assets/bridgewater.svg" />
                    <CreditsLogo src="/assets/yale.svg" />
                    <CreditsLogo src="/assets/broadinstitute.svg" />
                    <CreditsLogo src="/assets/berkeley.svg" />
                    <CreditsLogo src="/assets/stanford.svg" />
                </TrustedContainer>
            </div>
            <Link href="https://app.getpolarized.io/create-account">Get Early Access</Link>
        </Section>
    );
};

