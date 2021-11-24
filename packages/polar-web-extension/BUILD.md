# Doing a release

pnpm run clean
npx webpack
export POLAR_EXTENSION_TYPE=BETA
./dist.sh
