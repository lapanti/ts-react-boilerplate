# A very opinionated frontend boilerplate
[![Build Status](https://travis-ci.org/Lapanti/ts-react-boilerplate.svg?branch=master)](https://travis-ci.org/Lapanti/ts-react-boilerplate) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Dependency Status](https://gemnasium.com/badges/github.com/Lapanti/ts-react-boilerplate.svg)](https://gemnasium.com/github.com/Lapanti/ts-react-boilerplate)

## Dependencies
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
    - :ok_hand: [TSlint](https://palantir.github.io/tslint/) for linting
    - :runner: [nock](https://github.com/node-nock/nock) to mock API calls
    - :question: [lesshint](https://github.com/lesshint/lesshint) to lint less
    - :bust_in_silhouette: [Enzyme](https://github.com/airbnb/enzyme) for snapshot and behavior testing
        - :cyclone: [Enzyme-to-JSON](https://github.com/adriantoine/enzyme-to-json) to enable Enzyme snapshots with Jest
- :nail_care: [{less}](http://lesscss.org/) for styles
    - :kiss: [less-plugin-clean-css](https://github.com/less/less-plugin-clean-css) to clean, minify and add compatibility to CSS
    - :sparkles: [less-simple-watcher](https://github.com/jonycheung/deadsimple-less-watch-compiler) for watching less
- :two_hears: [concurrently](https://github.com/kimmobrunfeldt/concurrently) to run multiple script concurrently
  
## Develop

0. Clone this repo (or fork and clone)
1. Navigate to the directory in console
2. `yarn install`
    - [Optional] Install livereload extension to your browser:
        - [Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en)
        - [Firefox](https://addons.mozilla.org/en-gb/firefox/addon/livereload/)
3. `yarn run develop`
4. Open `localhost:9966`

## Testing

- You can run all tests with `yarn run test`
    - *psst, you can update your snapshots with* `yarn run test -- -u`
- You can run Jest tests in watch mode with `yarn run test:watch`
- You can test your coverage with `yarn run test:coverage`

## Development tips
- Follow [BEM](http://getbem.com/naming/)-naming with CSS
- Follow [Redux-ducks pattern](https://github.com/erikras/ducks-modular-redux) except that name the reducers as according to the file (see IndexReducer.tsx for example)

## Deployment (not working yet)

0. Clone this repo (or fork and clone)
1. Navigate to the directory in console
2. `yarn install`
3. `yarn run build`
4. `yarn run start`

## How to Docker

* `docker build .`
* `docker run -d -p 8888:8888 bd9b1d6725bc` **but** replace `bd9b1d6725bc` with the image ID you received from the previous command

## Roadmap

* [x] TypeScript
* [x] React
* [x] Redux
* [x] Server-side rendering
* [x] Browserify
* [x] [{less}](http://lesscss.org/) support
* [x] Add a test framework
* [x] Dockerize
* [ ] Deployment scripts to AWS
