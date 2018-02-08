# yarn-example

## Install Yarn

Just go to the [Yarn offcia website](https://yarnpkg.com/en/), and download then install it.

When you successfully install it, you can use
```
yarn version
```
If everything is right, then you can see the version of yarn and the version of your project.
(__By default__, your project version is 1.0.0, and is recorded in package.json)

## Yarn Usage

There is a [table](https://yarnpkg.com/en/docs/migrating-from-npm) showing the difference between npm and yarn, also you can find a lot of commands which you usally used in npm, please check it.

Be noticed, command **yarn add "packageName"** will automaticlly save this package.

Namely, there is no need to add parameter like **--save**.
(There is *no way* you can install a package without touching packages.json by yarn!)

And you can use **yarn add "packageName" [-dev / -peer / -prod]** to add [different types of dependency](https://yarnpkg.com/lang/en/docs/dependency-types/) on these packages.

## Yarn Script

Yarn also provides script, and the detail is [here](https://yarnpkg.com/zh-Hans/docs/cli/run).

For example, here is part of your packages.json
```
...
  "scripts": {
    "test": "echo Just a test",
    "build": "echo This command will do build",
    "start": "echo This command will start the project"
  },
...
```
Then you can use
```
yarn run build // or yarn build
```
to run the build script.

## Yarn self-update 

It seems that the only way to update Yarn itself is use the msi offered by official website on windows.

There is an [issue](https://github.com/yarnpkg/yarn/issues/1139) related to it.
