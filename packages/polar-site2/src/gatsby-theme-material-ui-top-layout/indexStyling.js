import { makeStyles } from "@material-ui/core";

const IndexStyling = makeStyles({

  sectionOdd: {
  },

  sectionEven: {
  },

  newHeroSection: {
  },

  centerSection: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    // backgroundColor: 'rgb(78, 78, 78)',
    paddingTop: '10px',
    paddingBottom: '25px',

    "& h1": {
      fontWeight: '400',
      fontSize: '45px'
    },
    "& h2": {
      fontSize: '25px',
      lineHeight: '1.3em'
    },
    "& h3": {
      fontSize: '22px'
    },
    "& > *": {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '1280px'
    }

  },

  centerImage: {
    borderRadius: '10px',
    maxWidth: 'min(1100px, 100vw)',
    maxHeight: '100vh',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    "-webkit-box-shadow": '0px 0px 10px 5px rgb(50,50,50)',
    "-moz-box-shadow": '0px 0px 10px 5px rgb(50,50,50)',
    boxShadow: "0px 0px 10px 5px rgb(50,50,50)",

    background: "url('data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+DQoNCjxzdmcgdmVyc2lvbj0iMS4xIg0KICAgICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciDQogICAgIHZpZXdCb3g9IjAgMCAzMDAwIDMwMDAiDQogICAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIHNsaWNlIg0KICAgICBjbGFzcz0iZmxleC1zaHJpbmstMCINCiAgICAgc3R5bGU9Im1pbi13aWR0aDoxMDAlO21pbi1oZWlnaHQ6MTAwJTtmaWx0ZXI6c2F0dXJhdGUoMTUwJSk7LXdlYmtpdC1maWx0ZXI6c2F0dXJhdGUoMTUwJSkiPg0KICAgIDxkZWZzPjxzdHlsZT4NCiAgICAgICAgI2JnIHtmaWxsOiM1MTM1RkZ9DQogICAgICAgIC5yZWN0MCB7ZmlsbDp1cmwoI3JnMCl9LnJlY3QxIHtmaWxsOnVybCgjcmcxKX0ucmVjdDIge2ZpbGw6dXJsKCNyZzIpfS5yZWN0MyB7ZmlsbDp1cmwoI3JnMyl9DQogICAgPC9zdHlsZT4NCiAgICAgICAgPHJhZGlhbEdyYWRpZW50IGlkPSJyZzAiIGZ4PSIwLjM0MDU3NDU4MTczNTM1NjEiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzUxMzVGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMCIgZng9IjAuMzkzNDQxMzA0ODQyOTI4OCIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcwIiBmeD0iMC4zMDEwNzk3MzI2NTI2OTExNyIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNTEzNUZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1MTM1RkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcxIiBmeD0iMC4zNzk0OTg4NzY5MzE0MzMxIiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzEiIGZ4PSIwLjM4NTUxNTIxMzkyODg5NDY1IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjU4MjgiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzEiIGZ4PSIwLjM4NDAxMDg2MDYyNjMwMjYiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGNTgyOCI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY1ODI4IiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMiIgZng9IjAuMzE3NjMxNTU2MTMzMTgyNyIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmcyIiBmeD0iMC4zMDY2NzI0NjQ4MzA0NDM3IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGNjlDRkYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzIiIGZ4PSIwLjMyMzI4NDY3NDA0ODA2NzgiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y2OUNGRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRjY5Q0ZGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48cmFkaWFsR3JhZGllbnQgaWQ9InJnMyIgZng9IjAuMzY2NDE0MTU5NTYxNTA4OSIgZnk9IjAuNSI+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiIHN0b3Atb3BhY2l0eT0iMCI+PC9zdG9wPg0KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjxyYWRpYWxHcmFkaWVudCBpZD0icmczIiBmeD0iMC4zOTI2NDg3MDI3MDU4MDk1IiBmeT0iMC41Ij4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkE1MEYiPjwvc3RvcD4NCiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiIgc3RvcC1vcGFjaXR5PSIwIj48L3N0b3A+DQogICAgICAgIDwvcmFkaWFsR3JhZGllbnQ+PHJhZGlhbEdyYWRpZW50IGlkPSJyZzMiIGZ4PSIwLjM5NDIyNjE3ODA2NDczOTQiIGZ5PSIwLjUiPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGQTUwRiI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZBNTBGIiBzdG9wLW9wYWNpdHk9IjAiPjwvc3RvcD4NCiAgICAgICAgPC9yYWRpYWxHcmFkaWVudD48L2RlZnM+DQogICAgPHJlY3QgaWQ9ImJnIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC44Mjg4NjQxODMyODMxOTU3IDAuNjcxMDQyMjE5ODM1NzM1MSkgc2tld1goMjguNjU4Nzg0OTQzOTcwNzE2KSByb3RhdGUoMjAuOTMwOTYyMjk1NzgyMjg3KSB0cmFuc2xhdGUoNzQxLjM5NTkxOTYwMTkwNzggLTcxMy40ODE4OTk4MTY2MzA1KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xMDI0MTk1MTU2NTg2Mzc4IDAuOTM2NDY4ODk0Mzg5MTA2NSkgc2tld1goLTIuODAyMTUyMzc2NjQ3MjcxKSByb3RhdGUoMTM3LjQ2NzI3NDgwNTU5ODEyKSB0cmFuc2xhdGUoNzUwLjQ0MDUzNjA3NzAxNzcgMTMwOC40ODIwNDIwMTUyMDEpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjIyMDE0NjI4MzMzMzk0MjMgMS4wNjE0MzgzMzMwMjg2MjA4KSBza2V3WCgzMC41MzI2Mjg5NzQ5NzE1ODcpIHJvdGF0ZSg5Ni44NTgwMjUzOTY4MTk4NSkgdHJhbnNsYXRlKDI4OC43MTkxMzY0MDA0Mjk1IC03NTkuMDUyMzA4MTExNjQ5NSkgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QxIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDEuMTUyNTYzMzk4NTc5MTk3IDAuOTQ3NDEzNzc2MDc3Njc3Mykgc2tld1goMjYuNzg5OTk0Nzc4MjU1MTY0KSByb3RhdGUoMTg0LjAwMjkxNzk2MjkwMjI1KSB0cmFuc2xhdGUoNzQ1LjU1OTA0NjE4NjMzNzEgMTUuNTQ5NDc4MjY1NDg5MzU5KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4wODQxNjUxMzI4MzEyOTM2IDAuODQ0NjA5MDYwNDg3MDc2Nikgc2tld1goLTcuNTgzODY1OTc1MDg1NjE1KSByb3RhdGUoMjc4LjIxMDk3Nzg2MDc5NjUpIHRyYW5zbGF0ZSg4MDguNjU4ODUyOTQ1MDc3OSA5MjIuMjI4NTM4MzI2MjAwMikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0PjxyZWN0IGNsYXNzPSJyZWN0IHJlY3QwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAwIDE1MDApIHNjYWxlKDAuNzc3ODA3MDc4Mzc4MTM0OCAwLjkyMzk4NTkzNjMzNzM3NjYpIHNrZXdYKDM1LjY2OTY5NDM5NTY3NDUyNikgcm90YXRlKDIwNy44MTA0NjkzNDI1NTQzNykgdHJhbnNsYXRlKC0yMTIuMzg5NDcxODE1MjY3MjMgNTA0Ljk2MDI0NzQyMTM2OTgpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MCIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgxLjIxODIyMjA0NDAwNTUyNzEgMS4yMzQyNTMzMTQxNzY1MTMpIHNrZXdYKC0xOS40OTI2OTA1MDkxNjM0MjcpIHJvdGF0ZSgxNzIuNTI1Mjc2NTExNTkwODUpIHRyYW5zbGF0ZSgxMDU5Ljg0MjI5OTExMjE3NTQgLTY4My45MTI1MzE3NzU2ODk0KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC45OTQyOTk5MzU0NjAxODYyIDAuODcyMzM5ODYxMjY4NTIyNikgc2tld1goLTIxLjI3NjY3Mjk3MDk1NjkxNikgcm90YXRlKDI4Ny45Nzc3ODE5NjA0MDA3NikgdHJhbnNsYXRlKDgxLjQ5MDQ4ODUzMjA4NjQgLTU0Ni45OTgzODAzOTAwNjU2KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDEiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC45NzY5ODY0MzgyMTUzNjMgMS4yMjQ0MjIyNTA4MjQxNTU4KSBza2V3WCg0MC4wNDcwNTE4MjIwNTI4MzYpIHJvdGF0ZSgzMzkuODcyMDM1MTAyOTk0MDYpIHRyYW5zbGF0ZSgtNDQzLjYwNTQ4NDgzNDYzNTYgMzc5LjkwMjkyOTYwMTQyMTkzKSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDMiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMS4xMTEwMTMyMjkxODI4NjM0IDEuMDU5NTc4NDcxODA2MjkzMykgc2tld1goLTguNjc1NjYxMTE3Mzk2NzY0KSByb3RhdGUoNC4wMDczMDMwMzU2MDk0Mzc1KSB0cmFuc2xhdGUoNTIwLjg4ODkyODQ3NjAwNCA0NTcuNzg1NDMwODAzNjIxODYpIHRyYW5zbGF0ZSgtMTUwMCAtMTUwMCkiPjwvcmVjdD48cmVjdCBjbGFzcz0icmVjdCByZWN0MiIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwMCAxNTAwKSBzY2FsZSgwLjk5MzQyMDg1OTk1MTIwMTMgMC43MjIzMzc3NjMzNDg3MDI5KSBza2V3WCgzMS4zNjU1NzM2ODgxODM5NDMpIHJvdGF0ZSgyMDAuNTcyOTEzMDQyODExMikgdHJhbnNsYXRlKC02NjIuMTg4MDIxNTI2MjY2NCAtMTM4NC4wODY4OTcyMzc0MTQ5KSB0cmFuc2xhdGUoLTE1MDAgLTE1MDApIj48L3JlY3Q+PHJlY3QgY2xhc3M9InJlY3QgcmVjdDIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1MDAgMTUwMCkgc2NhbGUoMC43MzgwMDUxNjYwNTIyNDczIDEuMTc0NzY2MTk5OTU3Nzk2NSkgc2tld1goLTE1LjUxMDY5MDUwMTM3NjgyOCkgcm90YXRlKDExOS4yMTYwODQyMTEyNjA3OSkgdHJhbnNsYXRlKC0xMjYuMDIwNjQ1OTE3MDQ1NDMgLTMwMS42OTc4MDEwNTYyMDQzNikgdHJhbnNsYXRlKC0xNTAwIC0xNTAwKSI+PC9yZWN0Pg0KPC9zdmc+')",
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',

  },
  topContent: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: "5.5%",
    width: "100vw",
    marginLeft: "10%",
    // paddingBottom: "2.5%",
  },
  topContentMobile: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingTop: "8.5%",
    paddingBottom: "2.5%",

    width: "100vw",
    // paddingTop: "5.5%",

    overflow: "none",
    // height: "90vh",
  },
  headerMobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    // fontWeight: "900",
    fontSize: "30px",
    lineHeight: "35px",
    padding: 0,
    marginBottom: "15px",
    textAlign: "center",
    letterSpacing: "0.15px",
  },
  subtitleMobile: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    // fontWeight: "300",
    fontSize: "16px",
    lineHeight: "18px",
    textAlign: "center",
    letterSpacing: "0.15px",
    marginBottom: "58px",
    maxWidth: "300px !important",
    margin: "0 auto",
    // width: "90%",
  },
  subtitleMobileBottom: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    // fontWeight: "300",
    fontSize: "16px",
    lineHeight: "18px",
    textAlign: "center",
    letterSpacing: "0.15px",
    // marginBottom: "38px",
    maxWidth: "300px !important",
    margin: "38px auto",
    // width: "90%",
  },

  imgMobileDimen: {
    // height: "41%",
    // width: "96%",
    marginTop: 0,
    marginBottom: 0,
    // maxWidth: "70%",
    maxHeight: "45vh",
  },
  imgDimen: {
    width: "55%",
    // height: "32.4%",
    marginRight: "10%",
  },

  imgDimenEven: {
    width: "55%",
    height: "32.4%",
    marginLeft: "10%",
  },

  hidden: {
    display: "none",
  },
  buttonAcc: {
    textTransform: "none",
    marginTop: "5%",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    // width: "17vw",
    // height: "90vh",
    width: "255px",
    height: "45px",
  },
  buttonAccMobile: {
    textTransform: "none",
    marginTop: "20%",
    marginBottom: "8px",
    backgroundColor: "#6754D6",
    width: "183px",
    height: "36.21px",
  },

  buttonAccount: {
    textTransform: "none",
    marginTop: "10px",
    marginBottom: "10px",
    backgroundColor: "#6754D6",
    width: "183px",
    height: "36.21px",
  },

  logoBar: {
    width: "36%",
    minWidth: "600px",
  },
  logoBarMobile: {
    width: "66%",
  },

  headerDesk: {
    width: "400px",
    fontSize: "40px",
  },
  marginsMobile: {
    // width: "85vw",
    // padding: "0 3%",
  },
  evenPageContent: {
    display: "flex",
    marginTop: "7.5%",
    position: "absolute",
    width: "100vw",
    // marginRight: "15%",
    // left: "0",
    right: "7%",
  },

  pageContent: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "7.5%",
    position: "absolute",
    width: "100vw",
    marginRight: "15%",
    left: "7%",
  },

  pageContentMobile: {
    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",

    position: "absolute",

    margin: "0 4%",
    textAlign: "center",
    height: "90vh",
  },

  evenPageText: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    margin: "0px",
    textAlign: "right",
    left: "0",
  },

  pageText: {
    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
    margin: "0px",
    left: "0",
  },

  pageTextMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "0px",
    left: "0",
  },

  topPageFrame: {
    display: "flex",
    flexDirection: "column",
    margin: "0",
    padding: "0",
    background: `linear-gradient(
        179.6deg,
        #6754d6 -18.13%,
        rgba(111, 93, 216, 0.948419) 8.81%,
        rgba(113, 109, 134, 0.87) 50.81%,
        rgba(255, 255, 255, 0) 80.3%
      ),
      #424242`,
    mixBlendMode: "normal",
    opacity: "0.85",
    width: "100vw",
    position: "relative",
    left: "0",
    overflowX: "hidden",
  },

  topPageFrameMobile: {
    display: "flex",
    flexDirection: "column",

    padding: "0",
    background: `linear-gradient(
        179.6deg,
        #6754d6 -18.13%,
        rgba(111, 93, 216, 0.948419) 8.81%,
        rgba(113, 109, 134, 0.87) 50.81%,
        rgba(255, 255, 255, 0) 80.3%
      ),
      #424242`,
    mixBlendMode: "normal",
    opacity: "0.85",
    width: "100vw",
    left: "0",
    overflowX: "hidden",
  },

  oddPageFrame: {
    margin: "0 auto",
    padding: "0",

    mixBlendMode: "normal",
    opacity: "0.85",
    height: "100vh",
    width: "100%",
    position: "relative",
    left: "0",
  },

  oddPageFrameMobile: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    alignItems: "center",

    padding: "0",

    mixBlendMode: "normal",
    opacity: "0.85",
    height: "100vh",
    width: "100%",
    position: "relative",
    justifyContent: "center",
    left: "0",
  },

  evenPageFrame: {
    margin: "0 auto",
    padding: "0",

    mixBlendMode: "normal",
    opacity: "0.85",
    height: "100vh",
    width: "100%",
    position: "relative",
    left: "0",
  },

  evenPageFrameMobile: {
    margin: "0 auto",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    mixBlendMode: "normal",
    opacity: "0.85",
    height: "100vh",
    width: "100%",
    position: "relative",

    left: "0",
  },

  logoFrame: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",

    paddingLeft: "3%",
    paddingRight: "3%",

    position: "relative",
    height: "400px",
  },

  logoFrameMobile: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: "0",
    paddingLeft: "4%",
    paddingRight: "2%",
    width: "100%",
    position: "relative",
    height: "40vh",
  },
});

export default IndexStyling;
