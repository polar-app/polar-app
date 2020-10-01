const myCustomQueries = {
  xs: "(max-width: 320px)",
  ms: "(max-width: 570px)",
  sm: "(max-width: 720px)",

  md: "(max-width: 1024px)",
  tab: "(max-width: 1259px)",
  l: "(max-width: 1536px)",
};

module.exports = {
  siteMetadata: {
    title: `Polar`,
    author: {
      name: `Polar Team`,
      summary: `A place to catch up on all things productivity... and all things Polar!`,
    },
    description: `Proof of concept gatsby + MUI + typescript + Markdown`,
    siteUrl: `https://https://gatsby-mui.web.app/`,
    social: {
      twitter: `getpolarized`,
      // twitterImage:
    },
  },
  plugins: [
    `gatsby-theme-material-ui`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/docs`,
        name: `docs`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // maxWidth: 590,
              quality: 100,
              withWebp: true
            },
          },
        ],
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Polar`,
        short_name: `Polar`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        display: `minimal-ui`,
        icon: `content/assets/polar-icon.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-plugin-breakpoints",
      options: {
        queries: myCustomQueries,
      },
    },
  ],
};
