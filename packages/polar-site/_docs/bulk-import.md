---
title: Bulk Import
layout: doc
date: 2019-01-25 09:00:00 -0800
permalink: /docs/bulk-import.html
description: Polar allows you to bulk import one or more PDFs from a directory on you local disk and imports them into your repository. 
---

# Bulk Import

Polar allows you to bulk import one or more PDFs from a directory on you local
disk and imports them into your repository.

If you have cloud sync enabled they're automatically imported into the cloud.

Multiple files can be imported by selecting more than one.   

## Metadata

We attempt to extract metadata from the PDF - specifically the document title.

If no metadata is available we revert to the filename as the title (including
extension).

## Limitations

- We do not currently (2018-01-25) support recursively adding directories.

- We do not currently (2018-01-25) support DOI metadata extraction for PDFs.  
  This is something we're actively investigating including DOI/arxiv metadata
  resolution using public APIs.  
