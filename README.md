# A very opinionated frontend boilerplate

[![Greenkeeper badge](https://badges.greenkeeper.io/Lapanti/ts-react-boilerplate.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/Lapanti/ts-react-boilerplate/master.svg?style=flat-square)](https://travis-ci.org/Lapanti/ts-react-boilerplate) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT) [![Dependency Status](https://david-dm.org/lapanti/ts-react-boilerplate.svg?style=flat-square)](https://david-dm.org/lapanti/ts-react-boilerplate) [![DevDependency Status](https://img.shields.io/david/dev/lapanti/ts-react-boilerplate.svg?style=flat-square)](https://david-dm.org/lapanti/ts-react-boilerplate?type=dev) [![Coverage Status](https://img.shields.io/coveralls/Lapanti/ts-react-boilerplate/master.svg?style=flat-square)](https://coveralls.io/github/Lapanti/ts-react-boilerplate?branch=master) [![Code Climate](https://img.shields.io/codeclimate/issues/github/Lapanti/ts-react-boilerplate.svg?style=flat-square)](https://codeclimate.com/github/Lapanti/ts-react-boilerplate/issues)

## Purpose

This is all you need to get started in developing your own web application, using TypeScript, React, server-side rendering and all the other hip tools. If you know what you are doing, you can follow the [quick start guide](#quickstart) or you can go learn with the walk-through starting [here](/docs/STRUCTURE.md).

## Contents
- [Quick start guide](#quickstart)
    - [Requirements](#requirements)
    - [Download the source code](#download)
    - [Starting development](#startingdevelopment)
- [Tips and suggestions](#tipsandsuggestions)
- [How to Docker](#dockerization)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
    - [Development](#development)
    - [Testing](#testing)
    - [Roadmap](#roadmap)
- [License and contact information](#license)

## <a name="quickstart">Quick start guide</a>

### <a name="requirements">Requirements</a>
- If you don't already have it, install [Node](https://nodejs.org/en/download/)
- If you don't already have it, install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)

### <a name="download">Download the source code</a>
1. Open up your favorite kind of console
2. Navigate to the folder in which you want to store the source code
3. Run `git clone git@github.com:Lapanti/ts-react-boilerplate.git`

### <a name="startingdevelopment">Starting development</a>
1. Open up the source code in your favorite TypeScript-capable editor (I recommend [Visual Studio Code](https://code.visualstudio.com/) if you don't have a preference)
2. Run `yarn` in the console to install dependencies (it'll take a while on the first run, so go on and read ahead while you wait)
3. Read through the comments in all the source files to get yourself acquinted with the ideas, concepts and patterns
4. Start the application by running `yarn develop` in your console (inside the folder you downloaded the code to) and open up your browser in the address it prints out
5. Create a deployable version of the application by running `yarn build`
6. Start the deployable version by running `yarn start` or read the [How to Docker](#dockerization) guide to Dockerize your application
7. To test your application, run `yarn test`
8. Start modifying the code to build your own application

## <a name="tipsandsuggestions">Tips and suggestions</a>
- Make sure everything has a type (the more you squeeze out of the compiler the easier you're going to have it while developing)
- Follow [BEM](http://getbem.com/naming/)-naming with CSS
- Follow [Redux-ducks pattern](https://github.com/erikras/ducks-modular-redux) except that name the reducers as according to the file (see [HNClientReducer.tsx](/src/modules/hnClient/HNClientReducer.tsx) for an example)

## <a name="dockerization">How to Docker</a>
The [Dockerfile](/Dockerfile) is where you can find the configuration to build a [Docker](https://www.docker.com/) image out of your application. The first line of the `Dockerfile` (starting with `FROM`) includes the base for your Dockerfile, feel free to change it if you want to.
1. Put your email to the [fourth line in the Dockerfile](/Dockerfile#L4)
2. In your console run `docker build .`
3. In your console run `docker run -d -p 8080:8080 bd9b1d6725bc` **but** replace `bd9b1d6725bc` with the image ID you received from the previous command
4. Host your Docker image in your favorite cloud or local server (the web is filled with guides for this)

## <a name="dependencies">Dependencies</a>
The following are all the dependencies of the project, with the reasoning behind their inclusion:
- :package: [Yarn](https://yarnpkg.com/lang/en/) for package management
- :muscle: [TypeScript](https://www.typescriptlang.org/) for types
- :computer: [Express](https://expressjs.com/) for server-side rendering
- :eyes: [React](https://facebook.github.io/react/) to build the UI
    - :calling: [ReactDOM](https://facebook.github.io/react/docs/react-dom.html) to render the UI
    - :tada: [React-Redux](https://github.com/reactjs/react-redux) to bind Redux to React
    -  :milky_way: [React-Router](https://github.com/ReactTraining/react-router) for routes on the client
- :gift: [Redux](https://github.com/reactjs/redux) to handle state
    - :loop: [redux-observable](https://redux-observable.js.org/) to allow side-effects in Redux
        - :mag: [RxJs](https://github.com/ReactiveX/RxJS) for streams
- :electric_plug: [webpack](https://webpack.js.org/) to bundle JS files
    - :flashlight: [webpack-dev-server](https://webpack.js.org/configuration/dev-server/#src/components/Sidebar/Sidebar.jsx) to host client while developing
    - :punch: [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) to compile TypeScript in the webpack pipe
    - :wave: [babel](https://babeljs.io) to transpile our compiled JavaScript to ES5 using [babel-loader](https://webpack.js.org/loaders/babel-loader/#src/components/Sidebar/Sidebar.jsx)
    - :tongue: [sass-loader](https://webpack.js.org/loaders/sass-loader/#src/components/Sidebar/Sidebar.jsx) to compile SASS into CSS
- :pray: [Jest](https://facebook.github.io/jest/) for testing
    - :metal: [ts-jest](https://github.com/kulshekhar/ts-jest) to run Jest with TypeScript
    - :ok_hand: [TSlint](https://palantir.github.io/tslint/) for linting
    - :runner: [nock](https://github.com/node-nock/nock) to mock API calls
    - :question: [sass-lint](https://github.com/sasstools/sass-lint) to lint SASS
    - :bust_in_silhouette: [Enzyme](https://github.com/airbnb/enzyme) for snapshot and behavior testing
        - :cyclone: [Enzyme-to-JSON](https://github.com/adriantoine/enzyme-to-json) to enable Enzyme snapshots with Jest
        - :foggy: [enzyme-adapter-react-16](https://github.com/airbnb/enzyme/tree/master/packages/enzyme-adapter-react-16) to use Enzyme with React 16
- :nail_care: [SASS](https://github.com/sass/node-sass) for styles
- :two_hearts: [concurrently](https://github.com/kimmobrunfeldt/concurrently) to run multiple script concurrently

## <a name="contributing">Contributing</a>
Read the [contribution guidelines](./CONTRIBUTING.md)

### <a name="development">Development</a>
1. Clone this repo (or fork and clone)
2. Navigate to the directory in console
3. Run `yarn` in console
    - [Optional] Install livereload extension to your browser in [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) or [Firefox](https://addons.mozilla.org/en-gb/firefox/addon/livereload/)
4. Run `yarn develop` in console
5. Open your browser in the address printed to the console
6. Modify the code with your favorite editor

### <a name="testing">Testing</a>
- You can run all the tests with `yarn test`
    - *psst, you can update your snapshots with* `yarn test -- -u`
- You can run Jest tests in watch mode with `yarn test:watch`
- You can run all tests with coverage with `yarn test:ci`

### <a name="roadmap">Roadmap</a>

- [x] TypeScript
- [x] React
- [x] Redux
- [x] Server-side rendering
- [x] Browserify
- [x] SASS support
- [x] Add a test framework
- [x] Dockerize
- [ ] Deployment scripts to AWS
- [ ] `create-ts-react-boilerplate` scripts

## <a name="license">License and contact information</a>
You can contact me through here in Github or on [Twitter](https://twitter.com/laurilavanti)

All of the code is licensed under the [MIT license](LICENSE)
