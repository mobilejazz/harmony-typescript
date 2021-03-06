# ![Mobile Jazz Badge](https://raw.githubusercontent.com/mobilejazz/metadata/master/images/icons/mj-40x40.png) Harmony Typescript

This repository contains the core structure for typescript of the Mobile Jazz Harmony project.

## Initial Setup

- Ensure [NVM](https://github.com/nvm-sh/nvm) is installed on your system
- `nvm install`: install the NodeJS version required by Harmony TS
- `nvm use`: ensure we're using the proper NodeJS version
- `npm ci`: install root dependencies
- `npx lerna exec -- npm ci`: install packages dependencies
- `npx lerna bootstrap`: replace internal modules as symlinks (required to apply changes to the library)

Anytime you're working in the project ensure you `nvm use` to stay on the correct NodeJS version.

## Publish new version

- `git checkout master`: ensure you're on `master`
- `nvm use`: ensure we're using the proper NodeJS version
- `npm whoami`: ensure you're using the correct NPM user (`npm login` if not)
- `npm run publish`: run at root `package.json`
