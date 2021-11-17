import * as React from "react"
import { Box, ThemeProvider, CssBaseline } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import "./intra-index.css";
import { MUIAnchor } from "../../../../../packages/polar-bookshelf/web/js/mui/MUIAnchor";

const useStyles = makeStyles({
  background: {
    padding: "15px",
    // maxHeight: "40vh",
    marginRight: "200px",
  },

  indexItem: {
    padding: "5px 0px",
    color: "#e0e0e0",
    textDecoration: "none",
  },
  hidden: { display: "none" },
});

export default function IntraPageIndex({ headers, hiddenBelow }) {
  // console.log(headers[0]);
  const classes = useStyles();
  return (
    <Box className={hiddenBelow ? classes.hidden : "background"}>
      <Box
        className="scrollbox"
        style={{
          backgroundColor: "#606060",

          position: "fixed",
          width: "200px",
          maxHeight: "90vh",
          padding: "15px",
          overflowX: "hidden",
        }}
      >
        <Box
          style={{
            marginBottom: "10px",
            borderBottom: "1.5px solid #816DE8",
            fontWeight: 500,
          }}
        >
          <MUIAnchor style={{ color: "#e0e0e0", textDecoration: "none" }} href="#">
            What's Covered Here:
          </MUIAnchor>
        </Box>
        {headers.map(({ value, depth }) => {
          return (
            <Box className={classes.indexItem}>
              <Box
                style={{ color: "#e0e0e0", textDecoration: "none" }}
                className={"indent" + depth}
              >
                <a
                  style={{ color: "#e0e0e0", textDecoration: "none" }}
                  href="#"
                >
                  {value}
                </a>
              </Box>
            </Box>
          );
        })}
        <div className="cover-barIntra"></div>
      </Box>
    </Box>
  );
}
