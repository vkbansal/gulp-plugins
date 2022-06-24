# Gulp Plugins

A collection of [gulp](https://gulpjs.com/) plugins used across my projects.

## List of Plugins

- `sass`: Plugin to compile [SCSS](https://sass-lang.com/) to CSS using [dart-sass](https://github.com/sass/dart-sass)
- `if`: Plugin to conditionally pipe streams
- `files-hash`: Plugin to append hashes to files, for cache-busting

## Installation

```bash
# using npm
npm add -D @vkbansal/gulp-plugins sass
# or using yarn
yarn add -D @vkbansal/gulp-plugins sass
```

> Note: Installing `sass` is only required if your using the sass plugin

## Usage

```
import { gulpSass, gulpIf, gulpFilesHash  } from '@vkbansal/gulp-plugins'
```

## License

MIT
