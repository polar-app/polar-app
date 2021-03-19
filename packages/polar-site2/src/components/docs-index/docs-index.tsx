// Gatsby supports TypeScript natively!
import * as React from "react"
import { Box } from "@material-ui/core";
import { Button } from "gatsby-material-ui-components";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
var window = require("global/window");

import { useBreakpoint } from "gatsby-plugin-breakpoints";

// import "./testCss.css";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// import Scrollbar from "react-scrollbars-custom";
import "./fadeInScroll.css";

const drawerWidth: number = 360;

type Node = {
  node: {
    frontmatter: {
      title: string;
      date: string;
      large_image: string;
      permalink: string;
    };
    excerpt: string;
    fields: {
      slug: string;
      indent: number;
    };
  };
};

const useStyles = makeStyles((theme) => ({
  // list: {
  //   // width: "100%",
  //   // maxWidth: 360,
  //   maxWidth: "280px",
  //   backgroundColor: theme.palette.background.paper,
  //   overflowY: "scroll",

  //   // paddingTop: "20%",
  //   // height: "100vh",
  // },

  // sideBar{
  //   margin:'0 auto'
  // },
  nested: {
    // paddingLeft: theme.spacing(4),
    marginLeft: theme.spacing(3.5),
    // padding: "7px 0 5px 10px",
    // marginRight: theme.spacing(4),
    overflow: "none",
    maxWidth: "inherit",
    // borderLeft: "1.5px solid #816DE8",
    borderRadius: "0",
    fontWeight: 300,
    fontSize: "14px",
    textTransform: "none",
    padding: "2px 5px 2px 14px",
  },

  default: {
    padding: "2px 5px 2px 14px",

    fontWeight: 300,
    fontSize: "14px",
    // lineHeight: "12px",
    textTransform: "none",
  },
  drawerPaper: {
    width: drawerWidth,
    // marginLeft: "14vw",
    // marginRight: "9%",
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    marginRight: "5%",

    // marginLeft: "20%",
  },

  indexMob: {
    height: "auto",
    display: "flex",
    justifyContent: "center",
  },

  indexDesk: {
    // height: "10%",
    position: "fixed",
    // marginBottom: "100px",
    // marginRight: " 10%",
  },

  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  form: {
    padding: "50px auto 30px auto",

    margin: "30px auto 20px auto",
    width: "80vw",
    borderBottom: "none",
    boxShadow: " 8px 5px 10px 3px #333",
  },
  formMobile: {
    margin: "15px auto",
    // maxWidth: "515px",
    width: "83vw",
    boxShadow: " 8px 5px 10px 3px #333",
    textOverflow: "ellipsis",
  },
  highlighted: {
    // color: "#8c75ff",
    fontWeight: 700,
    // borderRight: "2px solid #816DE8",
    borderRadius: "0px",
    padding: "2px 5px 2px 14px",

    textTransform: "none",
  },
}));

export default function docsIndex({ docs, currTitle }) {
  const breakpoints = useBreakpoint();
  const classes = useStyles();

  return (
    <Box className={breakpoints.sm ? classes.indexMob : classes.indexDesk}>
      {breakpoints.sm ? (
        <MobileDocsIndex currTitle={currTitle} docs={docs} />
      ) : (
        <DesktopDocsIndex currTitle={currTitle} docs={docs} />
      )}
    </Box>
  );
}

