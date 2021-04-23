const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const { createPolarFilePath } = require(`./src/utils/createPolarFilePath.js`);
const {
  DOCS_ORDER,
  getPlacementAndIndent,
} = require("./src/utils/docs_order.js");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  //include templates
  const blogPost = path.resolve(`./src/templates/blog-post.tsx`);
  const blog = path.resolve("./src/templates/BlogIndex.tsx");
  const docs = path.resolve("./src/templates/docs-page-temp.tsx");
  const result = await graphql(
    `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              frontmatter {
                title
                date
                layout
                permalink
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    throw result.errors;
  }
  const posts = result.data.allMarkdownRemark.edges;
  var numBlogPosts = 0;
  posts.forEach((post, index) => {
    //building docs pages
    if (post.node.frontmatter.layout === "doc") {
      createPage({
        path: post.node.fields.slug,
        component: docs,
        context: {
          slug: post.node.fields.slug,
        },
      });
    }
    //building blog pages
    else {
      numBlogPosts++;
      const previous =
        index === posts.length - 1 ? null : posts[index + 1].node;
      const next = index === 0 ? null : posts[index - 1].node;

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      });
    }
  });

  // Create blog post list pages
  // Code to create paginated blog
  const postsPerPage = 10;

  const numBlogPages = Math.ceil(numBlogPosts / postsPerPage);
  // console.log(numBlogPages);

  Array.from({ length: numBlogPages }).forEach((node, i) => {
    createPage({
      path: i === 0 ? `/blog/` : `/blog/${i + 1}`,
      component: blog,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numBlogPages,
        currentPage: i + 1,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    //onCreate docs nodes
    if (node.frontmatter.layout === "doc") {
      const placement_indent = getPlacementAndIndent(node.frontmatter.title);
      console.log("========== Working with node ID: " + node.id);
      // console.log("Working with node: ", node);
      createNodeField({
        name: `slug`,
        node,
        value:
          node.frontmatter.permalink === "/docs/index.html"
            ? "/docs/"
            : node.frontmatter.permalink,
      }),
        //doc placement in index
        createNodeField({
          name: `placement`,
          node,
          value: placement_indent[0],
        }),
        //indented in index or not
        createNodeField({
          name: `indent`,
          node,
          value: placement_indent[1],
        });
    }
    //onCreate Blog Nodes
    else {
      const gatsbyFilePath = createFilePath({ node, getNode });

      const polarLink = createPolarFilePath(gatsbyFilePath);
      createNodeField({
        name: `slug`,
        node,
        value: polarLink,
      });
    }
  }
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }
  });
};