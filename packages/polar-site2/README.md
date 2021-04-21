# Polar Site
Redesigned Polar site rendered server-side with Gatsby, deployed with Firebase.


## Utilities
### Index Ordering for Documentation
The file `src/utils/docs_order.js` contains an array whose order designates the order of the docs index. Each entry is followed by a 1 (indented) or a 0 (non-indented).
Change the order, add, or delete items from this array to alter the docs index (`src/components/docs-index`). Rebuild the site to see changes.

### Featured Articles
In order to determine which articles populate the *featured articles* component (`src/components/blog-aside-box`) on the top right of the desktop blog layout, a new frontmatter item was added to blog posts. "editorsChoice" is a bool that, if true, dictates that an article should be in the *featured articles* box.

### Preserved URLs for blog articles


## Theming / Styling
Uses the gatsby-theme-material-ui plugin.

### theme.js
The theme that controls the majority of the coloring and properties for default html tags across the site

### docsTheme.js
The html tags already in the documentation / blog posts created poorly formatted docs / blog posts. `docsTheme.js` is a nested theme that fixes formatting issues and displays the md files with design consistent with the rest of the site.

### indexStyling.js
All styling for the index page. Split into second file purely for convenience. 

### blogPost.css
Just centers images with the img-fluid class in the blog posts. 

## Sitemap
Uses the gatsby-plugin-sitemap plugin. As of now, only a basic sitemap, all of the priorities and change frequencies are identical. However, every link is present (excluding /404).

## Notable Packages / Plugins
### react-reveal
Responsible for fade animation. (Animation currently disabled)

### react-helmet
Injects code into the pages `<head></head>` tags. Here it is used to add metadata to improve SEO and appearance of links on social media.

### gatsby-plugin-breakpoints
Provides breakpoints within jsx 

### gatsby-transformer-remark
Processes .md files

### gatsby-remark-images
Processes images within .md files

### gatsby-plugin-sharp
Low level image processing plugin used by gatsby-remark-images

### ink / ink-box
Used by gatsby CLI

## Page Generation
### src/pages
Every .tsx file in src/pages is rendered into a page with its path determined by the filename. This accounts for all pages that are not generated from `.md `files

### `src/templates`
Contains the templates for the  documentation page, blog,and each blog post. These templates ar filled in / used by `gatsby-node.js `

## To Build and Deploy
1. Clone Repo
2. Run `npm install`
3. Run `npm run build-deploy`
