import styled from "@emotion/styled";
import {css} from "@emotion/react";
import type {CustomTheme} from "util/theme";

export type Variant = 'outlined' | 'contained' | 'link' | 'text';

interface IProps {
    readonly variant?: Variant;
}

const VARIANT_STYLES: Record<Variant, (theme: CustomTheme) => ReturnType<typeof css>> = {
    link: theme => css`
        color: ${theme.palette.text.normal.primary};
        border: 0;
        position: relative;
        padding-left: 0;
        padding-right: 0;
        &:after {
            content: "";
            position: absolute;
            width: 100%;
            height: 5px;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 3px;
            background: ${theme.palette.accent(90)};
        }

        &:hover, &:active, &:focus {
            color: ${theme.palette.buttons.link};
        }
    `,
    text: theme => css`
        color: ${theme.palette.text.normal.primary};
        border: 0;
        padding-left: 0;
        padding-right: 0;

        &:hover, &:active, &:focus {
            color: ${theme.palette.buttons.link};
        }
    `,
    contained: theme => css`
        background: ${theme.palette.primary};
        color: ${theme.palette.text.reversed.primary};
        border: none;

        &:hover, &:active, &:focus {
            background: ${theme.palette.buttons.hover};
            color: ${theme.palette.text.normal.primary};
        }

        &:disabled {
            background: ${theme.palette.buttons.disabled};
            color: ${theme.palette.text.normal.primary};
        }
    `,
    outlined: theme => css`
        color: ${theme.palette.text.normal.primary};
        border-image-source: ${theme.palette.accent(-90)};
        border-image-slice: 1;
        border-image-width: 3px;
    `,
};

export const Button = styled.button<IProps>`
    background: transparent;
    cursor: pointer;
    padding: ${({ theme }) => `${theme.spacing(1.75)}px ${theme.spacing(4)}px`};
    min-width: 230px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 5px;
    transition: all 150ms ease-in-out;
    ${({ variant, theme }) => VARIANT_STYLES[variant || 'contained'](theme)}
`;
