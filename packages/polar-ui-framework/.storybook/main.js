
// TODO
// https://storybook.js.org/addons/@storybook/addon-viewport
// https://storybook.js.org/addons/@storybook/addon-storyshots
// https://storybook.js.org/addons/@storybook/addon-console

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-dark-mode",
    "@storybook/addon-viewport"
  ]
}
