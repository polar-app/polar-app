import * as React from "react";

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
                 maxHeight: '100vh',
                 padding: '6vh 3vw',
                 borderRadius: '15px',
                 ...props.style
             }}>
            {props.children}
        </div>
    );

}

export const ColorBackground0 = (props: IProps) => {

    return (
        <ColorBackground
             className={props.className}
             style={{
                 background: "url('data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+DQoNCjxzdmcgdmVyc2lvbj0iMS4xIg0KICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciDQogICAgIHZpZXdCb3g9IjAgMCAzMDAwIDMwMDAiDQogICAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIg0KICAgICBjbGFzcz0iZmxleC1zaHJpbmstMCINCiAgICAgc3R5bGU9Im1pbi13aWR0aDoxMDAlO21pbi1oZWlnaHQ6MTAwJTtmaWx0ZXI6c2F0dXJhdGUoMTUwJSk7LXdlYmtpdC1maWx0ZXI6c2F0dXJhdGUoMTUwJSkiPg0KICAgIDxkZWZzPjxzdHlsZT4NCiAgICAgICAgI2JnIHtmaWxsOiM1MTM1RkZ9DQogICAgICAgIC5yZWN0MCB7ZmlsbDp1cmwoI3JnMCl9LnJlY3QxIHtmaWxsOnVybCgjcmcxKX0ucmVjdDIge2ZpbGw6dXJsKCNyZzIpfS5yZWN0MyB7ZmlsbDp1cmwoI3JnMyl9DQogICAgPC9zdHlsZT4NCiAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPSJyZzAiIGZ4PSIwLjM0MDU3NDU4MTczNTM1NjEiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMCIgZng9IjAuMzkzNDQxMzA0ODQyOTI4OCIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcwIiBmeD0iMC4zMDEwNzk3MzI2NTI2OTExNyIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcxIiBmeD0iMC4zNzk0OTg4NzY5MzE0MzMxIiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzEiIGZ4PSIwLjM4NTUxNTIxMzkyODg5NDY1IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzEiIGZ4PSIwLjM4NDAxMDg2MDYyNjMwMjYiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4IiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMiIgZng9IjAuMzE3NjMxNTU2MTMzMTgyNyIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcyIiBmeD0iMC4zMDY2NzI0NjQ4MzA0NDM3IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzIiIGZ4PSIwLjMyMzI4NDY3NDA0ODA2NzgiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMyIgZng9IjAuMzY2NDE0MTU5NTYxNTA4OSIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmczIiBmeD0iMC4zOTI2NDg3MDI3MDU4MDk1IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzMiIGZ4PSIwLjM5NDIyNjE3ODA2NDczOTQiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48L2RlZnM+DQogICAgPHJlY3QgaWQ9ImJnIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC44Mjg4NjQxODMyODMxOTU3IDAuNjcxMDQyMjE5ODM1NzM1MSkgc2tld1goMjguNjU4Nzg0OTQzOTcwNzE2KSByb3RhdGUoMjAuOTMwOTYyMjk1NzgyMjg3KSB0cmFuc2xhdGUoNzQxLjM5NTkxOTYwMTkwNzggLTcxMy40ODE4OTk4MTY2MzA1KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xMDI0MTk1MTU2NTg2Mzc4IDAuOTM2NDY4ODk0Mzg5MTA2NSkgc2tld1goLTIuODAyMTUyMzc2NjQ3MjcxKSByb3RhdGUoMTM3LjQ2NzI3NDgwNTU5ODEyKSB0cmFuc2xhdGUoNzUwLjQ0MDUzNjA3NzAxNzcgMTMwOC40ODIwNDIwMTUyMDEpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjIyMDE0NjI4MzMzMzk0MjMgMS4wNjE0MzgzMzMwMjg2MjA4KSBza2V3WCgzMC41MzI2Mjg5NzQ5NzE1ODcpIHJvdGF0ZSg5Ni44NTgwMjUzOTY4MTk4NSkgdHJhbnNsYXRlKDI4OC43MTkxMzY0MDA0Mjk1IC03NTkuMDUyMzA4MTExNjQ5NSkgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QxIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDEuMTUyNTYzMzk4NTc5MTk3IDAuOTQ3NDEzNzc2MDc3Njc3Mykgc2tld1goMjYuNzg5OTk0Nzc4MjU1MTY0KSByb3RhdGUoMTg0LjAwMjkxNzk2MjkwMjI1KSB0cmFuc2xhdGUoNzQ1LjU1OTA0NjE4NjMzNzEgMTUuNTQ5NDc4MjY1NDg5MzU5KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wODQxNjUxMzI4MzEyOTM2IDAuODQ0NjA5MDYwNDg3MDc2Nikgc2tld1goLTcuNTgzODY1OTc1MDg1NjE1KSByb3RhdGUoMjc4LjIxMDk3Nzg2MDc5NjUpIHRyYW5zbGF0ZSg4MDguNjU4ODUyOTQ1MDc3OSA5MjIuMjI4NTM4MzI2MjAwMikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuNzc3ODA3MDc4Mzc4MTM0OCAwLjkyMzk4NTkzNjMzNzM3NjYpIHNrZXdYKDM1LjY2OTY5NDM5NTY3NDUyNikgcm90YXRlKDIwNy44MTA0NjkzNDI1NTQzNykgdHJhbnNsYXRlKC0yMTIuMzg5NDcxODE1MjY3MjMgNTA0Ljk2MDI0NzQyMTM2OTgpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MCIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjIxODIyMjA0NDAwNTUyNzEgMS4yMzQyNTMzMTQxNzY1MTMpIHNrZXdYKC0xOS40OTI2OTA1MDkxNjM0MjcpIHJvdGF0ZSgxNzIuNTI1Mjc2NTExNTkwODUpIHRyYW5zbGF0ZSgxMDU5Ljg0MjI5OTExMjE3NTQgLTY4My45MTI1MzE3NzU2ODk0KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC45OTQyOTk5MzU0NjAxODYyIDAuODcyMzM5ODYxMjY4NTIyNikgc2tld1goLTIxLjI3NjY3Mjk3MDk1NjkxNikgcm90YXRlKDI4Ny45Nzc3ODE5NjA0MDA3NikgdHJhbnNsYXRlKDgxLjQ5MDQ4ODUzMjA4NjQgLTU0Ni45OTgzODAzOTAwNjU2KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC45NzY5ODY0MzgyMTUzNjMgMS4yMjQ0MjIyNTA4MjQxNTU4KSBza2V3WCg0MC4wNDcwNTE4MjIwNTI4MzYpIHJvdGF0ZSgzMzkuODcyMDM1MTAyOTk0MDYpIHRyYW5zbGF0ZSgtNDQzLjYwNTQ4NDgzNDYzNTYgMzc5LjkwMjkyOTYwMTQyMTkzKSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xMTEwMTMyMjkxODI4NjM0IDEuMDU5NTc4NDcxODA2MjkzMykgc2tld1goLTguNjc1NjYxMTE3Mzk2NzY0KSByb3RhdGUoNC4wMDczMDMwMzU2MDk0Mzc1KSB0cmFuc2xhdGUoNTIwLjg4ODkyODQ3NjAwNCA0NTcuNzg1NDMwODAzNjIxODYpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjk5MzQyMDg1OTk1MTIwMTMgMC43MjIzMzc3NjMzNDg3MDI5KSBza2V3WCgzMS4zNjU1NzM2ODgxODM5NDMpIHJvdGF0ZSgyMDAuNTcyOTEzMDQyODExMikgdHJhbnNsYXRlKC02NjIuMTg4MDIxNTI2MjY2NCAtMTM4NC4wODY4OTcyMzc0MTQ5KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC43MzgwMDUxNjYwNTIyNDczIDEuMTc0NzY2MTk5OTU3Nzk2NSkgc2tld1goLTE1LjUxMDY5MDUwMTM3NjgyOCkgcm90YXRlKDExOS4yMTYwODQyMTEyNjA3OSkgdHJhbnNsYXRlKC0xMjYuMDIwNjQ1OTE3MDQ1NDMgLTMwMS42OTc4MDEwNTYyMDQzNikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0Pg0KPC9zdmc+')",
                 backgroundRepeat: 'no-repeat',
                 backgroundSize: 'cover',
                 ...props.style
             }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground1 = (props: IProps) => {

    return (
        <ColorBackground
            className={props.className}
            style={{
                background: "url('data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+DQoNCg0KDQo8c3ZnICAgICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgICAgICAgIHZpZXdCb3g9IjAgMCAzMDAwIDMwMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIiBjbGFzcz0iZmxleC1zaHJpbmstMCIgc3R5bGU9Im1pbi13aWR0aDoxMDAlO21pbi1oZWlnaHQ6MTAwJTtmaWx0ZXI6c2F0dXJhdGUoMTUwJSk7LXdlYmtpdC1maWx0ZXI6c2F0dXJhdGUoMTUwJSkiPg0KICAgIDxkZWZzPjxzdHlsZT4NCiAgICAgICAgI2JnIHtmaWxsOiM1MTM1RkZ9DQogICAgICAgIC5yZWN0MCB7ZmlsbDp1cmwoI3JnMCl9LnJlY3QxIHtmaWxsOnVybCgjcmcxKX0ucmVjdDIge2ZpbGw6dXJsKCNyZzIpfS5yZWN0MyB7ZmlsbDp1cmwoI3JnMyl9DQogICAgPC9zdHlsZT4NCiAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPSJyZzAiIGZ4PSIwLjMyNzk1NTEzMjQzOTU1NDUiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMCIgZng9IjAuMzQ1MDQyOTQzNDc1NjkyMiIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcwIiBmeD0iMC4zNDIyNjkxMTQ4MjAxMjIzIiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzEiIGZ4PSIwLjM0NjY2Mzc1NDA2MzcxMzg2IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzEiIGZ4PSIwLjM0Mjk5NjMwNDczMDEzOTMiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4IiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMSIgZng9IjAuMzQyMzkxNTA4MzQ2NTk4ODciIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4IiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMiIgZng9IjAuMzA2NTc4MTYwMTgyMjMwNDQiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMiIgZng9IjAuMzgwNzcxMDAxNTQ4NTE2NzMiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMiIgZng9IjAuMzU5OTg1MDgwNzE2MjAwNiIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmczIiBmeD0iMC4zODg0OTc1Mjc5NTcyODIxIiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzMiIGZ4PSIwLjM4NzM0NjA0ODg2NzI3Mjc1IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzMiIGZ4PSIwLjMwNTEwMzkwMDI4NDczMjUiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48L2RlZnM+DQogICAgPHJlY3QgaWQ9ImJnIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wOTAxODYyMjEyNTQ5NDAyIDAuNzIwNDU0MDA2ODA3OTM5OCkgc2tld1goNDQuMTQ4OTQ0MzAzNjE3Nikgcm90YXRlKDE0OC4wNzk2NTg5MzEwNTY3NCkgdHJhbnNsYXRlKC05Ni4yMDY5NzU3OTg3NDM3MSAtMTkwLjE3NDUzNTE2MjEzMjY4KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC45MzUzODc3ODkwMTEyNDQ0IDEuMDQ0NTEzNzQ0OTIyNjc5OCkgc2tld1goMzIuMDMwMjg1MTk5ODcwMjUpIHJvdGF0ZSg1NC44ODkyMzcxODkxNTA1MikgdHJhbnNsYXRlKDk4Ni43MTM2ODg4MTk2OTUzIC03Ni4xNzQyODY5MjA0MjMwNikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QxIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuNjc3NjYwNjgzNDU0NTIzOSAwLjc4NTgwMTMyNzI0MzEwNzgpIHNrZXdYKC0xNC42NjEwMjc4NDg1MTM5KSByb3RhdGUoNS44NDYzMzgyMDc1MTcxMjEpIHRyYW5zbGF0ZSgxNDU4Ljg1NDMzMzE3NzIwMTYgODE1LjEwNTU2NTIwNTY1NTgpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MyIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjk0NzIyOTM4NDA2NjcxNDYgMS4wMzI4MzIwOTM3NzUxMTA4KSBza2V3WCgyMy4xMDYzMDc2NjY0NzIxNDgpIHJvdGF0ZSgyNjguNzU3NTAwNzkzODYyODUpIHRyYW5zbGF0ZSg5MDkuMDk3MTA1Nzg5MTE0NSAtODQzLjI4MzExMjUyNzY2NTEpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MyIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjI0Nzg5NzIxMzA3NDExMDYgMS4xMDgxODkzMjc1NzU1MDcpIHNrZXdYKDQuNDA4ODkxMzgyMDU0MzI4KSByb3RhdGUoMjA2LjAyMzgzMzAyNTU3MzMpIHRyYW5zbGF0ZSgxMDcwLjMwMzAzMjc0ODUzMDggMjAwLjMyMTcwODY0NDc3NDA1KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wODE2NTQzNzczNjA3MjU3IDEuMDE0NTA2MjM4NjI1OTMxMSkgc2tld1goLTIuODk5ODkxMDU2NTE2ODc4NSkgcm90YXRlKDEwMy43MjYwNjQ1Mzg2NDY1KSB0cmFuc2xhdGUoMjg5Ljk5NzY0OTc0NzYgLTY3OS41OTQ0OTU1MTkyODA4KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC44ODU3Mjc0Mjc3Mzk4Nzg0IDAuOTgwNjA2MzE5MjI5NDY0NSkgc2tld1goMjcuNzE0MTMxNzM2Mjk0MjkpIHJvdGF0ZSgyNTkuMjM0NzQxODQ1NzU5NikgdHJhbnNsYXRlKC0xNDc0LjA0MTQxMzI5MjU2MDUgLTM1NS4wNzE2ODg0Mjk3NjQ2NikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QyIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuOTU4MTM3MzE0NTUzMjIzIDAuNjkxOTY2NzUwMTQ0Mzc4Nykgc2tld1goLTQzLjk4NTIxMjU1MzIxNDgzNikgcm90YXRlKDE3NC4xMDExOTUzMTcyMzAyNikgdHJhbnNsYXRlKC01OS4zNzQ0ODU3MjUzMjkxMSAtMjEuNTU2NDIyNzIzMzg2NDI2KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wNTUwMTk2ODY5NjM0MDg4IDEuMTE4NzI4NjAzMzM3MjA0Nikgc2tld1goLTI0LjE5ODAzMzU1ODQ3NDIzMykgcm90YXRlKDE1Ni41OTUxMjU1MDYwOTA2MikgdHJhbnNsYXRlKDEzNjkuODA3MzkzMjkyMjM4NCAxMzAzLjc4NDE3NjEwOTAzNDcpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjgyMzU2MzIwMTM4MzYwNzggMC43MzQxMTI2NTQ0NjU3NTc4KSBza2V3WCgxNy40NTYwMDAzMzE0NjAxMSkgcm90YXRlKDY5LjgyMDYxOTU5MDE3ODIxKSB0cmFuc2xhdGUoLTEyOTMuMDg4MjQyNDk1ODI4IDc3NC41OTU2ODgwNTQzODUpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MCIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjY3MjU2NzgyOTM5NDgxOTggMC44MzgzMTMyMjY2NDU5NDczKSBza2V3WCgtMTMuODU4Mjk3MzQ4NDY5NzA1KSByb3RhdGUoMjk2LjYyMDE0MTk4OTk4NTgpIHRyYW5zbGF0ZSgtMTAxMy4yOTMxMzgwNzk2Njc0IC0xMDE4LjE1NTcwOTk5MTIwMTcpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjg5NzQ4OTgxMDA3NTgzNjMgMS4xNjAxNDkyMjIxNjUxOTYpIHNrZXdYKDQxLjA3MjA2MDQwNDE5NTA2KSByb3RhdGUoMzQwLjIzMDEzNzY1ODQzMTgpIHRyYW5zbGF0ZSgtMTIyLjE1NDgwNjE0MDE3NDM3IDExMTYuNDYyNDUzODU5NjEzNikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0Pg0KPC9zdmc+')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}

export const ColorBackground2 = (props: IProps) => {

    return (
        <ColorBackground
            className={props.className}
            style={{
                background: "url('data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+DQoNCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzAwMCAzMDAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBzbGljZSIgY2xhc3M9ImZsZXgtc2hyaW5rLTAiIHN0eWxlPSJtaW4td2lkdGg6MTAwJTttaW4taGVpZ2h0OjEwMCU7ZmlsdGVyOnNhdHVyYXRlKDE1MCUpOy13ZWJraXQtZmlsdGVyOnNhdHVyYXRlKDE1MCUpIj4NCiAgICA8ZGVmcz48c3R5bGU+DQogICAgICAgICNiZyB7ZmlsbDojNTEzNUZGfQ0KICAgICAgICAucmVjdDAge2ZpbGw6dXJsKCNyZzApfS5yZWN0MSB7ZmlsbDp1cmwoI3JnMSl9LnJlY3QyIHtmaWxsOnVybCgjcmcyKX0ucmVjdDMge2ZpbGw6dXJsKCNyZzMpfQ0KICAgIDwvc3R5bGU+DQogICAgICAgIDxyYWRpYWxHcmFkaWVudCBpZD0icmcwIiBmeD0iMC4zMDYxOTI1NTAwNDMxMjU1NyIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcwIiBmeD0iMC4zNTU0MTk4NTkyMTg5Mjg5IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzAiIGZ4PSIwLjMyOTkyNDQwMjMyMTY4MDYiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMSIgZng9IjAuMzEzNDAxMjIwODgwNDU4ODUiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4IiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMSIgZng9IjAuMzcwMDAwOTU2ODU0NzUxOCIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4Ij48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcxIiBmeD0iMC4zNjQ3NjcwMDU1MTI5NjU1NCIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4Ij48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcyIiBmeD0iMC4zNTUxMjk5MTY3NzM4MDYzNCIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcyIiBmeD0iMC4zMzI1Mzg2MTA0OTMyMTUiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMiIgZng9IjAuMzgyNzIzMjAwOTU3MTg4IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzMiIGZ4PSIwLjM0MTQyNDIyNTc2MDE0NTMiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMyIgZng9IjAuMzk0NDg3MDc0Mzk4NDA4MSIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmczIiBmeD0iMC4zODAzMzcyNjYxNzAxOTQzNyIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjwvZGVmcz4NCiAgICA8cmVjdCBpZD0iYmciIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjkzNDkwMzMwMzIxMDY1NjcgMS4wNjIwNzAwODAxNjc1Njk4KSBza2V3WCgxOC45NzI3NjI1NjYyNjE2MjIpIHJvdGF0ZSgxNzAuMTM1MDM0MzgwNDk0MjYpIHRyYW5zbGF0ZSgtNTgxLjMxNzc2MDAwMDgwOTIgMTI2MC4yNjAzODY3OTA5OTEzKSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC44MDM2MTc4ODAwOTM4NzkxIDAuNjgzOTMxNzY3NjQ1OTEyMikgc2tld1goLTE4LjQxMjIwMzczMTI5NzQxKSByb3RhdGUoMjgzLjA2MTQzNDY3OTAxMzY0KSB0cmFuc2xhdGUoLTEwODIuNDI0MjI5NDcxMTcyOCAzMzcuOTU5Njc3NzU0MTg4MTQpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjA2MDYyMDc3NjY4MDkzNDQgMC44NTI3NzEyNTMxMzcwODU5KSBza2V3WCgtMjQuNTgxNzY1ODk2NDgzMzQpIHJvdGF0ZSg2My41MjA4NDk0MzkzNTMyNCkgdHJhbnNsYXRlKC0xNDk4Ljg3NjMzNTI4MDMxNDQgMjcwLjQ2MzAwMzgwMDUwMjkpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjg3MTYxNzIyMDk0MDA2OTUgMC43MTk1NTE4MjY0NjcxMTkyKSBza2V3WCgzMi45MzczMTU1NzY0ODAzMykgcm90YXRlKDIzMy4yMTQ0NjYyNzQ0MDQ3NykgdHJhbnNsYXRlKDg0My4wMjczMzY2MDk3ODEgOTIwLjk1NTcxOTUxNDA5OTUpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MCIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjgyNDk1MDQ0ODc3MDQ1MjggMC42ODYyOTE3MTM2OTExNzQ3KSBza2V3WCgzNy40MDE4NTQwNjU3NDgyOCkgcm90YXRlKDIxMS4xMzYzNjMzNzU4NzUzNikgdHJhbnNsYXRlKDgzMC4xOTk4MDA1OTkwMzMxIDYwNS4wNzcwMzQzMDMwODI0KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xMDIzMTA4OTE0ODkxNzUzIDEuMTQwNjMwMTYyODU4MjQxMSkgc2tld1goLTE1LjQ5NTcxMTcyMjQ4MTEyMikgcm90YXRlKDEuNzQ3ODQxOTc5MzE1MTYzNCkgdHJhbnNsYXRlKDcwNy43OTM3OTcwNzcyMzQyIC01MzAuMDg4NjU4MDkzNjk5NSkgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QzIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuODM3MDM1Mzc1NjgwNjI1OSAxLjExNTc0MzA2ODYwMDczNSkgc2tld1goLTMxLjY5OTUwNDY2OTY4MTkxOCkgcm90YXRlKDIwOS44NzQzODQyMzMyOTMxNCkgdHJhbnNsYXRlKC03MjguMjIwODkxNjM3OTcyIC03NzAuNDE4MTYwMjE5MDc4MikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QyIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDEuMjA2OTkxODg3NDMwODMyIDAuODM0MTEzMzU0NzI0NTUzOCkgc2tld1goLTQuNzg3MTg0MDk2MzA5MDA1KSByb3RhdGUoMjEuNjk4NTkxMTk1NjU5NDEpIHRyYW5zbGF0ZSg0NDYuNDYwOTA5NDYyNTMzOCA0NDYuNzE1MDQwOTEyOTY1MikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QxIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuODMzOTA1MjkyMDM1OTUxMyAxLjIyMTA4NTQ2ODM4NzAzNDIpIHNrZXdYKC0yOS43MzY3NDI5NDM4MDUzOCkgcm90YXRlKDM0Ni4yMTA2ODUyNTI4MzA4NCkgdHJhbnNsYXRlKC01NzcuNTkxMzAyNzIwODI1NSAtODE4LjIwNDIxMTg1MzE1MjEpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MCIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjE3NjIwNDA1OTYyNzE1NiAxLjIyNTQ4NjUwNTgzODA3ODYpIHNrZXdYKDI2LjU3MjgwMTQzMTM0NzUzKSByb3RhdGUoMjA2LjY4NjAxMTU3MjQxOTI2KSB0cmFuc2xhdGUoMTIzOS45NTk2NTM0NTg5NzA1IC0xMjE4Ljg1OTM0ODI2MDQwMTUpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MCIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjc2Mjk0OTk3NzAyNjMyNDUgMC44ODc0NzYyNDYwOTYzMzM3KSBza2V3WCgyMC41NTQ5ODM2OTk4Njk4MSkgcm90YXRlKDU1LjQ3MTYwMDM5MjcyOTM4NSkgdHJhbnNsYXRlKDg2LjIyMDc5MzU4MzY5OTcyIDE0MTkuMDc2NDA0MjczMDkwMikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QzIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuOTg3NjU4MTQ1NzQ5ODMwNCAwLjgwNzA0NTM4NDA0NzkxNSkgc2tld1goLTEwLjMzMTI0NTk4Nzc5MzQ1MSkgcm90YXRlKDEwLjIwOTMyNzU4ODY0Mzg2NikgdHJhbnNsYXRlKC00MDkuMDYwMDMyMjQ5OTg5IDY2Ny42MjExNTMwNzkwNjc0KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+DQo8L3N2Zz4=')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}


export const ColorBackground3 = (props: IProps) => {

    return (
        <ColorBackground
            className={props.className}
            style={{
                background: "url('data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+DQoNCg0KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAwIDMwMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIiBjbGFzcz0iZmxleC1zaHJpbmstMCIgc3R5bGU9Im1pbi13aWR0aDoxMDAlO21pbi1oZWlnaHQ6MTAwJTtmaWx0ZXI6c2F0dXJhdGUoMTUwJSk7LXdlYmtpdC1maWx0ZXI6c2F0dXJhdGUoMTUwJSkiPg0KICAgIDxkZWZzPjxzdHlsZT4NCiAgICAgICAgI2JnIHtmaWxsOiM1MTM1RkZ9DQogICAgICAgIC5yZWN0MCB7ZmlsbDp1cmwoI3JnMCl9LnJlY3QxIHtmaWxsOnVybCgjcmcxKX0ucmVjdDIge2ZpbGw6dXJsKCNyZzIpfS5yZWN0MyB7ZmlsbDp1cmwoI3JnMyl9DQogICAgPC9zdHlsZT4NCiAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPSJyZzAiIGZ4PSIwLjM3NTE3NjA0NzQ3NzI3MTYiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMCIgZng9IjAuMzMyNzI5MjQ1NzQ1MjkxMDYiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMCIgZng9IjAuMzQ1NDY5NTgwOTU2ODEzMzUiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMSIgZng9IjAuMzczMzMwOTIyMjQyNDc3NTUiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4IiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMSIgZng9IjAuMzY4Nzc3NjI2NzQzODgwNSIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4Ij48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcxIiBmeD0iMC4zMDgxMzI0MjM0MzYwMzA5IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzIiIGZ4PSIwLjMwMTcxMjQ2MDg0NTMxMDEiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMiIgZng9IjAuMzkzMjA5MTk1MDUyMzQzNSIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcyIiBmeD0iMC4zNjA3NDA2NTQ5ODU2Njk5IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzMiIGZ4PSIwLjM2MDIzMTUxNzk5MTk5OTgiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMyIgZng9IjAuMzg1NjQxNzg3Njg3NDk0MzUiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMyIgZng9IjAuMzM2MzM5MDU3Nzk3MjM0NTUiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48L2RlZnM+DQogICAgPHJlY3QgaWQ9ImJnIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wODAxMDgxMDQ2MzcyODIgMS4wODcxOTUzNzI3NzMzNzEyKSBza2V3WCgtNi42MjEyMTk5NzI0MzExOTkpIHJvdGF0ZSgyMjMuNzY0NTcxODAxNDA2NzYpIHRyYW5zbGF0ZSg0LjY5NDgxMjU3MzU1Njc1IC0xMzUwLjcwODI5MjEwNjU4MTQpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjcwMjU5NzgwMjY5Njg2OSAxLjAzNzEzMTM3MTA1MTQ2Nikgc2tld1goLTMzLjMyMjk3MzE0NDM5NTEpIHJvdGF0ZSgyMTkuMTIwNDM0Mzg1MDkwOTYpIHRyYW5zbGF0ZSgtNTA3LjE0NTI5MzgyMDAzMjA3IDg3Ni45MDQ1MzcyMzYwMzA5KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC45OTAyNzMwOTAyODU4OTQyIDAuODkxNjQ2NTA2NTI3NTQ1MSkgc2tld1goLTMwLjkyNDgwMjU3MTYzMTk4Nikgcm90YXRlKDE4OS4wOTg1NzQ5MzA5OTEyOCkgdHJhbnNsYXRlKC01NzEuODYzNTYxNDEyOTg4MiAtMjIwLjEyNzMwMzU2Nzc3ODQzKSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wODYyNjU0MDUwMTQyNDYgMS4wMjMxNjE0MzkzODU1MTI4KSBza2V3WCgyOS43NzI1MDU4MzM5MzAyMjUpIHJvdGF0ZSgxNjcuMTQ0MDgxMzAzNDg1NTYpIHRyYW5zbGF0ZSgtNDMxLjc5MjI3MjEyNDM4MTMgLTY0OS44ODk0NDkxMjU5MTk5KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xODE5MTE3MjU0OTkzMzUyIDEuMTYyMzgzMzE0NDIxMDE3KSBza2V3WCg0NC4wNjczOTU1OTE3MDIzMikgcm90YXRlKDMyNi4yNTI3OTk3OTY2NjE2KSB0cmFuc2xhdGUoLTEwMTYuMzA2NTY1NDUxNDcyNSAtNzM2LjQzMjc2OTcxOTM5MjIpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjg3NjIzMDExNTMxMTQ0NTEgMC45ODk3NjExNzk1OTI1NjI4KSBza2V3WCgtMTUuNDU1NzY4ODgxNzE4Mjg1KSByb3RhdGUoMTM0LjI0NDg0OTMxNDMyNjA3KSB0cmFuc2xhdGUoLTEyMjkuNDUzODIwNDE3MTQ0IC0zNTcuOTcxMTUwNzU4OTgyNDUpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MyIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjg5Nzg1MDE0MDY0MDI3OTIgMS4xMjQ4NzgyNDA5Mzg2ODg2KSBza2V3WCgtMTUuOTMzNTc2NjIwOTMyODA0KSByb3RhdGUoNi42MTEwNjE1NTA0MDA0NDEpIHRyYW5zbGF0ZSg3MzcuMzgyNDUzNzY1ODQ2MSA0MzYuODE3MzcxNTY1NTI0NikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QxIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuODMwMjM2ODI0MTI1NTc3MSAwLjc3MDI0Mjc3NjE3Mjc2OTMpIHNrZXdYKDI3LjA2MTgxNDc0NDA3MDc3Mykgcm90YXRlKDMyMi43NjU0MTIzMjk4MzE0KSB0cmFuc2xhdGUoLTEzOC4xMzM4MjYzMTg1MzI2NyAtMTQ3OC42ODE1NDU2NTE3Njc3KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xNDI3MDE3NTUyNDYzNjI1IDEuMjMyMTQ1MjY5ODgwNDgxMSkgc2tld1goMTUuMTk0OTY1ODM0MDQ2OTE4KSByb3RhdGUoMTUuMzg0NTI3NDg1NTQ5MzA0KSB0cmFuc2xhdGUoMjExLjg3MzQ5MzQyMzQxNTY1IC04NTMuMDQxNDA0NzQ3OTI2MikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QxIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDEuMTQ4NjY1MzQ2MTY4NzQzMyAwLjkxNjMyNjk5NDMyOTQ4OTcpIHNrZXdYKC03LjI2NDg2Njk0OTI3OTQ1MSkgcm90YXRlKDE4Mi45MDY0MDk5MTY0NzY5NSkgdHJhbnNsYXRlKDU1MS45ODU3NTMzODk4NDQ2IC01MDcuNjkyMjAyOTMxOTUyOCkgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QyIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuOTAwMTA0NzU1NjYyODgwNCAxLjA5Njg1ODExNDgxOTMwNzMpIHNrZXdYKC0zMi4yMDIzODEzMzI3NzE0NSkgcm90YXRlKDExMC41NzM0NTEyNzQ4MjY3MSkgdHJhbnNsYXRlKDU2LjcwNTAzMzY0MjI3ODc1IDk5MS4zMzYwNjgyMzE2NDY4KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wMjY4MjQ0MDQxNjYwOTIgMS4wNzcyODU3NzQwMTYzNTcpIHNrZXdYKDM2LjQyMzIzMDIzODk4MzU2NCkgcm90YXRlKDExMy42MTkxMTkyNzkxMjI2MykgdHJhbnNsYXRlKC0xNDE4LjQwMzQ4ODcyNzc1NTMgNDIyLjc4NDc5NTQzMjQ5NTcpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD4NCjwvc3ZnPg==')",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                ...props.style
            }}>
            {props.children}
        </ColorBackground>
    );

}





