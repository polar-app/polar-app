/* Copyright 2012 Mozilla Foundation
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

import { normalizeWheelEventDelta, PresentationModeState } from "./ui_utils.js";

const DELAY_BEFORE_RESETTING_SWITCH_IN_PROGRESS = 1500; // in ms
const DELAY_BEFORE_HIDING_CONTROLS = 3000; // in ms
const ACTIVE_SELECTOR = "pdfPresentationMode";
const CONTROLS_SELECTOR = "pdfPresentationModeControls";
const MOUSE_SCROLL_COOLDOWN_TIME = 50; // in ms
const PAGE_SWITCH_THRESHOLD = 0.1;

// Number of CSS pixels for a movement to count as a swipe.
const SWIPE_MIN_DISTANCE_THRESHOLD = 50;

// Swipe angle deviation from the x or y axis before it is not
// considered a swipe in that direction any more.
const SWIPE_ANGLE_THRESHOLD = Math.PI / 6;

/**
 * @typedef {Object} PDFPresentationModeOptions
 * @property {HTMLDivElement} container - The container for the viewer element.
 * @property {PDFViewer} pdfViewer - The document viewer.
 * @property {EventBus} eventBus - The application event bus.
 */

class PDFPresentationMode {
  /**
   * @param {PDFPresentationModeOptions} options
   */
  constructor({ container, pdfViewer, eventBus }) {
    this.container = container;
    this.pdfViewer = pdfViewer;
    this.eventBus = eventBus;

    this.active = false;
    this.args = null;
    this.contextMenuOpen = false;
    this.mouseScrollTimeStamp = 0;
    this.mouseScrollDelta = 0;
    this.touchSwipeState = null;
  }

