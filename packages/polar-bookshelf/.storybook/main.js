module.exports = {
  core: {
    builder: "webpack5"
  },
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../apps/**/*.stories.mdx",
    "../apps/**/*.stories.@(js|jsx|ts|tsx)",
    "../web/js/**/*.stories.mdx",
    "../web/js/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  framework: "@storybook/react",
  "webpackFinal": async (config, { configType }) => {

    // config.resolve = {};

    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      path: false,
      crypto: false,
      stream: false,
      os: false
    };

    return config;
  }
}
