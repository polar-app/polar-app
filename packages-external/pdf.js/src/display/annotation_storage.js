/* Copyright 2020 Mozilla Foundation
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

import { deprecated } from "./display_utils.js";
import { objectFromMap } from "../shared/util.js";

/**
 * Key/value storage for annotation data in forms.
 */
class AnnotationStorage {
  constructor() {
    this._storage = new Map();
    this._modified = false;

    // Callbacks to signal when the modification state is set or reset.
    // This is used by the viewer to only bind on `beforeunload` if forms
    // are actually edited to prevent doing so unconditionally since that
    // can have undesirable efffects.
    this.onSetModified = null;
    this.onResetModified = null;
  }

  /**
   * Get the value for a given key if it exists, or return the default value.
   *
   * @public
   * @memberof AnnotationStorage
   * @param {string} key
   * @param {Object} defaultValue
   * @returns {Object}
   */
  getValue(key, defaultValue) {
    const obj = this._storage.get(key);
    return obj !== undefined ? obj : defaultValue;
  }

  /**
   * @deprecated
   */
  getOrCreateValue(key, defaultValue) {
    deprecated("Use getValue instead.");
    if (this._storage.has(key)) {
      return this._storage.get(key);
    }

    this._storage.set(key, defaultValue);
    return defaultValue;
  }

  /**
   * Set the value for a given key
   *
   * @public
   * @memberof AnnotationStorage
   * @param {string} key
   * @param {Object} value
   */
  setValue(key, value) {
    const obj = this._storage.get(key);
    let modified = false;
    if (obj !== undefined) {
      for (const [entry, val] of Object.entries(value)) {
        if (obj[entry] !== val) {
          modified = true;
          obj[entry] = val;
        }
      }
    } else {
      this._storage.set(key, value);
      modified = true;
    }
    if (modified) {
      this._setModified();
    }
  }

  getAll() {
    return this._storage.size > 0 ? objectFromMap(this._storage) : null;
  }

  get size() {
    return this._storage.size;
  }

  /**
   * @private
   */
  _setModified() {
    if (!this._modified) {
      this._modified = true;
      if (typeof this.onSetModified === "function") {
        this.onSetModified();
      }
    }
  }

  resetModified() {
    if (this._modified) {
      this._modified = false;
      if (typeof this.onResetModified === "function") {
        this.onResetModified();
      }
    }
  }

  /**
   * PLEASE NOTE: Only intended for usage within the API itself.
   * @ignore
   */
  get serializable() {
    return this._storage.size > 0 ? this._storage : null;
  }
}

export { AnnotationStorage };
