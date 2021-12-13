git fetch
TEMP_VERSION='\"0.0.0\"'
CURRENT_VERSION=$(git tag | tr - \~ | sort -V | tr \~ - | tail -n1)
VERSION=$(semver $CURRENT_VERSION -i)
NEW_VERSION="\\\""$VERSION"\\\""
git merge-base $CURRENT_VERSION HEAD --is-ancestor || (echo "YOU CANNOT RELEASE AN OUTDATED BRANCH" && exit 1)
pnpm -r --no-bail exec -- sed -i "s/$TEMP_VERSION/$NEW_VERSION/g" package.json || true
git tag -a "$VERSION" -m "automated tag version $VERSION"
LATEST_VERSION=$(git tag | tr - \~ | sort -V | tr \~ - | tail -n1)
echo -e "Current Latest Version is $LATEST_VERSION" && echo -e "Pushing New Tag"
LOG=$(git log --pretty=format:"• %b\\n" --merges $LATEST_VERSION...$CURRENT_VERSION | sort | uniq | tr '\r\n' ' ') || LOG="• fix: Minor Fixes for Release"
~/go/bin/ghr -t ${GITHUB_TOKEN} -u ${CIRCLE_PROJECT_USERNAME} -r ${CIRCLE_PROJECT_REPONAME} -c ${CIRCLE_SHA1} -delete ${LATEST_VERSION}
TEMP_DATE=$(date +"%a %b %d %Y")
echo "export DATE=\"$TEMP_DATE\"" >> $BASH_ENV
echo "export TAG=\"$LATEST_VERSION\"" >> $BASH_ENV
echo "export CHANGELOG=\"$LOG\"" >> $BASH_ENV