
// TODO
// https://storybook.js.org/addons/@storybook/addon-viewport
// https://storybook.js.org/addons/@storybook/addon-storyshots
// https://storybook.js.org/addons/@storybook/addon-console
// https://storybook.js.org/addons/@storybook/addon-actions/
// https://storybook.js.org/addons/storybook-facelift/

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