  /**
   * Request the browser to enter fullscreen mode.
   * @returns {boolean} Indicating if the request was successful.
   */
  request() {
    if (this.switchInProgress || this.active || !this.pdfViewer.pagesCount) {
      return false;
    }
    this._addFullscreenChangeListeners();
    this._setSwitchInProgress();
    this._notifyStateChange();

    if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen();
      } else {
        return false;
      }
    } else {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen();
      } else if (this.container.mozRequestFullScreen) {
        this.container.mozRequestFullScreen();
      } else if (this.container.webkitRequestFullscreen) {
        this.container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else {
        return false;
      }
    }

    this.args = {
      page: this.pdfViewer.currentPageNumber,
      previousScale: this.pdfViewer.currentScaleValue,
    };

    return true;
  }

  /**
   * @private
   */
  _mouseWheel(evt) {
    if (!this.active) {
      return;
    }

    evt.preventDefault();

    const delta = normalizeWheelEventDelta(evt);
    const currentTime = Date.now();
    const storedTime = this.mouseScrollTimeStamp;

    // If we've already switched page, avoid accidentally switching again.
    if (
      currentTime > storedTime &&
      currentTime - storedTime < MOUSE_SCROLL_COOLDOWN_TIME
    ) {
      return;
    }
    // If the scroll direction changed, reset the accumulated scroll delta.
    if (
      (this.mouseScrollDelta > 0 && delta < 0) ||
      (this.mouseScrollDelta < 0 && delta > 0)
    ) {
      this._resetMouseScrollState();
    }
    this.mouseScrollDelta += delta;

    if (Math.abs(this.mouseScrollDelta) >= PAGE_SWITCH_THRESHOLD) {
      const totalDelta = this.mouseScrollDelta;
      this._resetMouseScrollState();
      const success =
        totalDelta > 0
          ? this.pdfViewer.previousPage()
          : this.pdfViewer.nextPage();
      if (success) {
        this.mouseScrollTimeStamp = currentTime;
      }
    }
  }

  get isFullscreen() {
    if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
      return !!document.fullscreenElement;
    }
    return !!(
      document.fullscreenElement ||
      document.mozFullScreen ||
      document.webkitIsFullScreen
    );
  }

  /**
   * @private
   */
  _notifyStateChange() {
    let state = PresentationModeState.NORMAL;
    if (this.switchInProgress) {
      state = PresentationModeState.CHANGING;
    } else if (this.active) {
      state = PresentationModeState.FULLSCREEN;
    }

    if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("MOZCENTRAL")) {
      this.eventBus.dispatch("presentationmodechanged", {
        source: this,
        state,
      });
    } else {
      this.eventBus.dispatch("presentationmodechanged", {
        source: this,
        state,
        get active() {
          throw new Error(
            "Deprecated parameter: `active`, please use `state` instead."
          );
        },
        get switchInProgress() {
          throw new Error(
            "Deprecated parameter: `switchInProgress`, please use `state` instead."
          );
        },
      });
    }
  }

  /**
   * Used to initialize a timeout when requesting Presentation Mode,
   * i.e. when the browser is requested to enter fullscreen mode.
   * This timeout is used to prevent the current page from being scrolled
   * partially, or completely, out of view when entering Presentation Mode.
   * NOTE: This issue seems limited to certain zoom levels (e.g. page-width).
   *
   * @private
   */
  _setSwitchInProgress() {
    if (this.switchInProgress) {
      clearTimeout(this.switchInProgress);
    }
    this.switchInProgress = setTimeout(() => {
      this._removeFullscreenChangeListeners();
      delete this.switchInProgress;
      this._notifyStateChange();
    }, DELAY_BEFORE_RESETTING_SWITCH_IN_PROGRESS);
  }

  /**
   * @private
   */
  _resetSwitchInProgress() {
    if (this.switchInProgress) {
      clearTimeout(this.switchInProgress);
      delete this.switchInProgress;
    }
  }

  /**
   * @private
   */
  _enter() {
    this.active = true;
    this._resetSwitchInProgress();
    this._notifyStateChange();
    this.container.classList.add(ACTIVE_SELECTOR);

    // Ensure that the correct page is scrolled into view when entering
    // Presentation Mode, by waiting until fullscreen mode in enabled.
    setTimeout(() => {
      this.pdfViewer.currentPageNumber = this.args.page;
      this.pdfViewer.currentScaleValue = "page-fit";
    }, 0);

    this._addWindowListeners();
    this._showControls();
    this.contextMenuOpen = false;

    // Text selection is disabled in Presentation Mode, thus it's not possible
    // for the user to deselect text that is selected (e.g. with "Select all")
    // when entering Presentation Mode, hence we remove any active selection.
    window.getSelection().removeAllRanges();
  }

  /**
   * @private
   */
  _exit() {
    const page = this.pdfViewer.currentPageNumber;
    this.container.classList.remove(ACTIVE_SELECTOR);

    // Ensure that the correct page is scrolled into view when exiting
    // Presentation Mode, by waiting until fullscreen mode is disabled.
    setTimeout(() => {
      this.active = false;
      this._removeFullscreenChangeListeners();
      this._notifyStateChange();

      this.pdfViewer.currentScaleValue = this.args.previousScale;
      this.pdfViewer.currentPageNumber = page;
      this.args = null;
    }, 0);

    this._removeWindowListeners();
    this._hideControls();
    this._resetMouseScrollState();
    this.contextMenuOpen = false;
  }

  /**
   * @private
   */
  _mouseDown(evt) {
    if (this.contextMenuOpen) {
      this.contextMenuOpen = false;
      evt.preventDefault();
      return;
    }
    if (evt.button === 0) {
      // Enable clicking of links in presentation mode. Note: only links
      // pointing to destinations in the current PDF document work.
      const isInternalLink =
        evt.target.href && evt.target.classList.contains("internalLink");
      if (!isInternalLink) {
        // Unless an internal link was clicked, advance one page.
        evt.preventDefault();

        if (evt.shiftKey) {
          this.pdfViewer.previousPage();
        } else {
          this.pdfViewer.nextPage();
        }
      }
    }
  }

  /**
   * @private
   */
  _contextMenu() {
    this.contextMenuOpen = true;
  }

  /**
   * @private
   */
  _showControls() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    } else {
      this.container.classList.add(CONTROLS_SELECTOR);
    }
    this.controlsTimeout = setTimeout(() => {
      this.container.classList.remove(CONTROLS_SELECTOR);
      delete this.controlsTimeout;
    }, DELAY_BEFORE_HIDING_CONTROLS);
  }

  /**
   * @private
   */
  _hideControls() {
    if (!this.controlsTimeout) {
      return;
    }
    clearTimeout(this.controlsTimeout);
    this.container.classList.remove(CONTROLS_SELECTOR);
    delete this.controlsTimeout;
  }

  /**
   * Resets the properties used for tracking mouse scrolling events.
   *
   * @private
   */
  _resetMouseScrollState() {
    this.mouseScrollTimeStamp = 0;
    this.mouseScrollDelta = 0;
  }

  /**
   * @private
   */
  _touchSwipe(evt) {
    if (!this.active) {
      return;
    }
    if (evt.touches.length > 1) {
      // Multiple touch points detected; cancel the swipe.
      this.touchSwipeState = null;
      return;
    }

    switch (evt.type) {
      case "touchstart":
        this.touchSwipeState = {
          startX: evt.touches[0].pageX,
          startY: evt.touches[0].pageY,
          endX: evt.touches[0].pageX,
          endY: evt.touches[0].pageY,
        };
        break;
      case "touchmove":
        if (this.touchSwipeState === null) {
          return;
        }
        this.touchSwipeState.endX = evt.touches[0].pageX;
        this.touchSwipeState.endY = evt.touches[0].pageY;
        // Avoid the swipe from triggering browser gestures (Chrome in
        // particular has some sort of swipe gesture in fullscreen mode).
        evt.preventDefault();
        break;
      case "touchend":
        if (this.touchSwipeState === null) {
          return;
        }
        let delta = 0;
        const dx = this.touchSwipeState.endX - this.touchSwipeState.startX;
        const dy = this.touchSwipeState.endY - this.touchSwipeState.startY;
        const absAngle = Math.abs(Math.atan2(dy, dx));
        if (
          Math.abs(dx) > SWIPE_MIN_DISTANCE_THRESHOLD &&
          (absAngle <= SWIPE_ANGLE_THRESHOLD ||
            absAngle >= Math.PI - SWIPE_ANGLE_THRESHOLD)
        ) {
          // Horizontal swipe.
          delta = dx;
        } else if (
          Math.abs(dy) > SWIPE_MIN_DISTANCE_THRESHOLD &&
          Math.abs(absAngle - Math.PI / 2) <= SWIPE_ANGLE_THRESHOLD
        ) {
          // Vertical swipe.
          delta = dy;
        }
        if (delta > 0) {
          this.pdfViewer.previousPage();
        } else if (delta < 0) {
          this.pdfViewer.nextPage();
        }
        break;
    }
  }

  /**
   * @private
   */
  _addWindowListeners() {
    this.showControlsBind = this._showControls.bind(this);
    this.mouseDownBind = this._mouseDown.bind(this);
    this.mouseWheelBind = this._mouseWheel.bind(this);
    this.resetMouseScrollStateBind = this._resetMouseScrollState.bind(this);
    this.contextMenuBind = this._contextMenu.bind(this);
    this.touchSwipeBind = this._touchSwipe.bind(this);

    window.addEventListener("mousemove", this.showControlsBind);
    window.addEventListener("mousedown", this.mouseDownBind);
    window.addEventListener("wheel", this.mouseWheelBind, { passive: false });
    window.addEventListener("keydown", this.resetMouseScrollStateBind);
    window.addEventListener("contextmenu", this.contextMenuBind);
    window.addEventListener("touchstart", this.touchSwipeBind);
    window.addEventListener("touchmove", this.touchSwipeBind);
    window.addEventListener("touchend", this.touchSwipeBind);
  }

  /**
   * @private
   */
  _removeWindowListeners() {
    window.removeEventListener("mousemove", this.showControlsBind);
    window.removeEventListener("mousedown", this.mouseDownBind);
    window.removeEventListener("wheel", this.mouseWheelBind, {
      passive: false,
    });
    window.removeEventListener("keydown", this.resetMouseScrollStateBind);
    window.removeEventListener("contextmenu", this.contextMenuBind);
    window.removeEventListener("touchstart", this.touchSwipeBind);
    window.removeEventListener("touchmove", this.touchSwipeBind);
    window.removeEventListener("touchend", this.touchSwipeBind);

    delete this.showControlsBind;
    delete this.mouseDownBind;
    delete this.mouseWheelBind;
    delete this.resetMouseScrollStateBind;
    delete this.contextMenuBind;
    delete this.touchSwipeBind;
  }

  /**
   * @private
   */
  _fullscreenChange() {
    if (this.isFullscreen) {
      this._enter();
    } else {
      this._exit();
    }
  }

  /**
   * @private
   */
  _addFullscreenChangeListeners() {
    this.fullscreenChangeBind = this._fullscreenChange.bind(this);

    window.addEventListener("fullscreenchange", this.fullscreenChangeBind);
    if (typeof PDFJSDev === "undefined" || !PDFJSDev.test("MOZCENTRAL")) {
      window.addEventListener("mozfullscreenchange", this.fullscreenChangeBind);
      window.addEventListener(
        "webkitfullscreenchange",
        this.fullscreenChangeBind
      );
    }
  }

  /**
   * @private
   */
  _removeFullscreenChangeListeners() {
    window.removeEventListener("fullscreenchange", this.fullscreenChangeBind);
    if (typeof PDFJSDev === "undefined" || !PDFJSDev.test("MOZCENTRAL")) {
      window.removeEventListener(
        "mozfullscreenchange",
        this.fullscreenChangeBind
      );
      window.removeEventListener(
        "webkitfullscreenchange",
        this.fullscreenChangeBind
      );
    }

    delete this.fullscreenChangeBind;
  }
}

export { PDFPresentationMode };
