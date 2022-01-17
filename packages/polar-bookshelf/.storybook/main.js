module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../apps/**/*.stories.mdx",
    "../apps/**/*.stories.@(js|jsx|ts|tsx)",
    "../web/js/**/*.stories.mdx",
    "../web/js/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/react"
}
