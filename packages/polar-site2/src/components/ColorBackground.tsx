import * as React from "react";
import {ColorBackgrounds} from "./ColorBackgrounds";

interface IProps {
    readonly children: JSX.Element;
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

const ColorBackground = (props: IProps) => {

    return (
        <div className={props.className}
             style={{
                 width: '100%',
                 // maxHeight: '100vh',
                 padding: '6vh 3vw',
                 borderRadius: '15px',
                 ...props.style
             }}>
            {props.children}
        </div>
    );

}

//
// Web content in one click
//
// Your brain's capacity coupled w AI
//
// Remember forever what's important
//
// Sync your flashcards to Anki
//
// Motivation built in
//
// Light or dark - you choose




// Your knowledge and brain - organized

// This is reading on steroids
// 3729A7
// 359D96
// 772EA8
// 4A238F

export const ColorBackground0 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#6754d6',
        color1: '#EEC88E',
        color2: '#F3CF90',
        color3: '#D3605F',
    }), []);

    return (
        <ColorBackground
             className={props.className}
             style={{
                 background,
                 // background: "url('data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+DQoNCjxzdmcgdmVyc2lvbj0iMS4xIg0KICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciDQogICAgIHZpZXdCb3g9IjAgMCAzMDAwIDMwMDAiDQogICAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIg0KICAgICBjbGFzcz0iZmxleC1zaHJpbmstMCINCiAgICAgc3R5bGU9Im1pbi13aWR0aDoxMDAlO21pbi1oZWlnaHQ6MTAwJTtmaWx0ZXI6c2F0dXJhdGUoMTUwJSk7LXdlYmtpdC1maWx0ZXI6c2F0dXJhdGUoMTUwJSkiPg0KICAgIDxkZWZzPjxzdHlsZT4NCiAgICAgICAgI2JnIHtmaWxsOiM1MTM1RkZ9DQogICAgICAgIC5yZWN0MCB7ZmlsbDp1cmwoI3JnMCl9LnJlY3QxIHtmaWxsOnVybCgjcmcxKX0ucmVjdDIge2ZpbGw6dXJsKCNyZzIpfS5yZWN0MyB7ZmlsbDp1cmwoI3JnMyl9DQogICAgPC9zdHlsZT4NCiAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPSJyZzAiIGZ4PSIwLjM0MDU3NDU4MTczNTM1NjEiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMCIgZng9IjAuMzkzNDQxMzA0ODQyOTI4OCIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcwIiBmeD0iMC4zMDEwNzk3MzI2NTI2OTExNyIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcxIiBmeD0iMC4zNzk0OTg4NzY5MzE0MzMxIiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzEiIGZ4PSIwLjM4NTUxNTIxMzkyODg5NDY1IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzEiIGZ4PSIwLjM4NDAxMDg2MDYyNjMwMjYiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4IiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMiIgZng9IjAuMzE3NjMxNTU2MTMzMTgyNyIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcyIiBmeD0iMC4zMDY2NzI0NjQ4MzA0NDM3IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzIiIGZ4PSIwLjMyMzI4NDY3NDA0ODA2NzgiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMyIgZng9IjAuMzY2NDE0MTU5NTYxNTA4OSIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmczIiBmeD0iMC4zOTI2NDg3MDI3MDU4MDk1IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzMiIGZ4PSIwLjM5NDIyNjE3ODA2NDczOTQiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48L2RlZnM+DQogICAgPHJlY3QgaWQ9ImJnIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC44Mjg4NjQxODMyODMxOTU3IDAuNjcxMDQyMjE5ODM1NzM1MSkgc2tld1goMjguNjU4Nzg0OTQzOTcwNzE2KSByb3RhdGUoMjAuOTMwOTYyMjk1NzgyMjg3KSB0cmFuc2xhdGUoNzQxLjM5NTkxOTYwMTkwNzggLTcxMy40ODE4OTk4MTY2MzA1KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xMDI0MTk1MTU2NTg2Mzc4IDAuOTM2NDY4ODk0Mzg5MTA2NSkgc2tld1goLTIuODAyMTUyMzc2NjQ3MjcxKSByb3RhdGUoMTM3LjQ2NzI3NDgwNTU5ODEyKSB0cmFuc2xhdGUoNzUwLjQ0MDUzNjA3NzAxNzcgMTMwOC40ODIwNDIwMTUyMDEpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjIyMDE0NjI4MzMzMzk0MjMgMS4wNjE0MzgzMzMwMjg2MjA4KSBza2V3WCgzMC41MzI2Mjg5NzQ5NzE1ODcpIHJvdGF0ZSg5Ni44NTgwMjUzOTY4MTk4NSkgdHJhbnNsYXRlKDI4OC43MTkxMzY0MDA0Mjk1IC03NTkuMDUyMzA4MTExNjQ5NSkgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QxIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDEuMTUyNTYzMzk4NTc5MTk3IDAuOTQ3NDEzNzc2MDc3Njc3Mykgc2tld1goMjYuNzg5OTk0Nzc4MjU1MTY0KSByb3RhdGUoMTg0LjAwMjkxNzk2MjkwMjI1KSB0cmFuc2xhdGUoNzQ1LjU1OTA0NjE4NjMzNzEgMTUuNTQ5NDc4MjY1NDg5MzU5KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wODQxNjUxMzI4MzEyOTM2IDAuODQ0NjA5MDYwNDg3MDc2Nikgc2tld1goLTcuNTgzODY1OTc1MDg1NjE1KSByb3RhdGUoMjc4LjIxMDk3Nzg2MDc5NjUpIHRyYW5zbGF0ZSg4MDguNjU4ODUyOTQ1MDc3OSA5MjIuMjI4NTM4MzI2MjAwMikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuNzc3ODA3MDc4Mzc4MTM0OCAwLjkyMzk4NTkzNjMzNzM3NjYpIHNrZXdYKDM1LjY2OTY5NDM5NTY3NDUyNikgcm90YXRlKDIwNy44MTA0NjkzNDI1NTQzNykgdHJhbnNsYXRlKC0yMTIuMzg5NDcxODE1MjY3MjMgNTA0Ljk2MDI0NzQyMTM2OTgpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MCIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjIxODIyMjA0NDAwNTUyNzEgMS4yMzQyNTMzMTQxNzY1MTMpIHNrZXdYKC0xOS40OTI2OTA1MDkxNjM0MjcpIHJvdGF0ZSgxNzIuNTI1Mjc2NTExNTkwODUpIHRyYW5zbGF0ZSgxMDU5Ljg0MjI5OTExMjE3NTQgLTY4My45MTI1MzE3NzU2ODk0KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC45OTQyOTk5MzU0NjAxODYyIDAuODcyMzM5ODYxMjY4NTIyNikgc2tld1goLTIxLjI3NjY3Mjk3MDk1NjkxNikgcm90YXRlKDI4Ny45Nzc3ODE5NjA0MDA3NikgdHJhbnNsYXRlKDgxLjQ5MDQ4ODUzMjA4NjQgLTU0Ni45OTgzODAzOTAwNjU2KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC45NzY5ODY0MzgyMTUzNjMgMS4yMjQ0MjIyNTA4MjQxNTU4KSBza2V3WCg0MC4wNDcwNTE4MjIwNTI4MzYpIHJvdGF0ZSgzMzkuODcyMDM1MTAyOTk0MDYpIHRyYW5zbGF0ZSgtNDQzLjYwNTQ4NDgzNDYzNTYgMzc5LjkwMjkyOTYwMTQyMTkzKSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xMTEwMTMyMjkxODI4NjM0IDEuMDU5NTc4NDcxODA2MjkzMykgc2tld1goLTguNjc1NjYxMTE3Mzk2NzY0KSByb3RhdGUoNC4wMDczMDMwMzU2MDk0Mzc1KSB0cmFuc2xhdGUoNTIwLjg4ODkyODQ3NjAwNCA0NTcuNzg1NDMwODAzNjIxODYpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjk5MzQyMDg1OTk1MTIwMTMgMC43MjIzMzc3NjMzNDg3MDI5KSBza2V3WCgzMS4zNjU1NzM2ODgxODM5NDMpIHJvdGF0ZSgyMDAuNTcyOTEzMDQyODExMikgdHJhbnNsYXRlKC02NjIuMTg4MDIxNTI2MjY2NCAtMTM4NC4wODY4OTcyMzc0MTQ5KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC43MzgwMDUxNjYwNTIyNDczIDEuMTc0NzY2MTk5OTU3Nzk2NSkgc2tld1goLTE1LjUxMDY5MDUwMTM3NjgyOCkgcm90YXRlKDExOS4yMTYwODQyMTEyNjA3OSkgdHJhbnNsYXRlKC0xMjYuMDIwNjQ1OTE3MDQ1NDMgLTMwMS42OTc4MDEwNTYyMDQzNikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0Pg0KPC9zdmc+')",
                 backgroundRepeat: 'no-repeat',
                 backgroundSize: 'cover',
                 ...props.style
             }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground1 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#C17879',
        color1: '#D19A5A',
        color2: '#B15051',
        color3: '#5D8596',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground2 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#3729A7',
        color1: '#359D96',
        color3: '#772EA8',
        color2: '#4A238F',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground3 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#1BAC8F',
        color1: '#F89C8D',
        color3: '#388090',
        color2: '#8CA48E',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}


export const ColorBackground4 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#3C9891',
        color1: '#3139AE',
        color3: '#A93A2E',
        color2: '#552B68',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}


export const ColorBackground5 = (props: IProps) => {


    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#C29D38',
        color1: '#3AB991',
        color3: '#B14242',
        color2: '#A66A49',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground6 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#6754d6',
        color1: '#EEC88E',
        color3: '#D3605F',
        color2: '#F3CF90',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground7 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#C17879',
        color1: '#D19A5A',
        color3: '#5D8596',
        color2: '#B15051',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground8 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#6754d6',
        color1: '#EEC88E',
        color3: '#D3605F',
        color2: '#F3CF90',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground9 = (props: IProps) => {

    const background = React.useMemo(() => ColorBackgrounds.createBackground({
        color0: '#C17879',
        color1: '#D19A5A',
        color3: '#5D8596',
        color2: '#B15051',
    }), []);

    return (
        <ColorBackground
            className={props.className}
            style={{
                background,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}
