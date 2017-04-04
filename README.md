# A very opinionated frontend boilerplate
[![Build Status](https://travis-ci.org/Lapanti/ts-react-boilerplate.svg?branch=master)](https://travis-ci.org/Lapanti/ts-react-boilerplate) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Dependency Status](https://gemnasium.com/badges/github.com/Lapanti/ts-react-boilerplate.svg)](https://gemnasium.com/github.com/Lapanti/ts-react-boilerplate)

## Purpose

This is all you need to get started in developing your own web application, using TypeScript, React, server-side rendering and all the other hip tools. All the source code is well-documented and explains its purpose. You can read the [getting started guide here](#getstarted)

## Contents
- [Getting started](#getstarted)
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

## <a name="getstarted">Getting started</a>

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
4. Start the application by running `yarn run develop` in your console (inside the folder you downloaded the code to) and open up your browser in the address it prints out
    - If you want the use of [LiveReload](http://livereload.com/), install a browser extension in [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) or [Firefox](https://addons.mozilla.org/en-gb/firefox/addon/livereload/)
5. Create a deployable version of the application by running `yarn run build`
6. Start the deployable version by running `yarn run start` or read the [How to Docker](#dockerization) guide to Dockerize your application
7. To test your application, run `yarn run test`
8. Start modifying the code to build your own application

## <a name="tipsandsuggestions">Tips and suggestions</a>
- Make sure everything has a type (the more you squeeze out of the compiler the easier you're going to have it while developing)
- Follow [BEM](http://getbem.com/naming/)-naming with CSS
- Follow [Redux-ducks pattern](https://github.com/erikras/ducks-modular-redux) except that name the reducers as according to the file (see [IndexReducer.tsx](src/modules/index/IndexReducer.tsx) for an example)

## <a name="dockerization">How to Docker</a>
The [Dockerfile](Dockerfile) is where you can find the configuration to build a [Docker](https://www.docker.com/) image out of your application. The first line of the `Dockerfile` (starting with `FROM`) includes the base for your Dockerfile, feel free to change it if you want to.
1. Put your email to the [fourth line in the Dockerfile](Dockerfile#L4)
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
- :electric_plug: [browserify](http://browserify.org/) to bundle JS files
    - :flashlight: [budō](https://github.com/mattdesl/budo) to host client while developing
    - :punch: [tsify](https://github.com/TypeStrong/tsify) to compile TypeScript in the browserify pipe
- :pray: [Jest](https://facebook.github.io/jest/) for testing
    - :metal: [ts-jest](https://github.com/kulshekhar/ts-jest) to run Jest with TypeScript
    - :ok_hand: [TSlint](https://palantir.github.io/tslint/) for linting
    - :runner: [nock](https://github.com/node-nock/nock) to mock API calls
    - :question: [sass-lint](https://github.com/sasstools/sass-lint) to lint SASS
    - :bust_in_silhouette: [Enzyme](https://github.com/airbnb/enzyme) for snapshot and behavior testing
        - :cyclone: [Enzyme-to-JSON](https://github.com/adriantoine/enzyme-to-json) to enable Enzyme snapshots with Jest
- :nail_care: [SASS](https://github.com/sass/node-sass) for styles
- :two_hearts: [concurrently](https://github.com/kimmobrunfeldt/concurrently) to run multiple script concurrently

## <a name="contributing">Contributing</a>
First read the (as-of-yet-nonexistent) CONTRIBUTING guideline

### <a name="development">Development</a>
1. Clone this repo (or fork and clone)
2. Navigate to the directory in console
3. Run `yarn` in console
    - [Optional] Install livereload extension to your browser in [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) or [Firefox](https://addons.mozilla.org/en-gb/firefox/addon/livereload/)
4. Run `yarn run develop` in console
5. Open your browser in the address printed to the console
6. Modify the code with your favorite editor

### <a name="testing">Testing</a>
- You can run all the tests with `yarn run test`
    - *psst, you can update your snapshots with* `yarn run test -- -u`
- You can run Jest tests in watch mode with `yarn run test:watch`
- You can run all tests with coverage with `yarn run test:ci`

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
