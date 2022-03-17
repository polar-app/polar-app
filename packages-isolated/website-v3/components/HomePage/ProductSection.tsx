import React from "react";
import {css} from '@emotion/react';
import {Navbar} from 'components/Navbar';
import styled from '@emotion/styled';
import {flex} from 'styles/flex';
import {Typography} from 'styled/Typography';
import {mt} from 'styles/margin';
import {Link} from 'styled/Link';
import {px} from "styles/padding";
import {Breakpoints} from "styles/media-query";


const Container = styled('div')`
    ${flex({ dir: 'column', align: 'center', justify: 'space-between' })}
    background: url(/assets/bg.jpg);
    min-height: 100vh;
    background-size: cover;
`;

const Section = styled('section')`
    ${flex({ dir: 'column', align: 'center' })}
    text-align: center;
    ${({ theme }) => px(1)(theme)}
`;

export const ProductSection: React.FC = () => (
    <Container>
        <Navbar />
        <Section>
            <Typography.h2>
                Read. Take notes. Remember
            </Typography.h2>
            <Typography.h5 css={theme => css`
                    ${mt(3)(theme)}
                    color: ${theme.palette.text.normal.secondary};
                    line-height: 200%;
                    max-width: 700px;
                `}>
                It’s a reader - yes. It’s a non-linear note-taking tool - yes. It’s a flashcard tool - yes. All integrated into one simple cloud tool to learn more efficiently
            </Typography.h5>
            <div css={mt(4)}>
                <Link href="https://app.getpolarized.io/create-account">Get Early Access</Link>
            </div>
            <div css={theme => css`
                    ${mt(4)(theme)}
                    ${px(3)(theme)}
                `}>
                <picture>
                    <source srcSet="/assets/mac.png" media={`(min-width: ${Breakpoints.lg}px)`} />
                    <img srcSet="/assets/phone.png" 
                         css={css`max-width: 100%`}
                         alt="Shopify Merchant, Corrine Anestopoulos" />
                </picture>
            </div>
            
        </Section>
    </Container>
);
