#!/usr/bin/env node

// lerna exec backgrounds everything and this isn't what we want.

const fs = require('fs');
const paths = require('path');
const child_process = require('child_process');

function getPackagesGlobs() {
    const data = fs.readFileSync("lerna.json");
    const content = data.toString('utf-8');
    const obj = JSON.parse(content);
    return obj.packages;
}

/**
 * Get directories from the given path.
 */
function getDirs(path) {
    const files = fs.readdirSync(path);

    const result = [];

    for (const file of files) {
        const dirPath = paths.join(path, file);

        const stat = fs.statSync(dirPath);

        if (stat.isDirectory()) {
            result.push(dirPath);
        }

    }

    return result;

}

function getDirsForGlob(glob) {
    const path = glob.substring(0, glob.length - 2);
    return getDirs(path);
}

/**
 * Verify that this is a package dir or return undefined.
 */
function verifyPackageDir(dir) {

    const stat = fs.statSync(dir);

    if (! stat.isDirectory()) {
        return undefined;
    }

    if (! fs.existsSync(paths.join(dir, 'package.json'))) {
        return undefined;
    }

    return dir;

}

function verifyPackageDirs(dirs) {

    const result = [];

    for (const dir of dirs) {
        if (verifyPackageDir(dir)) {
            result.push(dir);
        }
    }

    return result;

}

function removeAbsent(list) {
    return list.filter(current => current !== undefined && current !== null);
}

function getPackageDirs() {

    const result = [];

    for (const package of getPackagesGlobs()) {

        if (package.endsWith("/*")) {
            result.push(...verifyPackageDirs(getDirsForGlob(package)));
        } else {
            result.push(...verifyPackageDirs([package]));
        }

    }

    return result;

}

function run_script(command, args) {

    return new Promise((resolve, reject) => {

        const child = child_process.spawn(command, args);

        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');

        child.stdout.on('data', function(data) {
            console.log(data);
        });

        child.stderr.on('data', function(data) {
            console.error(data);
        });

        child.on('close', function(code) {

            if (code !== 0) {
                reject(code);
            }

            resolve();

        });

    });

}

async function exec(args) {

    const packageDirs = getPackageDirs();

    const dir = process.cwd();

    for (const packageDir of packageDirs) {

        console.log("====");
        console.log(packageDir);

        try {

            process.chdir(packageDir);

            const cmd = args.join(" ");
            console.log("Running " + cmd);
            await run_script("bash", ["-c", cmd]);

        } catch(e) {
            console.log("Command failed with: ", e);
        } finally {
            process.chdir(dir);
        }

    }

}

exec(process.argv.slice(2)).catch(err => console.error(err));
