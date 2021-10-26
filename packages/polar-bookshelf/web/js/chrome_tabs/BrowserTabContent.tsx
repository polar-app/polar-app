import React from "react";

interface BrowserTabContent {
  readonly children?: React.ReactNode;
  readonly index: any;
  readonly value: any;
}

export function BrowserTabContent(props: BrowserTabContent) {
  const { children, value, index, ...other } = props;

  const display = value === index ? "flex" : "none";

  return (
    <div
      role="tabpanel"
      style={{
        flexGrow: 1,
        display
      }}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}