function MobileDocsIndex({ docs, currTitle }) {
  const classes = useStyles();
  const container =
    window !== undefined ? () => window().document.body : undefined;
  var numbering: number = 0;
  const [state, setState] = React.useState({
    age: "",
    name: "hai",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    // console.log("---" + event.target.value);
    window.location.href = event.target.value;

    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const redirect = (newLoc) => {
    window.location.href = newLoc;
    return "complete";
  };

  // console.log(currTitle);
  // var expandedMob = expanded;
  var is_mobile =
    !!navigator.userAgent.match(/iphone|android|blackberry/gi) || false;
  // console.log("--" + is_mobile);
  // window.addEventListener('resize', alert(window.innerWidth));
  if (is_mobile) {
    return (
      <FormControl className={classes.formMobile}>
        <Select
          native
          value="test"
          onChange={handleChange}
          inputProps={{
            name: "age",
            id: "age-native-simple",
          }}
          style={{
            border: "none",
            padding: "5px 5px",
          }}
        >
          <option
            style={{ textOverflow: "ellipsis" }}
            aria-label="None"
            value="test"
          >
            {currTitle}
          </option>
          {docs.map(({ node }) => {
            var enableNested = node.fields.indent;
            if (!enableNested) {
              numbering++;
            }
            const title = node.frontmatter.title || node.frontmatter.permalink;
            return (
              <option
                className={!enableNested ? classes.default : classes.nested}
                value={node.frontmatter.permalink}
              >
                {!enableNested ? numbering + ". " : ""}
                {title}
              </option>
            );
          })}
          {/* <option aria-label="None" value="">
            
          </option>
          <option
            style={{ marginLeft: "40px" }}
            value={"/docs/bulk-import.html"}
          >
            Twenty
          </option>
          <option value={"/docs"}>Thirty</option> */}
        </Select>
      </FormControl>

      //   {/* <List
      //   // style={{ height: "50px" }}
      //   // className={classes.expandableList}
      //   component="nav"
      //   aria-labelledby="nested-list-subheader"
      // >
      //   {docs.map(({ node }) => {
      //     var enableNested = node.fields.indent;
      //     if (!enableNested) {
      //       numbering++;
      //     }
      //     const title = node.frontmatter.title || node.frontmatter.permalink;
      //     return (
      //       <Box key={title}>
      //         <ListItem
      //           className={enableNested ? classes.nested : classes.default}
      //           component={Button}
      //           href={node.frontmatter.permalink}
      //         >
      //           {!enableNested && numbering + "."} {title}
      //         </ListItem>
      //       </Box>
      //     );
      //   })}
      // </List> */}
      //   {/* <Button style={{ marginLeft: "400px" }} onClick={toggleExpand}>
      //   {" "}
      //   CHANGE
      // </Button> */}
    );
  } else {
    return (
      <Box>
        <FormControl className={classes.form}>
          {/* <InputLabel htmlFor="age-native-simple">Document Nav</InputLabel> */}
          <Select
            value="test"
            onChange={handleChange}
            inputProps={{
              name: "age",
              id: "age-native-simple",
            }}
            style={{ border: "none", padding: "5px 5px" }}
          >
            <MenuItem
              style={{
                borderBottom: "3px solid #816DE8",
                paddingLeft: "40px",
                padding: "5px 5px",
              }}
              disabled
              aria-label="None"
              value="test"
            >
              {currTitle}
            </MenuItem>
            {docs.map(({ node }) => {
              var enableNested = node.fields.indent;
              if (!enableNested) {
                numbering++;
              }
              const title =
                node.frontmatter.title || node.frontmatter.permalink;
              return (
                <MenuItem
                  className={!enableNested ? classes.default : classes.nested}
                  value={node.frontmatter.permalink}
                >
                  {!enableNested ? numbering + ". " : ""}
                  {title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    );
  }
}

function DesktopDocsIndex({ docs, currTitle }) {
  const classes = useStyles();
  var numbering: number = 0;
  // window.addEventListener('resize', alert(window.innerWidth));
  return (
    <Box className="sideBar">
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className="list"
      >
        {docs.map(({ node }) => {
          var enableNested = node.fields.indent;
          if (!enableNested) {
            numbering++;
          }
          const title = node.frontmatter.title || node.frontmatter.permalink;
          const currentPage = node.frontmatter.title === currTitle;
          return (
            <Box
              className={enableNested ? classes.nested : classes.default}
              key={title}
            >
              <ListItem
                className={currentPage ? classes.highlighted : classes.default}
                //

                component={Button}
                href={node.frontmatter.permalink}
              >
                {title}
              </ListItem>
            </Box>
          );
        })}
      </List>
      <div className="cover-bar"></div>
    </Box>
  );
}
