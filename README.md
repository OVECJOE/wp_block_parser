# wp_block_parser

This is a parser for WordPress block editor blocks. It is written in TypeScript. It is a private library created for use in a WordPress plugin.

## npm-script

The commands are ordered alphabetically.

#### `pnpm run clean`

This command will clean up dist folder that is for build files(.js files)

```zsh
"clean": "rimraf dist/*",
```

#### `pnpm run dev:watch`

This commands allows run index.ts file without compile and monitor the changes on the file

```zsh
"dev:watch": "ts-node-dev --respwn src/index.ts",
```

#### `pnpm run dev`

This commands allows run index.ts file without compile

```zsh
"dev": "ts-node src/index.ts",
```

#### `pnpm run format`

This commands will format all files with the rules that are based on `.eslintrc.js`

```zsh
"format": "prettier --write 'src/**/*.{js,ts,json}'",
```

#### `pnpm run lint:all`

This command will lint all ts files and run `tsc` without generating any .js files

```zsh
"lint:all": "pnpm run lint && pnpm run tscCheck",
```

#### `pnpm run lint:fix`

This command runs `lint` and modify codes to fix lint errors.

```zsh
"lint:fx": "eslint src/**/*.ts --fix",
```

#### `pnpm run lint`

This command check all ts files with the rules that are based on `.eslintrc.js`

```zsh
"lint": "eslint src/**/*.ts",
```

#### `pnpm run start`

This command compiles ts files and run build file which is `dist/index.js`

```zsh
"start": "tsc && node dist/index.js",
```

#### `pnpm run tsc`

This compands ts files

```zsh
"tsc": "tsc",
```

#### `pnpm run tscCheck`

This command shows tsc compile errors if there are any issues.

```zsh
"tscCheck": "tsc --noEmit"
```

## TypeScript version

```zsh
$ npx tsc -V
Version 5.0.3
```

## ESLint + Prettier

```zsh
$ ./node_modules/.bin/eslint --version
v8.37.0

$ ./node_modules/.bin/prettier --version
2.8.7
```
