let createPolarFilePath = function (filePath) {
  const indicesToReplace = [5, 8, 11]
  const finalURL = replaceWithForwardSlash(filePath, indicesToReplace)
  // console.log(finalURL)
  return finalURL
}

let replaceWithForwardSlash = function (toMod, indices) {
  const appendHTML = ".html"
  toMod = toMod.substring(0, toMod.length - 1)
  toMod = toMod.split("")
  for (x = 0; x < indices.length; x++) {
    toMod[indices[x]] = "/"
  }
  toMod = toMod.join("")
  toMod = toMod.concat(appendHTML)
  // console.log("tomod: " + toMod)
  return toMod
}

module.exports = {
  createPolarFilePath: createPolarFilePath,
}
