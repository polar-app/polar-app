import * as React from "react";
import { XGrid } from "@material-ui/x-grid";

const columns = [
  {
    field: "id",
    hide: true,
  },
  { field: "title", headerName: "Title", flex: 1 },
  { field: "added", headerName: "Added", width: 118 },
  { field: "updated", headerName: "Updated", width: 135 },
  { field: "tags", headerName: "Tags", width: 250 },
  { field: "progress", headerName: "Progress", width: 142 },
];

const rows = [
  {
    id: 0,
    title: "Test1 Super Long title to test what the width would be",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 1,
    title: "Test 2",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 2,
    title: "Random Title",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 3,
    title: "Another Title",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 4,
    title: "Some fun pdf",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 5,
    title:
      "Test1 Super Long title to test what the width would be, Test1 Super Long title to test what the width would be Test1 Super Long title to test what the width would be",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 6,
    title: "",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 7,
    title: "Best pdf",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 8,
    title: "pdf for testing",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 9,
    title: "some random title",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
  {
    id: 10,
    title: "The last title",
    added: "1 hour",
    updated: "1 minute",
    tags: "",
    progress: "",
  },
];

export default function XGridStory() {
  return (
    <XGrid
      columns={columns}
      rows={rows}
      rowHeight={38}
      hideFooter={true}
      checkboxSelection
    />
  );
}
