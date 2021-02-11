import {MetadataEngines} from "./metadata/MetadataEngines";
import {DefaultMetadataEngine} from "./metadata/impl/DefaultMetadataEngine";
import escapeHtml from 'escape-html';
import {Graphs} from "./metadata/jsonld/Graph";
import {Permalinks} from "./metadata/Permalinks";

/**
 * Generate a static index.html file custom for each URL.
 */
export class StaticIndexGenerator {

    public static async generate(url: string): Promise<string> {

        // this needs to be kept in sync with /apps/repository/index.html

        const metadataEngineHandlerRef = MetadataEngines.compute(url);

        const metadataEngine = metadataEngineHandlerRef.engine;

        console.log(`Handling URL ${url} with engine ${metadataEngine.constructor.name} for ${metadataEngineHandlerRef.source}`);

        const computedPage = await metadataEngine.compute(url);

        const page = computedPage || DefaultMetadataEngine.createDefaultPage(url);

        const canonicalizeURL = (url: string) => {
            return Permalinks.absolute(url);
        };

        const escapeAttr = (text: string) => {
            return escapeHtml(text).replace(/[\r\n]+/g, " ");
        };

        const graph = Graphs.create([page.article, ...(page.comments || [])]);
        const jsonld = JSON.stringify(graph, null, "  ");

        return `<!DOCTYPE html>
<html lang="en" class="ui-mode-light">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">

    <link rel="chrome-webstore-item"
          href="https://chrome.google.com/webstore/detail/jkfdkjomocoaljglgddnmhcbolldcafd">

    <meta name="google-site-verification" content="j5BBM8XbyOumZOvUQGaej0asCNz6NERVdssDydibUl0" />

    <link rel="manifest" href="/manifest.json">

    <link rel="icon" href="/icon.ico">

    <!-- TODO: these need to load locally before we enable firebase in production -->
    <script src="/node_modules/firebase/firebase.js"></script>
    <script src="/node_modules/firebaseui/dist/firebaseui.js"></script>
    <link rel="stylesheet" href="/node_modules/firebaseui/dist/firebaseui.css" />

    <link rel="stylesheet" href="/node_modules/react-table/react-table.css">

    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap-grid.min.css">
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap-reboot.min.css">

    <link rel="stylesheet" href="/node_modules/toastr/build/toastr.min.css">

    <link rel="stylesheet" href="/pdfviewer-custom/flexbar.css">
    <link rel="stylesheet" href="/pdfviewer-custom/progress.css">
    <link rel="stylesheet" href="/pdfviewer-custom/typography.css">
    <link rel="stylesheet" href="/pdfviewer-custom/toaster.css">
    <link rel="stylesheet" href="/pdfviewer-custom/twitter-bootstrap.css">
    <link rel="stylesheet" href="/pdfviewer-custom/pricing.css">
    <link rel="stylesheet" href="/pdfviewer-custom/ui-mode.css">
    <link rel="stylesheet" href="/node_modules/@fortawesome/fontawesome-free/css/all.min.css">
    <link rel="stylesheet" href="/node_modules/@burtonator/react-dropdown/dist/react-dropdown.css">

    <link rel="stylesheet" href="/apps/repository/css/index.css">
    <link rel="stylesheet" href="/apps/repository/css/light-theme.css">
    <!--<link rel="stylesheet" href="/apps/repository/css/dark-theme.css">-->

    <!-- TODO -->
    <title>Polar: ${escapeAttr(page.title)}</title>

    <meta name="description" content="${escapeAttr(page.description || '')}" />
    <link rel="canonical" href="${escapeAttr(canonicalizeURL(page.canonical))}" />

    <meta property="og:description" content="${escapeAttr(page.description || '')}" />
    <meta property="og:url" content="${escapeAttr(canonicalizeURL(page.canonical))}" />
    <meta property="og:site_name" content="POLAR - Easily manage your PDFs, web content, and notes." />
    <meta property="og:image" content="${escapeAttr(canonicalizeURL(page.image.url))}" />
    <meta name="twitter:image" content="${escapeAttr(canonicalizeURL(page.image.url))}">
    <meta name="twitter:card"  content="${page.card}">
    <meta name="twitter:description" content="${escapeAttr(page.description || '')}">
    <meta name="twitter:title" content="${escapeAttr(page.title)}">
    <meta name="twitter:site" content="@getpolarized">

    <script type="application/ld+json">
        ${jsonld}
    </script>

  </head>
  <body>

    <noscript>

      <a href="https://getpolarized.io/">Polar</a> allows you to easily manage
      your PDFs, web content, and notes and supports advanced features like
      <a href="https://app.getpolarized.io/groups">group sharing</a> of
      documents.

    </noscript>

    <div id="root" style="height: 100%;">

      <div id="loading-v1"
           style="display: flex; position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;">
        <!-- a simple loading widget -->

        <div style="margin: auto; ">
          <img class="logo" width="250" height="250" src="/icon.svg"/>
        </div>

      </div>

    </div>

  </body>

  <script src="/apps/service-worker-registration.js"></script>
  <script src="/apps/init.js"></script>

  <script>

      const fallbackLoader = () => {

          // REQUIRE_ENTRY_POINT: there seems to be an Electron bug where when
          // loading over HTTP we can't find node_modules until we require().  We can
          // only find standard modules like 'fs' and 'electron' but not custom
          // modules so we have to just have these four lines repeated over and over
          // for each of our main apps.  In the future we should try to track down
          // why this is happening but I spent 1-2 hours on trying to figure out
          // the root cause with no resolution and this is a temporary workaround.
          const {remote} = require('electron');
          const path = require('path');
          const appPath = remote.getGlobal("appPath");
          require(path.join(appPath, "apps", "repository", "js", "entry.js"));

      };

      injectApp('/web/dist/repository-bundle.js', fallbackLoader);

  </script>

</html>
`;
    }

}
