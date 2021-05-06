/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AnnotationLayerBuilder,
  DefaultAnnotationLayerFactory,
} from "./annotation_layer_builder.js";
import {
  DefaultTextLayerFactory,
  TextLayerBuilder,
} from "./text_layer_builder.js";
import { EventBus, ProgressBar } from "./ui_utils.js";
import { PDFLinkService, SimpleLinkService } from "./pdf_link_service.js";
import { DownloadManager } from "./download_manager.js";
import { GenericL10n } from "./genericl10n.js";
import { NullL10n } from "./l10n_utils.js";
import { PDFFindController } from "./pdf_find_controller.js";
import { PDFHistory } from "./pdf_history.js";
import { PDFPageView } from "./pdf_page_view.js";
import { PDFScriptingManager } from "./pdf_scripting_manager.js";
import { PDFRenderingQueue } from "./pdf_rendering_queue.js";
import { PDFSinglePageViewer } from "./pdf_single_page_viewer.js";
import { PDFViewer } from "./pdf_viewer.js";

// eslint-disable-next-line no-unused-vars
const pdfjsVersion = PDFJSDev.eval("BUNDLE_VERSION");
// eslint-disable-next-line no-unused-vars
const pdfjsBuild = PDFJSDev.eval("BUNDLE_BUILD");

export {
  AnnotationLayerBuilder,
  DefaultAnnotationLayerFactory,
  DefaultTextLayerFactory,
  DownloadManager,
  EventBus,
  GenericL10n,
  NullL10n,
  PDFFindController,
  PDFHistory,
  PDFLinkService,
  PDFPageView,
  PDFRenderingQueue,
  PDFScriptingManager,
  PDFSinglePageViewer,
  PDFViewer,
  ProgressBar,
  SimpleLinkService,
  TextLayerBuilder,
};
