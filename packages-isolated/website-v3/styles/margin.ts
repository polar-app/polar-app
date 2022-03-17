import {css} from "@emotion/react";
import type {CustomTheme} from "../util/theme";

export const mx = (v: number) => (theme: CustomTheme) => css`
    margin-left: ${theme.spacing(v)}px;
    margin-right: ${theme.spacing(v)}px;
`;

export const my = (v: number) => (theme: CustomTheme) => css`
    margin-top: ${theme.spacing(v)}px;
    margin-bottom: ${theme.spacing(v)}px;
`;

export const mt = (v: number) => (theme: CustomTheme) => css`
    margin-top: ${theme.spacing(v)}px;
`;

export const ml = (v: number) => (theme: CustomTheme) => css`
    margin-left: ${theme.spacing(v)}px;
`;

export const mr = (v: number) => (theme: CustomTheme) => css`
    margin-right: ${theme.spacing(v)}px;
`;

export const mb = (v: number) => (theme: CustomTheme) => css`
    margin-bottom: ${theme.spacing(v)}px;
`;
