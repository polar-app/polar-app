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
      summary: `Read. Learn. Never Forget.`,
    },
    description: `Read. Learn. Never Forget.`,
    siteUrl: `https://getpolarized.io/`,
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
              maxWidth: 1280,
              quality: 100,
              withWebp: true,
              durationFadeIn: 100,
            },
          },
        ],
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-122721184-3",
      },
    },
    {
      resolve: `gatsby-plugin-amplitude-analytics`,
      options: {
        // Specify the API key for your Amplitude Project (required)
        apiKey: "c1374bb8854a0e847c0d85957461b9f0",
        // Puts tracking script in the head instead of the body (optional)
        head: false,
        // Prevents loading Amplitude and logging events if visitors have "Do Not Track" enabled (optional)
        respectDNT: true,
        // exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Override the default event types (optional)
        eventTypes: {
          outboundLinkClick: 'outboundLinkClick',
          pageView: 'pageView',
        },
        // Amplitude JS SDK configuration options (optional)
        amplitudeConfig: {
          sameSiteCookie: "Lax",
          domain: ".getpolarized.io",
          includeUtm: true,
          includeReferrer: true,
          saveEvents: true,
        },
        // Specify NODE_ENVs in which the plugin should be loaded (optional)
        environments: ["production"],
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
        icon: `content/assets/icon-32.png`,
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
