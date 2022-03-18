import {css} from "@emotion/react";
import type {CustomTheme} from "../util/theme";

export const px = (v: number) => (theme: CustomTheme) => css`
    padding-left: ${theme.spacing(v)}px;
    padding-right: ${theme.spacing(v)}px;
`;

export const py = (v: number) => (theme: CustomTheme) => css`
    padding-top: ${theme.spacing(v)}px;
    padding-bottom: ${theme.spacing(v)}px;
`;

export const pt = (v: number) => (theme: CustomTheme) => css`
    padding-top: ${theme.spacing(v)}px;
`;

export const pl = (v: number) => (theme: CustomTheme) => css`
    padding-left: ${theme.spacing(v)}px;
`;

export const pr = (v: number) => (theme: CustomTheme) => css`
    padding-right: ${theme.spacing(v)}px;
`;

export const pb = (v: number) => (theme: CustomTheme) => css`
    padding-bottom: ${theme.spacing(v)}px;
`;
