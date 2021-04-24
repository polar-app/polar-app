

const DOCS_ORDER = [
  
  "Getting Started", 0,
  "Frequently Asked Questions (FAQ)", 0,
  "Key Bindings for Common Polar Operations", 1,
  "Folders", 0,
  "Mobile", 0,
  "Bulk Import", 0,
  "Web Page Capture and Archival of HTML Content", 0,
  "Annotation Sidebar", 0,
  "Cloud Sync", 0,
  "Spaced Repetition and Reading Review", 0,
  "Anki Sync for Spaced Repetition", 1,
  "Incremental Reading", 0,
  "Pagemarks", 1,
  "New Pagemark Design", 1,
  "Backups", 0,
  "Pre-Release Builds", 0,
  "Sharing and Collaboration", 0,
  "'Add to Polar' Button for Easily Adding Documents to Polar", 0,
  "Tracking Policy", 0,
  "Support", 0,
  "Roadmap", 0,
  "Reporting Bugs", 0,
];

// let replaceWithForwardSlash = function (

const getPlacementAndIndent = function (title) {

  for (var x = 0; x < DOCS_ORDER.length; x = x + 2) {
    if (title === DOCS_ORDER[x]) {
      return [x / 2, DOCS_ORDER[x + 1]];
    }
  }

  return 0;

};

module.exports = {
  DOCS_ORDER: DOCS_ORDER,
  getPlacementAndIndent: getPlacementAndIndent,
};