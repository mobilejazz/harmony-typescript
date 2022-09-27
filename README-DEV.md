# Harmony TypeScript Development

This mono-repository contains the TypeScript packages of Mobile Jazz Harmony _framework_.

## Initial Setup

-   Ensure [NVM](https://github.com/nvm-sh/nvm) is installed on your system
-   `nvm install`: install the NodeJS version required by Harmony TS
-   `nvm use`: ensure we're using the proper NodeJS version
-   `npm run setup`:
    -   install root dependencies
    -   bootstrap: replace internal modules as symlinks and deduplicate packages installing them on root `node_modules`
    -   build packages

Anytime you're working in the project ensure you `nvm use` to stay on the correct NodeJS version.

## Publish new version

-   `git checkout master`: ensure you're on `master`
-   `nvm use`: ensure we're using the proper NodeJS version
-   `npm whoami`: ensure you're using the correct NPM user (`npm login` if not)
-   `npm run publish`: run at root `package.json`
