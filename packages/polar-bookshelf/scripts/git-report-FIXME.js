#!/bin/bash

// FIXME: I'm not parsing the output right... ...

const {execSync} = require('child_process');

function toLines(data) {
  const arr = data.split('\n')

  if (arr.length > 0 && arr[arr.length - 1] === '') {
    arr.pop();
  }

  return arr;
}

function lsFiles() {
  const stdout = execSync('git ls-files');
  return toLines(stdout.toString('utf-8'));
}

function gitAnnotate(path) {
  const stdout = execSync(`bash -c 'git annotate ${path} | grep FIXME || true'`);
  return toLines(stdout.toString('utf-8'));
}

function parseGitAnnotateLine(line) {

  function parseCommitMetaWithCode() {

    const regexp = '\t\(([^)]+\)).(.*)$';
    const r = new RegExp(regexp);

    const match = r.exec(line);

    if (match) {
      return [match[1], match[3]];
    }

    throw new Error("Unable to find commit metadata and code");
  }

  const [commitMeta, code] = parseCommitMetaWithCode();

  const commitMetaFields = commitMeta.split('\t');
  const [username, date, lineNumber] = commitMetaFields;
  return [date, code];

}

function gitAnnotateProcessFile(annotated, path) {

  for (const line of annotated) {
    const [date, code] = parseGitAnnotateLine(line);
    console.log(`${date} ${path} ${code}`);
  }

}

function head(data) {
  return [data[0]];
}

const files = lsFiles();

for(const file of files) {
  console.error('file: ' + file);
  const annotated = gitAnnotate(file);
  gitAnnotateProcessFile(annotated, file);
}
