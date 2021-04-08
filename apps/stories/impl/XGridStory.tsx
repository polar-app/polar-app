import * as React from "react";
import { XGrid } from "@material-ui/x-grid";

const columns = [
  { field: "title", headerName: "Title", flex: 1 },
  { field: "added", headerName: "Added", width: 118 },
  { field: "updated", headerName: "Updated", width: 135 },
  { field: "tags", headerName: "Tags", width: 250 },
  { field: "progress", headerName: "Progress", width: 142 },
];

const row = {
  id: 1,
  title: "Some random test pdf title",
  added: "1 hour",
  updated: "1 minute",
  tags: "",
  progress: "",
};

export default function XGridStory() {
  const rows = [];
  for (let i = 1; i < 2000; i++) {
    rows.push({ ...row, id: row.id + i, title: row.title + i });
  }
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
