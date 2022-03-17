import React from "react";
import styled from "@emotion/styled";
import {Logo} from "icons/Logo";
import {py, px} from "styles/padding";
import {flex} from "styles/flex";
import {ml, my} from "styles/margin";
import {Breakpoints, mq} from "styles/media-query";
import NextLink from "next/link";
import {css} from "@emotion/react";


const Stripe = styled('div')`
    height: 10px;
    width: 100%;
    background: ${({ theme }) => theme.palette.accent(-90)}
`;

const FooterContainer = styled('footer')`
    background: ${({ theme }) => theme.palette.primary};
    color: ${({ theme }) => theme.palette.text.reversed.primary};
`;

const FooterLogo: React.FC = () => (
    <NextLink href="/">
        <Logo css={theme => css`
                font-size: 9.8rem;
                fill: ${theme.palette.text.reversed.primary};
                cursor: pointer;
            `} />
    </NextLink>
);

const ContentContainer = styled('div')`
    ${({ theme }) => py(4.75)(theme)}
    ${({ theme }) => px(4)(theme)}
    ${flex({ justify: 'space-between' })}

    ${mq(Breakpoints.lg)} {
        & {
            ${flex({ align: 'center', dir: 'column' })}
        }
    }
`;

const LinksContainer = styled('div')`
    ${flex({ align: 'center' })}

    a {
        color: ${({ theme }) => theme.palette.text.reversed.primary};
        transition: color 150ms ease-out;
    }

    a:hover, a:active {
        color: ${({ theme }) => theme.palette.text.reversed.hint};
    }

    a + a {
        ${({ theme }) => ml(4)(theme)}
    }

    ${mq(Breakpoints.lg)} {
        & {
            ${({ theme }) => my(6)(theme)}
        }
    }
`;

export const Footer: React.FC = () => {
    const year = React.useMemo(() => new Date().getFullYear(), []);

    return (
        <FooterContainer>
            <Stripe />
            <ContentContainer>
                <FooterLogo />
                <LinksContainer>
                    <a href="https://getpolarized.io/privacy-policy/">Privacy Policy</a>
                    <a href="https://getpolarized.io/terms/">Terms of Use</a>
                    <a href="https://getpolarized.io/docs/">Documentation</a>
                    <a href="https://getpolarized.io/blog/">Blog</a>
                </LinksContainer>
                <div css={flex({ align: 'center' })}>
                    <div>@{year} POLAR.  All rights reserved.</div>
                </div>
            </ContentContainer>
        </FooterContainer>
    );
};
